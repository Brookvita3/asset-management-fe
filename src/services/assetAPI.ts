import axios from "./axios.customize";
import { ApiResponse } from "../types/api";
import { AssetDTO } from "../types/backend";

const BASE_PATH = "/api/v1/assets";

export const getAssetsAPI = () =>
  axios.get<ApiResponse<AssetDTO[]>>(BASE_PATH);

export const getAssetByIdAPI = (id: number) =>
  axios.get<ApiResponse<AssetDTO>>(`${BASE_PATH}/${id}`);

export const createAssetAPI = (payload: Partial<AssetDTO>) =>
  axios.post<ApiResponse<null>>(BASE_PATH, payload);

export const updateAssetAPI = (id: number, payload: Partial<AssetDTO>) =>
  axios.put<ApiResponse<null>>(`${BASE_PATH}/${id}`, payload);

export const deleteAssetAPI = (id: number) =>
  axios.delete<ApiResponse<null>>(`${BASE_PATH}/${id}`);

export const assignAssetAPI = (
  id: number,
  payload: { userId: number; assignDate?: string }
) => axios.post<ApiResponse<null>>(`${BASE_PATH}/${id}/assign`, payload);

export const reclaimAssetAPI = (id: number) =>
  axios.post<ApiResponse<null>>(`${BASE_PATH}/${id}/reclaim`, {});

export const evaluateAssetAPI = (
  id: number,
  payload: { condition: string; notes?: string }
) => axios.post<ApiResponse<null>>(`${BASE_PATH}/${id}/evaluate`, payload);
