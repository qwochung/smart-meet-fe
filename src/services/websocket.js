import { Client } from '@stomp/stompjs';
import apiConfig from '../configs/apiConfig';

const safeParse = (value) => {
  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

const getTopic = ({ roomCode, role, userId }) => {
  if (!roomCode || !role) {
    return null;
  }

  if (role === 'HOST') {
    return `/topic/room/${roomCode}/host-events`;
  }

  if (role === 'PARTICIPANT' && userId) {
    return `/topic/room/${roomCode}/participant/${userId}`;
  }

  return null;
};

export const createRoomWebSocketClient = ({
  roomCode,
  userId,
  role,
  onConnect,
  onDisconnect,
  onError,
  onMessage,
}) => {
  const client = new Client({
    brokerURL: apiConfig.wsURL,
    reconnectDelay: 5000,
    heartbeatIncoming: 10000,
    heartbeatOutgoing: 10000,
    onConnect: () => {
      const topic = getTopic({ roomCode, role, userId });

      if (topic) {
        client.subscribe(topic, (frame) => {
          const message = safeParse(frame.body) || {};
          onMessage?.(message, frame);
        });
      }

      onConnect?.(client);
    },
    onWebSocketClose: () => {
      onDisconnect?.();
    },
    onWebSocketError: (event) => {
      onError?.(event);
    },
    onStompError: (frame) => {
      onError?.(frame);
    },
  });

  return client;
};