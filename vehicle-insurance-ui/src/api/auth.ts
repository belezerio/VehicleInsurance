import axiosInstance from './axiosInstance';

export const register = (data: {
  fullName: string;
  email: string;
  password: string;
  dateOfBirth: string;
  aadhaarNumber: string;
  panNumber: string;
  address: string;
}) => axiosInstance.post('/auth/register', data);

export const login = (data: {
  email: string;
  password: string;
}) => axiosInstance.post('/auth/login', data);