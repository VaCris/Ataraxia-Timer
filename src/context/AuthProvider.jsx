import React, { useState, useEffect, useCallback } from 'react';
import { AuthContext } from './auth-context';
import { authService } from '../api/auth.service';
import toast from 'react-hot-toast';

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(() => localStorage.getItem('access_token'));
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

    const logout = useCallback(() => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('dw-user');
    }, []);

    useEffect(() => {
        const handleAuthLogout = () => {
            if (user && !user.isGuest) {
                toast.error("Session expired. Please sign in again.", { id: 'auth-error' });
            }
            logout();

            if (window.location.pathname !== '/') {
                window.location.href = '/';
            }
        };

        window.addEventListener('auth:logout', handleAuthLogout);
        return () => window.removeEventListener('auth:logout', handleAuthLogout);
    }, [logout, user]);

    const saveSession = (newToken, newUser, newRefreshToken) => {
        setToken(newToken);
        setUser(newUser);
        localStorage.setItem('access_token', newToken);
        if (newRefreshToken) {
            localStorage.setItem('refresh_token', newRefreshToken);
        }
        localStorage.setItem('dw-user', JSON.stringify(newUser));
    };

    const loginAsGuest = async () => {
        if (user || token) return true;

        setLoading(true);
        try {
            const deviceId = localStorage.getItem('device_id') || crypto.randomUUID();
            localStorage.setItem('device_id', deviceId);

            const data = await authService.guestLogin({ deviceId });
            saveSession(data.access_token, data.user, data.refresh_token);
            return true;
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
            saveSession(data.access_token, data.user, data.refresh_token);
            return { success: true };
        } catch (error) {
            const message = error.response?.data?.message || "Login failed";
            return { success: false, error: message };
        }
    };

    const register = async (userData) => {
        try {
            const data = await authService.register(userData);
            saveSession(data.access_token, data.user, data.refresh_token);
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