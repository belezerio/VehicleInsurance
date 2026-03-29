import axiosInstance from './axiosInstance';

export const fileClaim = (data: any) => axiosInstance.post('/claims', data);
export const getMyClaims = () => axiosInstance.get('/claims/my-claims');
export const getAllClaims = () => axiosInstance.get('/claims');
export const updateClaimStatus = (id: number, data: any) =>
  axiosInstance.put(`/claims/${id}/status`, data);