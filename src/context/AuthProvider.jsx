import React, { useState, useEffect } from 'react';
import { AuthContext } from './auth-context';
import { authService } from '../api/auth.service';
import { apiClient } from '../api/client';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('dw-user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const [token, setToken] = useState(() => localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            apiClient.defaults.headers.Authorization = `Bearer ${token}`;
        }
        setLoading(false);
    }, [token]);

    useEffect(() => {
        const handleAuthError = () => {
            logout();
        };

        window.addEventListener('auth:logout', handleAuthError);
        return () => window.removeEventListener('auth:logout', handleAuthError);
    }, []);

    const extractToken = (data) => {
        const token = data?.token || data?.access_token;
        if (!token) {
            throw new Error('JWT token not returned by API');
        }
        return token;
    };

    const generateSafeId = () => {
        if (typeof crypto !== 'undefined' && crypto.randomUUID) {
            return crypto.randomUUID();
        }

        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    };

    const getDeviceId = () => {
        let deviceId = localStorage.getItem('device_id');

        if (!deviceId || deviceId === 'undefined') {
            deviceId = generateSafeId();
            localStorage.setItem('device_id', deviceId);
        }
        return deviceId;
    };

    const saveSession = (newToken, newUser) => {
        if (!newToken) return;

        setToken(newToken);
        setUser(newUser);

        localStorage.setItem('token', newToken);
        localStorage.setItem('dw-user', JSON.stringify(newUser));

        apiClient.defaults.headers.Authorization = `Bearer ${newToken}`;
    };

    const loginAsGuest = async () => {
        try {
            const deviceId = getDeviceId();

            const data = await authService.guestLogin({ deviceId });

            const token = extractToken(data);
            const guestUser = { ...data.user, isGuest: true };

            saveSession(token, guestUser);
            return true;
        } catch (error) {
            console.error("Guest login failed:", error.response?.data || error.message);
            return false;
        }
    };


    const login = async (email, password) => {
        try {
            const data = await authService.login({ email, password });
    
            const token = extractToken(data);
            saveSession(token, data.user);
    
            return { success: true };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Error' };
        }
    };
    
    const register = async (name, email, password) => {
        try {
            const deviceId = getDeviceId();
            const data = await authService.register({ name, email, password, deviceId });
    
            const token = extractToken(data);
            saveSession(token, data.user);
    
            return { success: true };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Error' };
        }
    };  

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
        localStorage.removeItem('dw-user');
        delete apiClient.defaults.headers.Authorization;
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, loginAsGuest, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};