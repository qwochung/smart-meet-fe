import { roomApi } from './roomApi';
import { userApi } from './userApi';
import { authApi } from './authApi';

const api = {
  auth: authApi,
  room: roomApi,
  user: userApi,
};

export default api;