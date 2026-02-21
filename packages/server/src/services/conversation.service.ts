import { prisma } from '../lib/prisma.js';

export async function createConversation(
  type: 'direct' | 'group',
  creatorId: number,
  participantIds: number[],
  title?: string,
) {
  // For direct conversations, check if one already exists
  if (type === 'direct' && participantIds.length === 1) {
    const existing = await findDirectConversation(creatorId, participantIds[0]);
    if (existing) return existing;
  }

  // Ensure creator is included in participants
  const allParticipantIds = [...new Set([creatorId, ...participantIds])];

  const conversation = await prisma.conversation.create({
    data: {
      type,
      title: title ?? null,
      participants: {
        create: allParticipantIds.map((userId) => ({
          userId,
          role: userId === creatorId ? 'admin' : 'member',
        })),
      },
    },
    include: {
      participants: {
        include: {
          user: {
            select: { id: true, username: true, displayName: true, avatarUrl: true },
          },
        },
      },
    },
  });

  return formatConversation(conversation, creatorId);
}

export async function findDirectConversation(userId1: number, userId2: number) {
  const conversation = await prisma.conversation.findFirst({
    where: {
      type: 'direct',
      AND: [
        { participants: { some: { userId: userId1 } } },
        { participants: { some: { userId: userId2 } } },
      ],
    },
    include: {
      participants: {
        include: {
          user: {
            select: { id: true, username: true, displayName: true, avatarUrl: true },
          },
        },
      },
      messages: {
        orderBy: { createdAt: 'desc' },
        take: 1,
        include: {
          sender: { select: { id: true, username: true } },
        },
      },
    },
  });

  if (!conversation) return null;
  return formatConversation(conversation, userId1);
}

export async function getConversations(userId: number, page = 1, limit = 20) {
  const where = {
    participants: { some: { userId } },
  };

  const [conversations, total] = await Promise.all([
    prisma.conversation.findMany({
      where,
      include: {
        participants: {
          include: {
            user: {
              select: { id: true, username: true, displayName: true, avatarUrl: true },
            },
          },
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          include: {
            sender: { select: { id: true, username: true } },
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.conversation.count({ where }),
  ]);

  return {
    data: conversations.map((c) => formatConversation(c, userId)),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getConversation(conversationId: number, userId: number) {
  const conversation = await prisma.conversation.findFirst({
    where: {
      id: conversationId,
      participants: { some: { userId } },
    },
    include: {
      participants: {
        include: {
          user: {
            select: { id: true, username: true, displayName: true, avatarUrl: true },
          },
        },
      },
      messages: {
        orderBy: { createdAt: 'desc' },
        take: 1,
        include: {
          sender: { select: { id: true, username: true } },
        },
      },
    },
  });

  if (!conversation) return null;
  return formatConversation(conversation, userId);
}

export async function addParticipant(conversationId: number, userId: number) {
  return prisma.conversationParticipant.create({
    data: {
      conversationId,
      userId,
      role: 'member',
    },
  });
}

function formatConversation(c: any, currentUserId: number) {
  const lastMsg = c.messages?.[0] ?? null;
  const participant = c.participants?.find((p: any) => p.userId === currentUserId);
  const lastReadAt = participant?.lastReadAt;

  // Count unread messages
  let unreadCount = 0;
  if (lastReadAt && lastMsg) {
    // We just check if last message is after lastReadAt for now
    // Full count requires a query, but for list view this is sufficient
    unreadCount = new Date(lastMsg.createdAt) > new Date(lastReadAt) ? 1 : 0;
  } else if (lastMsg && !lastReadAt) {
    unreadCount = 1;
  }

  return {
    id: c.id,
    type: c.type,
    title: c.title,
    tripId: c.tripId,
    participants: c.participants.map((p: any) => ({
      id: p.id,
      userId: p.user.id,
      username: p.user.username,
      displayName: p.user.displayName,
      avatarUrl: p.user.avatarUrl,
      role: p.role,
      joinedAt: p.joinedAt.toISOString(),
      lastReadAt: p.lastReadAt?.toISOString() ?? null,
    })),
    lastMessage: lastMsg
      ? {
          id: lastMsg.id,
          senderId: lastMsg.senderId,
          senderUsername: lastMsg.sender.username,
          body: lastMsg.body,
          messageType: lastMsg.messageType,
          createdAt: lastMsg.createdAt.toISOString(),
        }
      : null,
    unreadCount,
    createdAt: c.createdAt.toISOString(),
    updatedAt: c.updatedAt.toISOString(),
  };
}
