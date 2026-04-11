import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Auth APIs
export const registerUser = (data) => api.post('/auth/register', data);
export const loginUser = (data) => api.post('/auth/login', data);

// Resume APIs
export const uploadResume = (formData) => api.post('/resume/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
});
export const analyzeResume = (data) => api.post('/resume/analyze', data);
export const getResults = (resumeId) => api.get(`/resume/results/${resumeId}`);
export const getResultById = (id) => api.get(`/resume/result/${id}`);

// Job Role APIs
export const getJobRoles = () => api.get('/jobs/roles');
export const getResumesByUser = (userId) => api.get(`/resume/user/${userId}`);
export default api;