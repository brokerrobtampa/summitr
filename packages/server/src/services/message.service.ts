import { prisma } from '../lib/prisma.js';
import { wsManager } from '../lib/ws-manager.js';

export async function sendMessage(
  conversationId: number,
  senderId: number,
  body: string,
  messageType = 'text',
  metadata?: Record<string, unknown>,
) {
  // Verify sender is a participant
  const participant = await prisma.conversationParticipant.findUnique({
    where: { conversationId_userId: { conversationId, userId: senderId } },
  });
  if (!participant) throw new Error('Not a participant in this conversation');

  // Create message and update conversation timestamp
  const [message] = await Promise.all([
    prisma.message.create({
      data: {
        conversationId,
        senderId,
        body,
        messageType,
        metadata: metadata ? JSON.stringify(metadata) : null,
      },
      include: {
        sender: {
          select: { id: true, username: true, displayName: true, avatarUrl: true },
        },
      },
    }),
    prisma.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() },
    }),
    // Auto-mark sender as having read up to now
    prisma.conversationParticipant.update({
      where: { conversationId_userId: { conversationId, userId: senderId } },
      data: { lastReadAt: new Date() },
    }),
  ]);

  const formatted = formatMessage(message);

  // Push to all participants via WebSocket (except sender)
  const participants = await prisma.conversationParticipant.findMany({
    where: { conversationId },
    select: { userId: true },
  });

  const recipientIds = participants
    .map((p) => p.userId)
    .filter((id) => id !== senderId);

  wsManager.sendToUsers(recipientIds, {
    type: 'message',
    payload: formatted,
    timestamp: new Date().toISOString(),
  });

  return formatted;
}

export async function getMessages(
  conversationId: number,
  userId: number,
  page = 1,
  limit = 50,
) {
  // Verify user is a participant
  const participant = await prisma.conversationParticipant.findUnique({
    where: { conversationId_userId: { conversationId, userId } },
  });
  if (!participant) return null;

  const [messages, total] = await Promise.all([
    prisma.message.findMany({
      where: { conversationId },
      include: {
        sender: {
          select: { id: true, username: true, displayName: true, avatarUrl: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.message.count({ where: { conversationId } }),
  ]);

  return {
    data: messages.map(formatMessage),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function updateLastRead(conversationId: number, userId: number) {
  return prisma.conversationParticipant.update({
    where: { conversationId_userId: { conversationId, userId } },
    data: { lastReadAt: new Date() },
  });
}

function formatMessage(m: any) {
  return {
    id: m.id,
    conversationId: m.conversationId,
    senderId: m.senderId,
    senderUsername: m.sender.username,
    senderDisplayName: m.sender.displayName,
    senderAvatarUrl: m.sender.avatarUrl,
    body: m.body,
    messageType: m.messageType,
    metadata: m.metadata ? JSON.parse(m.metadata) : null,
    createdAt: m.createdAt.toISOString(),
    updatedAt: m.updatedAt.toISOString(),
  };
}
