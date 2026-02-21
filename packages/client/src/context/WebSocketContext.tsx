import { createContext, useContext, useEffect, type ReactNode } from 'react';
import { useWebSocket } from '../hooks/useWebSocket.js';
import { useAuth } from './AuthContext.js';

interface WebSocketContextValue {
  isConnected: boolean;
  subscribe: (type: string, callback: (payload: any) => void) => () => void;
  sendEvent: (event: { type: string; payload: unknown; timestamp: string }) => void;
}

const WebSocketContext = createContext<WebSocketContextValue>({
  isConnected: false,
  subscribe: () => () => {},
  sendEvent: () => {},
});

export function WebSocketProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const { connect, disconnect, subscribe, sendEvent, isConnected } = useWebSocket();

  useEffect(() => {
    if (user) {
      connect();
    } else {
      disconnect();
    }
  }, [user, connect, disconnect]);

  return (
    <WebSocketContext.Provider value={{ isConnected, subscribe, sendEvent }}>
      {children}
    </WebSocketContext.Provider>
  );
}

export function useWs() {
  return useContext(WebSocketContext);
}
