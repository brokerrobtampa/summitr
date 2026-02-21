import type { FastifyInstance } from 'fastify';
import { authenticate } from '../hooks/authenticate.js';
import {
  createConversation,
  getConversations,
  getConversation,
} from '../services/conversation.service.js';
import {
  sendMessage,
  getMessages,
  updateLastRead,
} from '../services/message.service.js';

export async function conversationRoutes(app: FastifyInstance) {
  // POST /api/v1/conversations — create a conversation
  app.post('/conversations', { preValidation: [authenticate] }, async (request, reply) => {
    const userId = (request.user as { id: number }).id;
    const { type, participantIds, title } = request.body as {
      type?: 'direct' | 'group';
      participantIds: number[];
      title?: string;
    };

    if (!participantIds || participantIds.length === 0) {
      return reply.status(400).send({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'At least one participant is required' },
      });
    }

    const conversation = await createConversation(
      type || 'direct',
      userId,
      participantIds,
      title,
    );
    return reply.status(201).send({ success: true, data: conversation });
  });

  // GET /api/v1/conversations — list user's conversations
  app.get('/conversations', { preValidation: [authenticate] }, async (request, reply) => {
    const userId = (request.user as { id: number }).id;
    const { page, limit } = request.query as { page?: string; limit?: string };
    const result = await getConversations(
      userId,
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 20,
    );
    return reply.send({ success: true, ...result });
  });

  // GET /api/v1/conversations/:id — conversation detail
  app.get('/conversations/:id', { preValidation: [authenticate] }, async (request, reply) => {
    const userId = (request.user as { id: number }).id;
    const { id } = request.params as { id: string };
    const conversation = await getConversation(parseInt(id, 10), userId);
    if (!conversation) {
      return reply.status(404).send({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Conversation not found' },
      });
    }
    return reply.send({ success: true, data: conversation });
  });

  // GET /api/v1/conversations/:id/messages — paginated messages
  app.get('/conversations/:id/messages', { preValidation: [authenticate] }, async (request, reply) => {
    const userId = (request.user as { id: number }).id;
    const { id } = request.params as { id: string };
    const { page, limit } = request.query as { page?: string; limit?: string };
    const result = await getMessages(
      parseInt(id, 10),
      userId,
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 50,
    );
    if (!result) {
      return reply.status(404).send({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Conversation not found' },
      });
    }
    return reply.send({ success: true, ...result });
  });

  // POST /api/v1/conversations/:id/messages — send a message
  app.post('/conversations/:id/messages', { preValidation: [authenticate] }, async (request, reply) => {
    const userId = (request.user as { id: number }).id;
    const { id } = request.params as { id: string };
    const { body, messageType, metadata } = request.body as {
      body: string;
      messageType?: string;
      metadata?: Record<string, unknown>;
    };

    if (!body || body.trim().length === 0) {
      return reply.status(400).send({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Message body is required' },
      });
    }

    try {
      const message = await sendMessage(
        parseInt(id, 10),
        userId,
        body,
        messageType || 'text',
        metadata,
      );
      return reply.status(201).send({ success: true, data: message });
    } catch (err: any) {
      if (err.message === 'Not a participant in this conversation') {
        return reply.status(403).send({
          success: false,
          error: { code: 'FORBIDDEN', message: err.message },
        });
      }
      throw err;
    }
  });

  // PATCH /api/v1/conversations/:id/read — mark conversation as read
  app.patch('/conversations/:id/read', { preValidation: [authenticate] }, async (request, reply) => {
    const userId = (request.user as { id: number }).id;
    const { id } = request.params as { id: string };
    try {
      await updateLastRead(parseInt(id, 10), userId);
      return reply.send({ success: true });
    } catch {
      return reply.status(404).send({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Conversation not found' },
      });
    }
  });
}
