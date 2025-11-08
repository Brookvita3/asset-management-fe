import axios from './axios.customize';
import { ApiResponse } from '../types/api';
import { UserDTO } from '../types/backend';

const BASE_PATH = '/api/v1/users';

export const getUsersAPI = () => axios.get<ApiResponse<UserDTO[]>>(BASE_PATH);

export const getUserByIdAPI = (id: number) =>
  axios.get<ApiResponse<UserDTO>>(`${BASE_PATH}/${id}`);

export const getUsersByDepartmentAPI = (departmentId: number) =>
  axios.get<ApiResponse<UserDTO[]>>(`${BASE_PATH}/department/${departmentId}`);

export const createUserAPI = (payload: Partial<UserDTO>) =>
  axios.post<ApiResponse<null>>(BASE_PATH, payload);

export const updateUserAPI = (id: number, payload: Partial<UserDTO>) =>
  axios.put<ApiResponse<null>>(`${BASE_PATH}/${id}`, payload);

export const deleteUserAPI = (id: number) =>
  axios.delete<ApiResponse<null>>(`${BASE_PATH}/${id}`);
