import axiosInstance from './axiosInstance';

export const getStats = () => axiosInstance.get('/stats');