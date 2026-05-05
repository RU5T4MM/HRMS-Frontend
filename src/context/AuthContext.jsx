import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const rawApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
    const cleanUrl = rawApiUrl.replace(/\/+$/, '');
    const finalApiUrl = cleanUrl.endsWith('/api') ? cleanUrl : `${cleanUrl}/api`;

    // Axios configuration
    const api = axios.create({
        baseURL: finalApiUrl,
        withCredentials: true
    });

    // Dynamically attach token to every request
    api.interceptors.request.use((config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    });

    useEffect(() => {
        const checkLoggedIn = async () => {
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    const res = await api.get('/auth/me');
                    setUser(res.data.data);
                }
            } catch (err) {
                console.error('Not logged in', err);
                localStorage.removeItem('token');
            } finally {
                setLoading(false);
            }
        };

        checkLoggedIn();
    }, []);

    const login = async (email, password) => {
        try {
            setError(null);
            const res = await api.post('/auth/login', { email, password });
            localStorage.setItem('token', res.data.token);
            setUser(res.data.user);
            return res.data.user;
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed');
            throw err;
        }
    };

    const logout = async () => {
        try {
            await api.get('/auth/logout');
        } catch (err) {
            console.error(err);
        } finally {
            localStorage.removeItem('token');
            setUser(null);
        }
    };

    const register = async (name, email, password, department) => {
        try {
            setError(null);
            // Default role is 'employee'
            const res = await api.post('/auth/register', { name, email, password, department, role: 'employee' });
            localStorage.setItem('token', res.data.token);
            setUser(res.data.user);
            return res.data.user;
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed');
            throw err;
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, error, login, register, logout, api }}>
            {children}
        </AuthContext.Provider>
    );
};
