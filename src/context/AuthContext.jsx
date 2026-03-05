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
                const refreshToken = localStorage.getItem('refreshToken');
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
                console.error("Error initializing session:", error);

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
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location.reload(); 
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
            user,
            isAuthenticated,
            login,
            register,
            logout,
            loading
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};