import React, { useState, useEffect, useCallback } from 'react';
import { AuthContext } from './auth-context';
import { authService } from '../api/auth.service';
import { apiClient } from '../api/client';

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(() => localStorage.getItem('token'));
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('dw-user');
        try {
            return savedUser ? JSON.parse(savedUser) : null;
        } catch {
            return null;
        }
    });

    const [loading, setLoading] = useState(false);
    const [initialized, setInitialized] = useState(true);

    useEffect(() => {
        if (token) {
            apiClient.defaults.headers.Authorization = `Bearer ${token}`;
        } else {
            delete apiClient.defaults.headers.Authorization;
        }
    }, [token]);

    const logout = useCallback(() => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
        localStorage.removeItem('dw-user');
        delete apiClient.defaults.headers.Authorization;
    }, []);

    useEffect(() => {
        const handleAuthError = () => logout();
        window.addEventListener('auth:logout', handleAuthError);
        return () => window.removeEventListener('auth:logout', handleAuthError);
    }, [logout]);

    const saveSession = (newToken, newUser) => {
        setToken(newToken);
        setUser(newUser);
        localStorage.setItem('token', newToken);
        localStorage.setItem('dw-user', JSON.stringify(newUser));
    };

    const loginAsGuest = async () => {
        const storedToken = localStorage.getItem('token');
        if (user || storedToken) return true;

        setLoading(true);
        try {
            const deviceId = localStorage.getItem('device_id') || crypto.randomUUID();
            localStorage.setItem('device_id', deviceId);

            const data = await authService.guestLogin({ deviceId });

            const newToken = data.access_token;

            const newUser = {
                ...data.user,
                username: 'Guest'
            };

            if (newToken && newUser) {
                saveSession(newToken, newUser);
                return true;
            }
            return false;
        } catch (error) {
            console.error("Guest login failed:", error);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        try {
            const data = await authService.login({ email, password });
            const newToken = data.access_token;
            saveSession(newToken, data.user);

            return { success: true };
        } catch (error) {
            console.error("Auth context error:", error.message);
            return { success: false, error: error.message };
        }
    };

    const register = async (userData) => {
        try {
            const data = await authService.register(userData);
            const newToken = data.token || data.access_token;
            const newUser = { ...(data.user || data), isGuest: false };
            saveSession(newToken, newUser);
            return { success: true };
        } catch (error) {
            const message = error.response?.data?.message || "Registration failed";
            return { success: false, error: message };
        }
    };

    return (
        <AuthContext.Provider value={{
            user, token, loading, initialized,
            loginAsGuest, login, logout, register
        }}>
            {children}
        </AuthContext.Provider>
    );
};