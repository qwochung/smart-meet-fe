import axiosClient from './axiosClient';

export const userApi = {
  getAll: (params) => {
    const url = '/users';
    return axiosClient.get(url, { params });
  },
  getById: (id) => {
    const url = `/users/${id}`;
    return axiosClient.get(url);
  },
  update: (id, data) => {
    const url = `/users/${id}`;
    return axiosClient.put(url, data);
  },
};
