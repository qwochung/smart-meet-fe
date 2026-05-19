import { roomApi } from "./roomApi";
import { userApi } from "./userApi";
import { authApi } from "./authApi";
import { documentApi } from "./documentApi";

const api = {
  auth: authApi,
  room: roomApi,
  user: userApi,
  document: documentApi,
};

export default api;
