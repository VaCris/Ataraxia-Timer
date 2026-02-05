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

        try {
            let result;
            if (isLogin) {
                result = await login(email, password);
            } else {
                const deviceId = localStorage.getItem('device_id') || crypto.randomUUID();
                result = await register({
                    firstName,
                    lastName,
                    email,
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
        <div className="auth-container" style={{ padding: '10px 0' }}>
            <div className="auth-header" style={{ marginBottom: '20px', textAlign: 'center' }}>
                <h2 style={{ fontSize: '1.2rem', fontWeight: '600', color: 'white' }}>
                    {isLogin ? 'Sign In' : 'Create Account'}
                </h2>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {!isLogin && (
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <div className="input-wrapper" style={{ flex: 1 }}>
                            <input
                                type="text"
                                placeholder="First Name"
                                className="input-text"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                required={!isLogin}
                                autoComplete="given-name"
                            />
                        </div>
                        <div className="input-wrapper" style={{ flex: 1 }}>
                            <input
                                type="text"
                                placeholder="Last Name"
                                className="input-text"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                required={!isLogin}
                                autoComplete="family-name"
                            />
                        </div>
                    </div>
                )}

                <div className="input-group">
                    <div className="input-wrapper" style={{ position: 'relative' }}>
                        <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input
                            type="email"
                            placeholder="Email address"
                            className="input-text"
                            style={{ paddingLeft: '40px', width: '100%' }}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            autoComplete="email"
                        />
                    </div>
                </div>

                <div className="input-group">
                    <div className="input-wrapper" style={{ position: 'relative' }}>
                        <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input
                            type="password"
                            placeholder="Password"
                            className="input-text"
                            style={{ paddingLeft: '40px', width: '100%' }}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            autoComplete={isLogin ? "current-password" : "new-password"}
                        />
                    </div>
                </div>

                <button type="submit" className="btn-save" disabled={isLoading} style={{ marginTop: '10px', width: '100%', justifyContent: 'center', background: 'var(--primary-color)', border: 'none' }}>
                    {isLoading ? <Loader2 className="animate-spin" size={18} /> : (
                        <>
                            {isLogin ? 'Sign In' : 'Sign Up'}
                            <ArrowRight size={16} style={{ marginLeft: '8px' }} />
                        </>
                    )}
                </button>
            </form>

            <div style={{ marginTop: '20px', textAlign: 'center' }}>
                <button onClick={toggleMode} style={{ background: 'none', border: 'none', color: 'var(--primary-color)', cursor: 'pointer', fontSize: '0.85rem' }}>
                    {isLogin ? "New to Ataraxia? Create account" : "Already have an account? Sign in"}
                </button>
            </div>
        </div>
    );
};

export default AuthForm;