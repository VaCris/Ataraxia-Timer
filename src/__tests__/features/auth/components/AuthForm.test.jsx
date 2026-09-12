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

    it('renders login form with visible field labels', () => {
        renderComponent(true);
        expect(screen.getByText('WELCOME BACK')).toBeInTheDocument();
        expect(screen.getByLabelText('Email address')).toBeInTheDocument();
        expect(screen.getByLabelText('Password')).toBeInTheDocument();
        expect(screen.queryByLabelText('Username')).not.toBeInTheDocument();
    });

    it('renders registration form and password requirements', () => {
        renderComponent(false);
        expect(screen.getByText('CREATE ESSENCE')).toBeInTheDocument();
        expect(screen.getByLabelText('Username')).toBeInTheDocument();
        expect(screen.getByText('At least 8 characters')).toBeInTheDocument();
        expect(screen.getByText('One uppercase letter')).toBeInTheDocument();
        expect(screen.getByText('One number')).toBeInTheDocument();
    });

    it('dispatches loginRequest on submit when isLogin is true', () => {
        renderComponent(true);

        fireEvent.change(screen.getByLabelText('Email address'), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });

        fireEvent.click(screen.getByRole('button', { name: /ENTER SANCTUARY/i }));

        expect(store.dispatch).toHaveBeenCalledWith(loginRequest({ email: 'test@example.com', password: 'password123' }));
    });

    it('shows specific password guidance and prevents invalid registration', () => {
        renderComponent(false);

        fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'testuser' } });
        fireEvent.change(screen.getByLabelText('Email address'), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'short' } });

        fireEvent.click(screen.getByRole('button', { name: /INITIALIZE JOURNEY/i }));

        expect(screen.getByRole('alert')).toHaveTextContent('At least 8 characters');
        expect(store.dispatch).not.toHaveBeenCalledWith(registerRequest(expect.any(Object)));
    });

    it('dispatches registerRequest on submit with valid data', () => {
        renderComponent(false);

        fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'testuser' } });
        fireEvent.change(screen.getByLabelText('Email address'), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'Valid1Password' } });

        fireEvent.click(screen.getByRole('button', { name: /INITIALIZE JOURNEY/i }));

        expect(store.dispatch).toHaveBeenCalledWith(registerRequest({
            username: 'testuser',
            email: 'test@example.com',
            password: 'Valid1Password'
        }));
    });

    it('shows a specific email error after blur', () => {
        renderComponent(true);
        const emailInput = screen.getByLabelText('Email address');

        fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
        fireEvent.blur(emailInput);

        expect(screen.getByRole('alert')).toHaveTextContent('Enter a valid email address.');
    });

    it('dispatches forgotPasswordRequest when Forgot Password is clicked with email', () => {
        renderComponent(true);

        fireEvent.change(screen.getByLabelText('Email address'), { target: { value: 'test@example.com' } });

        fireEvent.click(screen.getByText('Forgot Password?'));

        expect(store.dispatch).toHaveBeenCalledWith(forgotPasswordRequest({ email: 'test@example.com' }));
    });
});
