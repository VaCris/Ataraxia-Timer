import React, { useState } from 'react';
import { useAuth } from '../../context/auth-context';

const AuthForm = ({ mode = 'login', onToggleMode }) => {
    const { login, register } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            let result;
            if (mode === 'login') {
                result = await login(email, password);
            } else {
                result = await register({
                    firstName,
                    lastName,
                    email,
                    password,
                    deviceId: localStorage.getItem('device_id')
                });
            }

            if (!result.success) {
                setError(result.error || 'Authentication failed');
            }
        } catch (err) {
            setError('Connection error with the server');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '12px' }}>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '15px' }}>
                {mode === 'login' ? 'Sign in to sync your stats.' : 'Create an account to save your progress.'}
            </p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {mode === 'register' && (
                    <>
                        <input
                            type="text" placeholder="First Name" className="input-text" required
                            name="firstName" autoComplete="given-name" value={firstName}
                            onChange={e => setFirstName(e.target.value)}
                        />
                        <input
                            type="text" placeholder="Last Name (Optional)" className="input-text"
                            name="lastName" autoComplete="family-name" value={lastName}
                            onChange={e => setLastName(e.target.value)}
                        />
                    </>
                )}
                <input
                    type="email" placeholder="Email" className="input-text" required
                    name="email" autoComplete="email" value={email}
                    onChange={e => setEmail(e.target.value)}
                />
                <input
                    type="password" placeholder="Password" className="input-text" required
                    name="password"
                    autoComplete={mode === 'login' ? "current-password" : "new-password"}
                    value={password} onChange={e => setPassword(e.target.value)}
                />

                {mode === 'register' && (
                    <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', margin: '0' }}>
                        * Password must include uppercase, lowercase, and a number.
                    </p>
                )}

                {error && <span style={{ color: '#f87171', fontSize: '0.8rem' }}>{error}</span>}

                <button type="submit" className="btn-upload" disabled={loading}
                    style={{ justifyContent: 'center', background: 'var(--primary-color)', color: 'white', border: 'none' }}>
                    {loading ? 'Processing...' : (mode === 'login' ? 'Sign In' : 'Create Account')}
                </button>
            </form>

            <button onClick={onToggleMode}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.8rem', cursor: 'pointer', marginTop: '12px', width: '100%', textDecoration: 'underline' }}>
                {mode === 'login' ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
        </div>
    );
};

export default AuthForm;