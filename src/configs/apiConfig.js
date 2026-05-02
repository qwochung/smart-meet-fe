const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8080/api/ws/meet';

export default {
  apiURL: API_URL,
  wsURL: WS_URL,
};

