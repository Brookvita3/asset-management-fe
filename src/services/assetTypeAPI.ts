import { AssetType } from "../types";
import axios from "./axios.customize";

const getAllAssetTypesAPI = () => {
  const URL_BACKEND = "/asset-types";
  return axios.get(URL_BACKEND);
};

const createAssetTypeAPI = (data: AssetType) => {
  const URL_BACKEND = "/asset-types";
  return axios.post(URL_BACKEND, data);
};

const updateAssetTypeAPI = (id: number, data: AssetType) => {
  const URL_BACKEND = `/asset-types/${id}`;
  return axios.put(URL_BACKEND, data);
};

const deleteAssetTypeAPI = (id: number) => {
  return axios.delete(`/asset-types/${id}`);
};

export {
  getAllAssetTypesAPI,
  createAssetTypeAPI,
  updateAssetTypeAPI,
  deleteAssetTypeAPI,
};
