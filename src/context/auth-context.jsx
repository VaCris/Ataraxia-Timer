import { useDispatch, useSelector } from 'react-redux';
import {
    loginRequest,
    registerRequest,
    guestLoginRequest,
    logout as logoutAction
} from '../store/slices/authSlice';

export const useAuth = () => {
    const dispatch = useDispatch();

    const { user, token, loading, initialized, error } = useSelector(state => state.auth);

    const login = (email, password) => new Promise((resolve) => {
        dispatch(loginRequest({ email, password, resolve }));
    });

    const register = (userData) => new Promise((resolve) => {
        dispatch(registerRequest({ userData, resolve }));
    });

    const loginAsGuest = () => new Promise((resolve) => {
        dispatch(guestLoginRequest({ resolve }));
    });

    const logout = () => {
        dispatch(logoutAction());
    };

    return {
        user,
        token,
        loading,
        initialized,
        error,
        login,
        register,
        loginAsGuest,
        logout
    };
};

export const AuthContext = null;