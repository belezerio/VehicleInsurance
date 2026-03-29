import axiosInstance from './axiosInstance';

export const submitProposal = (data: any) => axiosInstance.post('/proposals', data);
export const getMyProposals = () => axiosInstance.get('/proposals/my-proposals');
export const getAllProposals = () => axiosInstance.get('/proposals');
export const updateProposalStatus = (id: number, data: any) =>
  axiosInstance.put(`/proposals/${id}/status`, data);