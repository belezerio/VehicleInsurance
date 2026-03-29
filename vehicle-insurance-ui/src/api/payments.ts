import axiosInstance from './axiosInstance';

export const processPayment = (data: { proposalId: number; amount: number }) =>
  axiosInstance.post('/payments', data);