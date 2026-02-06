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
        const cleanFirstName = firstName.trim();
        const cleanLastName = lastName.trim();

        try {
            let result;
            if (isLogin) {
                result = await login(cleanEmail, password);
            } else {
                const deviceId = localStorage.getItem('device_id') || crypto.randomUUID();
                if (!localStorage.getItem('device_id')) {
                    localStorage.setItem('device_id', deviceId);
                }

                result = await register({
                    firstName: cleanFirstName,
                    lastName: cleanLastName,
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

    return (
        <div className="auth-container" style={{ padding: '8px' }}>
            <div className="auth-header" style={{ marginBottom: '32px', textAlign: 'center' }}>
                <h2 style={{
                    fontSize: '1.5rem',
                    fontWeight: '700',
                    color: 'white',
                    marginBottom: '8px',
                    letterSpacing: '-0.025em'
                }}>
                    {isLogin ? 'Sign In' : 'Create Account'}
                </h2>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                    {isLogin ? 'Enter your credentials' : 'Join the focus journey'}
                </p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {!isLogin && (
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <div style={{ flex: 1, position: 'relative' }}>
                            <User size={16} style={iconStyle} />
                            <input
                                type="text"
                                placeholder="First Name"
                                className="input-text"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                required={!isLogin}
                                style={{ paddingLeft: '40px' }}
                            />
                        </div>
                        <div style={{ flex: 1 }}>
                            <input
                                type="text"
                                placeholder="Last Name"
                                className="input-text"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                required={!isLogin}
                            />
                        </div>
                    </div>
                )}

                <div className="input-group">
                    <div className="input-wrapper" style={{ position: 'relative' }}>
                        <Mail size={16} style={iconStyle} />
                        <input
                            type="email"
                            placeholder="Email address"
                            className="input-text"
                            style={{ paddingLeft: '40px' }}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                </div>

                <div className="input-group">
                    <div className="input-wrapper" style={{ position: 'relative' }}>
                        <Lock size={16} style={iconStyle} />
                        <input
                            type="password"
                            placeholder="Password"
                            className="input-text"
                            style={{ paddingLeft: '40px' }}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    className="btn-save"
                    disabled={isLoading}
                    style={{
                        marginTop: '12px',
                        width: '100%',
                        height: '48px',
                        justifyContent: 'center',
                        background: 'var(--primary-purple)',
                        color: 'white',
                        fontWeight: '600',
                        borderRadius: '12px',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        cursor: isLoading ? 'not-allowed' : 'pointer'
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
                        fontSize: '0.875rem'
                    }}
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

const iconStyle = {
    position: 'absolute',
    left: '14px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: 'var(--text-muted)',
    pointerEvents: 'none'
};

export default AuthForm;