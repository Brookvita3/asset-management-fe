import axios from "./axios.customize";
import { ApiResponse } from "../types/api";
import { DepartmentDTO } from "../types/backend";

const BASE_PATH = "/api/v1/departments";

export const getDepartmentsAPI = () =>
  axios.get<ApiResponse<DepartmentDTO[]>>(BASE_PATH);

export const createDepartmentAPI = (payload: Partial<DepartmentDTO>) =>
  axios.post<ApiResponse<null>>(BASE_PATH, payload);

export const updateDepartmentAPI = (id: number, payload: Partial<DepartmentDTO>) =>
  axios.put<ApiResponse<null>>(`${BASE_PATH}/${id}`, payload);

export const deleteDepartmentAPI = (id: number) =>
  axios.delete<ApiResponse<null>>(`${BASE_PATH}/${id}`);
