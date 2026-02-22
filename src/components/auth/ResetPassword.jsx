import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Loader2, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { resetPasswordRequest } from '../../store/slices/authSlice';

const ResetPassword = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!token) {
            toast.error("Invalid or missing recovery token");
            navigate('/');
        }
    }, [token, navigate]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            return toast.error("Passwords do not match");
        }

        if (password.length < 6) {
            return toast.error("Password must be at least 6 characters long");
        }

        setIsLoading(true);

        const promise = new Promise((resolve) => {
            dispatch(resetPasswordRequest({
                token,
                password,
                resolve
            }));
        });

        toast.promise(promise, {
            loading: 'Resetting password...',
            success: 'Password reset successfully! You can now sign in.',
            error: (err) => err.error || 'Failed to reset password. The link might be expired.'
        });

        promise.then(res => {
            if (res.success) {
                setTimeout(() => {
                    sessionStorage.setItem('dw-intro-seen', 'true');
                    navigate('/');
                }, 2000);
            }
        }).finally(() => {
            setIsLoading(false);
        });
    };

    const inputBaseStyle = {
        height: '48px',
        borderRadius: '12px',
        fontSize: '0.95rem',
        width: '100%',
        boxSizing: 'border-box',
        paddingLeft: '44px',
        paddingRight: '44px',
        border: '1px solid var(--glass-border)',
        background: 'rgba(0,0,0,0.2)',
        color: 'white',
        outline: 'none'
    };

    if (!token) return null;

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#050505' }}>
            <div style={{ width: '100%', maxWidth: '400px', padding: '2rem', background: 'rgba(255,255,255,0.03)', borderRadius: '24px', border: '1px solid var(--glass-border)', backdropFilter: 'blur(10px)' }}>
                <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                    <h2 style={{ fontSize: '1.4rem', fontWeight: '700', color: 'white', marginBottom: '6px' }}>
                        Set New Password
                    </h2>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        Please enter your new password below
                    </p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ position: 'relative' }}>
                        <Lock size={18} style={iconStyle} />
                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="New password"
                            style={inputBaseStyle}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} style={eyeButtonStyle}>
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>

                    <div style={{ position: 'relative' }}>
                        <Lock size={18} style={iconStyle} />
                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Confirm new password"
                            style={inputBaseStyle}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} style={eyeButtonStyle}>
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        style={{
                            marginTop: '10px', width: '100%', height: '52px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px',
                            background: 'var(--primary-color)', color: 'white', fontSize: '1rem', fontWeight: '600', borderRadius: '14px', border: 'none',
                            cursor: isLoading ? 'not-allowed' : 'pointer', transition: 'all 0.2s ease', opacity: isLoading ? 0.7 : 1
                        }}
                    >
                        {isLoading ? <Loader2 className="animate-spin" size={20} /> : (
                            <>Reset Password <ArrowRight size={18} /></>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

const iconStyle = { position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' };
const eyeButtonStyle = { position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' };

export default ResetPassword;