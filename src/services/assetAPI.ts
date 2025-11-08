import axios from "./axios.customize";
import { ApiResponse } from "../types/api";
import { AssetDTO, AssetHistoryDTO } from "../types/backend";
import { Asset } from "../types";

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
  assetId: number,

  //     private String actionType;
  //     private Long performedBy;
  //     private String performedAt;
  //     private String details;
  //     private String notes;
  //     private String previousStatus;
  //     private String newStatus;


  payload: { performedBy: number; details: string; notes?: string; previousStatus?: string; newStatus?: string; condition?: string }
) => axios.post<ApiResponse<null>>(`${BASE_PATH}/${assetId}/evaluate`, payload);


export const getAssetHistoryAPI = () =>
  axios.get<ApiResponse<AssetHistoryDTO[]>>(`${BASE_PATH}/history`);
