import axios from 'axios';
import { message } from 'antd';

const request = axios.create({
    baseURL: '/api/v1',
    timeout: 5000,
});

request.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            if (config.headers && typeof config.headers.set === 'function') {
                config.headers.set('Authorization', `Bearer ${token}`);
            } else {
                config.headers['Authorization'] = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

request.interceptors.response.use(
    (response) => {
        return response.data;
    },
    (error) => {
        if (error.response) {
            if (error.response.status === 401) {
                if (window.location.pathname !== '/login') {
                    // Dispatch event for App.tsx to handle
                    window.dispatchEvent(new CustomEvent('LOGIN_REQUIRED'));
                    localStorage.removeItem('token');
                    localStorage.removeItem('role');
                }
            } else if (error.response.status === 403) {
                message.error('权限不足');
            } else {
                message.error(error.response.data?.message || '请求失败');
            }
        } else {
            message.error('网络错误');
        }
        return Promise.reject(error);
    }
);

export default request;
