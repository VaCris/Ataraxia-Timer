import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useAuth } from '@context/AuthContext';
import toast from 'react-hot-toast';
import { 
    Loader2, Mail, Lock, User, ArrowRight, Eye, 
    EyeOff, ShieldCheck, CheckCircle2, AlertCircle 
} from 'lucide-react';
import { forgotPasswordRequest } from '@store/slices/authSlice';

const AuthForm = ({ isLogin, onSuccess, toggleMode }) => {
    const dispatch = useDispatch();
    const { login, register } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [username, setUsername] = useState('');
    
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isForgotPassword, setIsForgotPassword] = useState(false);

    const passwordRequirements = [
        { label: 'Min. 6 characters', test: password.length >= 6 },
        { label: 'Upper & Lowercase', test: /[A-Z]/.test(password) && /[a-z]/.test(password) },
        { label: 'Number or Symbol', test: /(?=.*\d)|(?=.*\W+)/.test(password) }
    ];

    const isPasswordStrong = passwordRequirements.every(req => req.test);
    const passwordsMatch = password.length > 0 && password === confirmPassword;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isForgotPassword) {
            return;
        }

        if (!isLogin) {
            if (!isPasswordStrong) return toast.error('Check security requirements');
            if (!passwordsMatch) return toast.error('Passwords do not match');
        }

        setIsLoading(true);
        try {
            const result = isLogin 
                ? await login(email.trim().toLowerCase(), password)
                : await register({ username: username.trim(), email: email.trim().toLowerCase(), password });

            if (result.success) {
                toast.success(isLogin ? 'Welcome back!' : 'Account ready!');
                onSuccess?.();
            } else {
                toast.error(result.error || 'Error');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full auth-container">
            <div className="mb-8 text-center">
                <h2 className="mb-1 font-bold text-white text-2xl tracking-tight">
                    {isForgotPassword ? 'Recovery' : (isLogin ? 'Sign In' : 'Create Account')}
                </h2>
                <p className="text-[10px] text-white/30 uppercase tracking-[0.3em]">Ataraxia Security System</p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {!isLogin && !isForgotPassword && (
                    <div className="relative">
                        <User size={18} style={iconStyle} />
                        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} className="input-field" style={inputBaseStyle} required />
                    </div>
                )}

                <div className="relative">
                    <Mail size={18} style={iconStyle} />
                    <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field" style={inputBaseStyle} required />
                </div>

                {!isForgotPassword && (
                    <>
                        <div className="relative">
                            <Lock size={18} style={iconStyle} />
                            <input type={showPassword ? 'text' : 'password'} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="input-field" style={{ ...inputBaseStyle, paddingRight: '44px' }} required />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} style={eyeButtonStyle}>{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
                        </div>

                        {!isLogin && password.length > 0 && (
                            <div className="space-y-2 bg-white/5 p-4 border border-white/5 rounded-2xl">
                                {passwordRequirements.map((req, i) => (
                                    <div key={i} className={`flex items-center gap-2 text-[9px] font-bold uppercase ${req.test ? 'text-green-400' : 'text-white/20'}`}>
                                        <CheckCircle2 size={10} /> {req.label}
                                    </div>
                                ))}
                            </div>
                        )}

                        {!isLogin && (
                            <div className="space-y-2">
                                <div className="relative">
                                    <Lock size={18} style={iconStyle} />
                                    <input type={showPassword ? 'text' : 'password'} placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="input-field" style={{ ...inputBaseStyle, paddingRight: '44px' }} required />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} style={eyeButtonStyle}>{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
                                </div>
                                {confirmPassword.length > 0 && (
                                    <div className={`flex items-center gap-2 ml-2 transition-all ${passwordsMatch ? 'text-green-400' : 'text-red-400/50'}`}>
                                        {passwordsMatch ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
                                        <span className="font-black text-[9px] uppercase tracking-widest">
                                            {passwordsMatch ? 'Passwords match' : 'Passwords do not match yet'}
                                        </span>
                                    </div>
                                )}
                            </div>
                        )}
                    </>
                )}

                <button type="submit" disabled={isLoading} className="flex justify-center items-center gap-2 bg-accent disabled:opacity-50 shadow-glow mt-2 rounded-xl w-full h-12 font-bold text-white text-xs uppercase tracking-[0.2em] active:scale-95 transition-all btn-primary">
                    {isLoading ? <Loader2 className="animate-spin" size={18} /> : <>{isLogin ? 'Sign In' : 'Register'} <ArrowRight size={16} /></>}
                </button>
            </form>

            <div className="mt-8 text-center">
                <button onClick={toggleMode} className="font-bold text-[10px] text-white/30 hover:text-white uppercase tracking-widest">
                    {isLogin ? "New? Sign Up" : "Member? Log In"}
                </button>
            </div>
        </div>
    );
};

const inputBaseStyle = { width: '100%', height: '48px', backgroundColor: 'rgba(255, 255, 255, 0.05)', borderRadius: '12px', paddingLeft: '44px', fontSize: '0.875rem', color: 'white', outline: 'none', border: '1px solid rgba(255, 255, 255, 0.05)' };
const iconStyle = { position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255, 255, 255, 0.2)' };
const eyeButtonStyle = { position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255, 255, 255, 0.2)', background: 'none', border: 'none', cursor: 'pointer' };

export default AuthForm;