import axiosInstance from './axiosInstance';

export const triggerReminders = () => axiosInstance.post('/jobs/trigger-reminders');
