import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('ataraxia_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
            setIsAuthenticated(true);
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const mockUser = { email, username: email.split('@')[0], id: '123' };

            setUser(mockUser);
            setIsAuthenticated(true);
            localStorage.setItem('ataraxia_user', JSON.stringify(mockUser));

            return { success: true };
        } catch (error) {
            return { success: false, error: 'Invalid credentials' };
        }
    };

    const register = async ({ username, email, password, deviceId }) => {
        try {
            const newUser = { username, email, id: deviceId };

            setUser(newUser);
            setIsAuthenticated(true);
            localStorage.setItem('ataraxia_user', JSON.stringify(newUser));

            return { success: true };
        } catch (error) {
            return { success: false, error: 'Could not create account' };
        }
    };

    const logout = () => {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('ataraxia_user');
    };

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated,
            login,
            register,
            logout,
            loading
        }}>
            {!loading && children}
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