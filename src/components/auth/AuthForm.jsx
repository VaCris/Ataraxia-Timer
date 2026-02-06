import React, { useState } from 'react';
import { useAuth } from '../../context/auth-context';
import toast from 'react-hot-toast';
import { Loader2, Mail, Lock, User, ArrowRight } from 'lucide-react';

const AuthForm = ({ isLogin, onSuccess, toggleMode }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { login, register } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const cleanEmail = email.trim().toLowerCase();

        try {
            let result;
            if (isLogin) {
                result = await login(cleanEmail, password);
            } else {
                const deviceId = localStorage.getItem('device_id') || crypto.randomUUID();
                result = await register({
                    firstName: firstName.trim(),
                    lastName: lastName.trim(),
                    email: cleanEmail,
                    password,
                    deviceId
                });
            }

            if (result.success) {
                toast.success(isLogin ? 'Welcome back!' : 'Account created successfully!');
                onSuccess?.();
            } else {
                toast.error(result.error || 'Authentication failed');
            }
        } catch (error) {
            toast.error('Connection error with server');
        } finally {
            setIsLoading(false);
        }
    };

    const inputBaseStyle = {
        height: '48px',
        borderRadius: '12px',
        fontSize: '0.95rem'
    };

    return (
        <div className="auth-container" style={{ padding: '4px 0' }}>
            <div className="auth-header" style={{ marginBottom: '28px', textAlign: 'center' }}>
                <h2 style={{
                    fontSize: '1.4rem',
                    fontWeight: '700',
                    color: 'white',
                    marginBottom: '6px',
                    letterSpacing: '-0.02em'
                }}>
                    {isLogin ? 'Sign In' : 'Create Account'}
                </h2>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    {isLogin ? 'Enter your credentials' : 'Join the focus journey'}
                </p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {!isLogin && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div style={{ position: 'relative' }}>
                            <User size={18} style={iconStyle} />
                            <input
                                type="text"
                                placeholder="First Name"
                                className="input-text"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                required={!isLogin}
                                style={{ ...inputBaseStyle, paddingLeft: '44px' }}
                            />
                        </div>
                        <input
                            type="text"
                            placeholder="Last Name (Optional)"
                            className="input-text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required={false}
                            style={inputBaseStyle}
                        />
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
                        required
                    />
                </div>

                <div className="input-group" style={{ position: 'relative' }}>
                    <Lock size={18} style={iconStyle} />
                    <input
                        type="password"
                        placeholder="Password"
                        className="input-text"
                        style={{ ...inputBaseStyle, paddingLeft: '44px' }}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

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
                            {isLogin ? 'Sign In' : 'Sign Up'}
                            <ArrowRight size={18} />
                        </>
                    )}
                </button>
            </form>

            <div style={{ marginTop: '24px', textAlign: 'center' }}>
                <button
                    onClick={toggleMode}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-muted)',
                        cursor: 'pointer',
                        fontSize: '0.85rem'
                    }}
                >
                    {isLogin ? "New to Ataraxia? " : "Already have an account? "}
                    <span style={{ color: 'var(--primary-color)', fontWeight: '600' }}>
                        {isLogin ? "Create account" : "Sign in"}
                    </span>
                </button>
            </div>
        </div>
    );
};

const iconStyle = {
    position: 'absolute',
    left: '14px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: 'var(--text-muted)',
    pointerEvents: 'none',
    zIndex: 2
};

export default AuthForm;