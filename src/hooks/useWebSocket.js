import { useEffect, useMemo, useRef, useState } from 'react';
import { createRoomWebSocketClient } from '../services/websocket';

export const useWebSocket = ({
  roomCode,
  userId,
  role,
  enabled = true,
  onConnect,
  onDisconnect,
  onError,
  onMessage,
} = {}) => {
  const clientRef = useRef(null);
  const handlersRef = useRef({ onConnect, onDisconnect, onError, onMessage });
  const [connectionState, setConnectionState] = useState('idle');
  const [lastMessage, setLastMessage] = useState(null);

  useEffect(() => {
    handlersRef.current = { onConnect, onDisconnect, onError, onMessage };
  }, [onConnect, onDisconnect, onError, onMessage]);

  useEffect(() => {
    if (!enabled || !roomCode || !role || (role === 'PARTICIPANT' && !userId)) {
      setConnectionState('idle');
      return undefined;
    }

    let disposed = false;
    setConnectionState('connecting');

    const client = createRoomWebSocketClient({
      roomCode,
      userId,
      role,
      onConnect: () => {
        if (disposed) {
          return;
        }

        setConnectionState('connected');
        handlersRef.current.onConnect?.();
      },
      onDisconnect: () => {
        if (disposed) {
          return;
        }

        setConnectionState('disconnected');
        handlersRef.current.onDisconnect?.();
      },
      onError: (event) => {
        if (disposed) {
          return;
        }

        setConnectionState('error');
        handlersRef.current.onError?.(event);
      },
      onMessage: (message, frame) => {
        if (disposed) {
          return;
        }

        setLastMessage(message);
        handlersRef.current.onMessage?.(message, frame);
      },
    });

    clientRef.current = client;
    client.activate();

    return () => {
      disposed = true;
      client.deactivate();
      clientRef.current = null;
    };
  }, [enabled, roomCode, role, userId]);

  const api = useMemo(
    () => ({
      connectionState,
      lastMessage,
      client: clientRef.current,
      disconnect: () => clientRef.current?.deactivate(),
    }),
    [connectionState, lastMessage]
  );

  return api;
};