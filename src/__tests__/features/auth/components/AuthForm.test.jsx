import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { BrowserRouter } from 'react-router-dom';
import AuthForm from '@/features/auth/components/AuthForm';
import {
  loginRequest,
  registerRequest,
  forgotPasswordRequest,
} from '@/features/auth/store/authSlice';

const mockStore = configureStore([]);

describe('AuthForm', () => {
    let store;

    beforeEach(() => {
        store = mockStore({
            auth: { status: 'idle' },
            settings: { accentColor: '#e11d48' }
        });
        store.dispatch = vi.fn();
    });

    const renderComponent = (isLogin = true, toggleMode = vi.fn()) => {
        return render(
            <Provider store={store}>
                <BrowserRouter>
                    <AuthForm isLogin={isLogin} toggleMode={toggleMode} />
                </BrowserRouter>
            </Provider>
        );
    };

    it('renders login form correctly', () => {
        renderComponent(true);
        expect(screen.getByText('WELCOME BACK')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Email Address')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
        expect(screen.queryByPlaceholderText('Username')).not.toBeInTheDocument();
    });

    it('renders registration form correctly', () => {
        renderComponent(false);
        expect(screen.getByText('CREATE ESSENCE')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
    });

    it('dispatches loginRequest on submit when isLogin is true', () => {
        renderComponent(true);
        
        fireEvent.change(screen.getByPlaceholderText('Email Address'), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });
        
        fireEvent.click(screen.getByRole('button', { name: /ENTER SANCTUARY/i }));

        expect(store.dispatch).toHaveBeenCalledWith(loginRequest({ email: 'test@example.com', password: 'password123' }));
    });

    it('validates password during registration and prevents submit if invalid', () => {
        renderComponent(false);
        
        fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'testuser' } });
        fireEvent.change(screen.getByPlaceholderText('Email Address'), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'short' } });
        
        fireEvent.click(screen.getByRole('button', { name: /INITIALIZE JOURNEY/i }));

        expect(store.dispatch).not.toHaveBeenCalledWith(registerRequest(expect.any(Object)));
    });

    it('dispatches registerRequest on submit with valid data', () => {
        renderComponent(false);
        
        fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'testuser' } });
        fireEvent.change(screen.getByPlaceholderText('Email Address'), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'Valid1Password' } });
        
        fireEvent.click(screen.getByRole('button', { name: /INITIALIZE JOURNEY/i }));

        expect(store.dispatch).toHaveBeenCalledWith(registerRequest({
            username: 'testuser',
            email: 'test@example.com',
            password: 'Valid1Password'
        }));
    });

    it('dispatches forgotPasswordRequest when Forgot Password is clicked with email', () => {
        renderComponent(true);
        
        fireEvent.change(screen.getByPlaceholderText('Email Address'), { target: { value: 'test@example.com' } });
        
        fireEvent.click(screen.getByText('Forgot Password?'));

        expect(store.dispatch).toHaveBeenCalledWith(forgotPasswordRequest({ email: 'test@example.com' }));
    });
});
