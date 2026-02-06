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
    const fieldHeight = '46px';
    const borderRadius = '12px';

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
                toast.success(isLogin ? 'Welcome back!' : 'Account created!');
                onSuccess?.();
            } else {
                toast.error(result.error || 'Auth failed');
            }
        } catch (error) {
            toast.error('Connection error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-container" style={{ padding: '4px' }}>
            <div className="auth-header" style={{ marginBottom: '32px', textAlign: 'center' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'white', marginBottom: '8px' }}>
                    {isLogin ? 'Sign In' : 'Create Account'}
                </h2>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                    {isLogin ? 'Enter your credentials' : 'Join the focus journey'}
                </p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
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
                                style={{ ...inputBaseStyle, height: fieldHeight, paddingLeft: '42px' }}
                            />
                        </div>
                        <input
                            type="text"
                            placeholder="Last Name"
                            className="input-text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required={!isLogin}
                            style={{ ...inputBaseStyle, height: fieldHeight }}
                        />
                    </div>
                )}

                <div style={{ position: 'relative' }}>
                    <Mail size={18} style={iconStyle} />
                    <input
                        type="email"
                        placeholder="Email"
                        className="input-text"
                        style={{ ...inputBaseStyle, height: fieldHeight, paddingLeft: '42px' }}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div style={{ position: 'relative' }}>
                    <Lock size={18} style={iconStyle} />
                    <input
                        type="password"
                        placeholder="Password"
                        className="input-text"
                        style={{ ...inputBaseStyle, height: fieldHeight, paddingLeft: '42px' }}
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
                        height: '50px',
                        justifyContent: 'center',
                        background: 'var(--primary-purple)',
                        color: 'white',
                        fontWeight: '600',
                        fontSize: '1rem',
                        borderRadius: borderRadius,
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        cursor: isLoading ? 'not-allowed' : 'pointer',
                        boxShadow: '0 4px 15px rgba(139, 92, 246, 0.3)'
                    }}
                >
                    {isLoading ? <Loader2 className="animate-spin" size={22} /> : (
                        <>
                            {isLogin ? 'Sign In' : 'Sign Up'}
                            <ArrowRight size={20} />
                        </>
                    )}
                </button>
            </form>

            <div style={{ marginTop: '28px', textAlign: 'center' }}>
                <button
                    onClick={toggleMode}
                    style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.875rem' }}
                >
                    {isLogin ? "New to Ataraxia? " : "Already have an account? "}
                    <span style={{ color: 'var(--primary-purple)', fontWeight: '600' }}>
                        {isLogin ? "Create account" : "Sign in"}
                    </span>
                </button>
            </div>
        </div>
    );
};

const inputBaseStyle = {
    width: '100%',
    borderRadius: '12px',
    fontSize: '0.95rem',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid var(--glass-border)',
    color: 'white',
    boxSizing: 'border-box'
};

const iconStyle = {
    position: 'absolute',
    left: '14px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: 'var(--text-muted)',
    zIndex: 1,
    pointerEvents: 'none'
};

export default AuthForm;