
import { AssetType } from '../types';
import axios from './axios.customize';

const getAllAssetTypesAPI = () => {
    const token = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxIiwicm9sZSI6IkFETUlOIiwiaWF0IjoxNzYxOTY5NjIzLCJleHAiOjE3NjE5NzU2MjN9.f22WYm89_DSsZHlBzDl-n7tPTDviKcvrPfLZLLrpd3Q";
    const headers = {
        Authorization: `Bearer ${token}`
    };
    const URL_BACKEND = "/asset-types";
    return axios.get(URL_BACKEND, { headers });
}


const createAssetTypeAPI = (data: AssetType) => {
    const token = "";
    const headers = {
        Authorization: `Bearer ${token}`
    };
    const URL_BACKEND = "/asset-types";
    return axios.post(URL_BACKEND, data, { headers });
}

const updateAssetTypeAPI = (id: number, data: AssetType) => {
    const token = "";
    const headers = {
        Authorization: `Bearer ${token}`
    };
    const URL_BACKEND = `/asset-types/${id}`;
    return axios.put(URL_BACKEND, data, { headers });
}

const deleteAssetTypeAPI = (id: number) => {
    const token = "";
    const headers = {
        Authorization: `Bearer ${token}`
    };
    const URL_BACKEND = `/asset-types/${id}`;
    return axios.delete(URL_BACKEND, { headers });
}

export {
    getAllAssetTypesAPI,
    createAssetTypeAPI,
    updateAssetTypeAPI,
    deleteAssetTypeAPI
};