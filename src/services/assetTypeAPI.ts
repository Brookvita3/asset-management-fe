import axios from "./axios.customize";
import { ApiResponse } from "../types/api";
import { AssetTypeDTO } from "../types/backend";

type AssetTypePayload = Pick<AssetTypeDTO, "name" | "description" | "isActive">;

const BASE_PATH = "/asset-types";

export const getAllAssetTypesAPI = () =>
  axios.get<ApiResponse<AssetTypeDTO[]>>(BASE_PATH);

export const createAssetTypeAPI = (data: AssetTypePayload) =>
  axios.post<ApiResponse<null>>(BASE_PATH, data);

export const updateAssetTypeAPI = (id: number, data: AssetTypePayload) =>
  axios.put<ApiResponse<null>>(`${BASE_PATH}/${id}`, data);

export const deleteAssetTypeAPI = (id: number) =>
  axios.delete<ApiResponse<null>>(`${BASE_PATH}/${id}`);
