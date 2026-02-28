import React, { useState } from 'react';
import { useAuth } from '../../context/auth-context';
import { Loader2, Mail, Lock, User, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { forgotPasswordRequest } from '../../store/slices/authSlice';
import { showToast } from '../../utils/customToast';

const AuthForm = ({ isLogin, onSuccess, toggleMode }) => {
    const dispatch = useDispatch();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [username, setUsername] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isForgotPassword, setIsForgotPassword] = useState(false);

    const { login, register } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const cleanEmail = email.trim().toLowerCase();
        const missingFields = [];

        if (!cleanEmail) missingFields.push('Email address');
        if (!isForgotPassword && !password) missingFields.push('Password');
        if (!isLogin && !isForgotPassword && !username.trim()) missingFields.push('Username');

        if (missingFields.length > 0) {
            return showToast({
                title: 'Missing Information',
                type: 'warning',
                message: 'Please fill in the following fields:',
                fields: missingFields
            });
        }

        if (!isLogin && !isForgotPassword && password !== confirmPassword) {
            return showToast({
                title: 'Validation Failed',
                type: 'error',
                message: 'Passwords do not match.'
            });
        }

        setIsLoading(true);

        if (isForgotPassword) {
            const promise = new Promise((resolve) => {
                dispatch(forgotPasswordRequest({ email: cleanEmail, resolve }));
            });

            promise.then(res => {
                if (res.success) {
                    showToast({
                        title: 'Email Sent',
                        type: 'success',
                        message: 'Check your inbox for the reset link.'
                    });
                    setIsForgotPassword(false);
                } else {
                    showToast({
                        title: 'Recovery Failed',
                        type: 'error',
                        message: 'Could not send recovery email.',
                        regexErrors: res.details || [res.error]
                    });
                }
            }).finally(() => {
                setIsLoading(false);
            });
            return;
        }

        try {
            let result;

            if (isLogin) {
                result = await login({ email: cleanEmail, password });
            } else {
                const deviceId = localStorage.getItem('device_id') || crypto.randomUUID();
                result = await register({
                    username: username.trim(),
                    email: cleanEmail,
                    password,
                    deviceId
                });
            }

            if (result.success) {
                showToast({
                    title: isLogin ? 'Welcome back!' : 'Account created!',
                    message: isLogin ? 'Loading your focus data...' : 'Your journey begins now.',
                    type: 'success'
                });
                onSuccess?.();
            } else {
                showToast({
                    title: isLogin ? 'Sign In Failed' : 'Sign Up Failed',
                    message: 'Please review the following issues:',
                    type: 'error',
                    regexErrors: result.details || [result.error || 'Authentication failed']
                });
            }
        } catch (error) {
            showToast({
                title: 'Server Error',
                type: 'error',
                message: 'There was a problem communicating with the server.',
                details: error.message
            });
        } finally {
            setIsLoading(false);
        }
    };

    const inputBaseStyle = {
        height: '48px',
        borderRadius: '12px',
        fontSize: '0.95rem',
        width: '100%',
        boxSizing: 'border-box'
    };

    return (
        <div className="auth-container" style={{ padding: '4px 0' }}>
            <div className="auth-header" style={{ marginBottom: '28px', textAlign: 'center' }}>
                <h2 style={{ fontSize: '1.4rem', fontWeight: '700', color: 'white', marginBottom: '6px', letterSpacing: '-0.02em' }}>
                    {isForgotPassword ? 'Reset Password' : (isLogin ? 'Sign In' : 'Create Account')}
                </h2>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    {isForgotPassword
                        ? 'Enter your email to receive a reset link'
                        : (isLogin ? 'Enter your credentials' : 'Join the focus journey')}
                </p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {!isLogin && !isForgotPassword && (
                    <div className="input-group" style={{ position: 'relative' }}>
                        <div style={{ position: 'relative' }}>
                            <User size={18} style={iconStyle} />
                            <input
                                type="text"
                                placeholder="Username"
                                className="input-text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                style={{ ...inputBaseStyle, paddingLeft: '44px' }}
                            />
                        </div>
                    </div>
                )}

                <div className="input-group" style={{ position: 'relative' }}>
                    <Mail size={18} style={iconStyle} />
                    <input
                        type="email"
                        placeholder="Email address"
                        className="input-text"
                        style={{ ...inputBaseStyle, paddingLeft: '44px' }}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                {!isForgotPassword && (
                    <div className="input-group" style={{ position: 'relative' }}>
                        <Lock size={18} style={iconStyle} />
                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Password"
                            className="input-text"
                            style={{ ...inputBaseStyle, paddingLeft: '44px', paddingRight: '44px' }}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button type="button" onClick={() => setShowPassword((v) => !v)} style={eyeButtonStyle}>
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                )}

                {!isLogin && !isForgotPassword && (
                    <div className="input-group" style={{ position: 'relative' }}>
                        <Lock size={18} style={iconStyle} />
                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Confirm password"
                            className="input-text"
                            style={{ ...inputBaseStyle, paddingLeft: '44px', paddingRight: '44px' }}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <button type="button" onClick={() => setShowPassword((v) => !v)} style={eyeButtonStyle}>
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                )}

                {isLogin && !isForgotPassword && (
                    <div style={{ textAlign: 'right', marginTop: '-4px' }}>
                        <button
                            type="button"
                            onClick={() => setIsForgotPassword(true)}
                            style={{ background: 'none', border: 'none', color: 'var(--primary-color)', fontSize: '0.85rem', cursor: 'pointer', padding: 0 }}
                        >
                            Forgot your password?
                        </button>
                    </div>
                )}

                <button
                    type="submit"
                    className="btn-save"
                    disabled={isLoading}
                    style={{
                        marginTop: '10px',
                        width: '100%',
                        height: '52px',
                        justifyContent: 'center',
                        background: 'var(--primary-color)',
                        boxShadow: '0 4px 15px var(--primary-glow)',
                        color: 'white',
                        fontSize: '1rem',
                        fontWeight: '600',
                        borderRadius: '14px',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        cursor: isLoading ? 'not-allowed' : 'pointer',
                        transition: 'all 0.2s ease'
                    }}
                >
                    {isLoading ? <Loader2 className="animate-spin" size={20} /> : (
                        <>
                            {isForgotPassword ? 'Send Link' : (isLogin ? 'Sign In' : 'Sign Up')}
                            <ArrowRight size={18} />
                        </>
                    )}
                </button>
            </form>

            <div style={{ marginTop: '24px', textAlign: 'center' }}>
                {isForgotPassword ? (
                    <button
                        onClick={() => setIsForgotPassword(false)}
                        style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.85rem', textDecoration: 'underline' }}
                    >
                        Back to Sign In
                    </button>
                ) : (
                    <button
                        onClick={toggleMode}
                        style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.85rem' }}
                    >
                        {isLogin ? 'New to Ataraxia? ' : 'Already have an account? '}
                        <span style={{ color: 'var(--primary-color)', fontWeight: '600' }}>
                            {isLogin ? 'Create account' : 'Sign in'}
                        </span>
                    </button>
                )}
            </div>
        </div>
    );
};

const iconStyle = { position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none', zIndex: 2 };
const eyeButtonStyle = { position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', zIndex: 3 };

export default AuthForm;