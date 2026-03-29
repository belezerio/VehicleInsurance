import axiosInstance from './axiosInstance';

export const getAllPolicies = () => axiosInstance.get('/policies');
export const getPolicyById = (id: number) => axiosInstance.get(`/policies/${id}`);
export const createPolicy = (data: any) => axiosInstance.post('/policies', data);
export const updatePolicy = (id: number, data: any) => axiosInstance.put(`/policies/${id}`, data);