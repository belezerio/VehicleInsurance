import axiosInstance from './axiosInstance';

export const generateQuote = (proposalId: number) =>
  axiosInstance.post(`/quotes/${proposalId}/generate`);
export const getQuoteByProposalId = (proposalId: number) =>
  axiosInstance.get(`/quotes/${proposalId}`);