import type { FastifyInstance } from 'fastify';
import fastifyWebSocket from '@fastify/websocket';
import { wsManager } from '../lib/ws-manager.js';

export async function websocketPlugin(app: FastifyInstance) {
  await app.register(fastifyWebSocket);

  app.get('/ws', { websocket: true }, (socket, request) => {
    // Authenticate via JWT token in query param
    const url = new URL(request.url, `http://${request.headers.host}`);
    const token = url.searchParams.get('token');

    if (!token) {
      socket.close(4001, 'Missing token');
      return;
    }

    let userId: number;
    try {
      const decoded = app.jwt.verify<{ id: number }>(token);
      userId = decoded.id;
    } catch {
      socket.close(4001, 'Invalid token');
      return;
    }

    // Register connection
    wsManager.register(userId, socket);

    // Send confirmation
    socket.send(JSON.stringify({
      type: 'connected',
      payload: { userId },
      timestamp: new Date().toISOString(),
    }));

    // Handle incoming messages (for future use: typing indicators, read receipts, etc.)
    socket.on('message', (raw: Buffer | ArrayBuffer | Buffer[]) => {
      try {
        const data = JSON.parse(raw.toString());
        // Future: handle client-to-server events
        if (data.type === 'ping') {
          socket.send(JSON.stringify({
            type: 'pong',
            payload: null,
            timestamp: new Date().toISOString(),
          }));
        }
      } catch {
        // Ignore malformed messages
      }
    });

    // Cleanup on disconnect
    socket.on('close', () => {
      wsManager.unregister(userId, socket);
    });

    socket.on('error', () => {
      wsManager.unregister(userId, socket);
    });
  });
}
