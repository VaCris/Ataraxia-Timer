import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '@api/auth/auth.service';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initializeSession = async () => {
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    const profile = await authService.getProfile();
                    setUser(profile);
                    setIsAuthenticated(true);
                } else {
                    let deviceId = localStorage.getItem('deviceId');
                    if (!deviceId) {
                        deviceId = crypto.randomUUID();
                        localStorage.setItem('deviceId', deviceId);
                    }
                    const response = await authService.guestLogin(deviceId);
                    localStorage.setItem('token', response.access_token);
                    localStorage.setItem('refreshToken', response.refresh_token);
                    setUser(response.user);
                    setIsAuthenticated(true);
                }
            } catch (error) {
                localStorage.removeItem('token');
                localStorage.removeItem('refreshToken');
                setUser(null);
                setIsAuthenticated(false);
            } finally {
                setLoading(false);
            }
        };
        initializeSession();
    }, []);

    const login = async (email, password) => {
        try {
            setLoading(true);
            const response = await authService.login(email, password);
            localStorage.setItem('token', response.access_token);
            localStorage.setItem('refreshToken', response.refresh_token);
            setUser(response.user);
            setIsAuthenticated(true);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.response?.data?.message || 'Invalid credentials' };
        } finally {
            setLoading(false);
        }
    };

    const register = async ({ username, email, password }) => {
        try {
            setLoading(true);
            const deviceId = localStorage.getItem('deviceId');
            const response = await authService.register(username, email, password, deviceId);
            localStorage.setItem('token', response.access_token);
            setUser(response.user);
            setIsAuthenticated(true);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.response?.data?.message || 'Could not create account' };
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try { await authService.logout(); } catch (e) {}
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location.reload(); 
    };

    const forgotPassword = async (email) => {
        try {
            setLoading(true);
            const response = await authService.forgotPassword(email);
            return { success: true, message: response.message };
        } catch (error) {
            return { 
                success: false, 
                error: error.response?.data?.message || 'Server error' 
            };
        } finally {
            setLoading(false);
        }
    };

    const resetPassword = async (token, newPassword) => {
        try {
            setLoading(true);
            const response = await authService.resetPassword(token, newPassword);
            return { success: true, message: response.message };
        } catch (error) {
            return { success: false, error: error.response?.data?.message || 'Error resetting password' };
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center bg-[#0a0a0a] w-screen h-screen font-bold text-white/50 text-sm tracking-widest">
                STARTING ATARAXIA...
            </div>
        );
    }

    return (
        <AuthContext.Provider value={{
            user, isAuthenticated, login, register, logout, forgotPassword, resetPassword, loading
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};