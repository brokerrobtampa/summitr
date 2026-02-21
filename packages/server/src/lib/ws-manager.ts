import type { WebSocket } from 'ws';
import type { WebSocketEvent } from '@summit/shared';

class WebSocketManager {
  // userId → Set of connected WebSocket instances (supports multiple tabs)
  private connections = new Map<number, Set<WebSocket>>();

  register(userId: number, ws: WebSocket): void {
    let userSockets = this.connections.get(userId);
    if (!userSockets) {
      userSockets = new Set();
      this.connections.set(userId, userSockets);
    }
    userSockets.add(ws);
    console.log(`[WS] User ${userId} connected (${userSockets.size} active connections)`);
  }

  unregister(userId: number, ws: WebSocket): void {
    const userSockets = this.connections.get(userId);
    if (!userSockets) return;
    userSockets.delete(ws);
    if (userSockets.size === 0) {
      this.connections.delete(userId);
    }
    console.log(`[WS] User ${userId} disconnected (${userSockets?.size ?? 0} remaining)`);
  }

  sendToUser(userId: number, event: WebSocketEvent): void {
    const userSockets = this.connections.get(userId);
    if (!userSockets) return;

    const payload = JSON.stringify(event);
    for (const ws of userSockets) {
      if (ws.readyState === ws.OPEN) {
        ws.send(payload);
      }
    }
  }

  sendToUsers(userIds: number[], event: WebSocketEvent): void {
    for (const userId of userIds) {
      this.sendToUser(userId, event);
    }
  }

  isOnline(userId: number): boolean {
    const sockets = this.connections.get(userId);
    return !!sockets && sockets.size > 0;
  }

  getOnlineCount(): number {
    return this.connections.size;
  }
}

// Singleton instance
export const wsManager = new WebSocketManager();
