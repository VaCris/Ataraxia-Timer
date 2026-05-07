import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Lock, Eye, EyeOff, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const navigate = useNavigate();
    const { resetPassword } = useAuth();

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    if (!token) {
        navigate('/');
        return null;
    }

    const passwordsMatch = password.length > 0 && password === confirmPassword;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password.length < 6) return toast.error('Password must be at least 6 characters');
        if (!passwordsMatch) return toast.error('Passwords do not match');

        setIsLoading(true);
        const result = await resetPassword(token, password);
        setIsLoading(false);

        if (result.success) {
            toast.success('Password updated successfully! You can now log in.');
            navigate('/');
        } else {
            toast.error(result.error);
        }
    };

    return (
        <div className="flex justify-center items-center bg-[#0a0a0a] p-4 min-h-screen">
            <div className="bg-white/5 shadow-2xl backdrop-blur-xl p-8 border border-white/10 rounded-[2.5rem] w-full max-w-md">
                <div className="mb-8 text-center">
                    <h2 className="mb-1 font-bold text-white text-2xl tracking-tight">
                        New Password
                    </h2>
                    <p className="text-[10px] text-white/30 uppercase tracking-[0.3em]">
                        Ataraxia Security System
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="relative">
                        <Lock size={18} className="top-1/2 left-4 absolute text-white/20 -translate-y-1/2" />
                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="New Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="bg-white/5 pr-11 pl-11 border border-white/5 focus:border-accent/50 rounded-xl outline-none w-full h-12 text-white text-sm transition-colors"
                            required
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="top-1/2 right-4 absolute text-white/20 hover:text-white -translate-y-1/2">
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>

                    <div className="space-y-2">
                        <div className="relative">
                            <Lock size={18} className="top-1/2 left-4 absolute text-white/20 -translate-y-1/2" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Confirm New Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="bg-white/5 pr-11 pl-11 border border-white/5 focus:border-accent/50 rounded-xl outline-none w-full h-12 text-white text-sm transition-colors"
                                required
                            />
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

                    <button
                        type="submit"
                        disabled={isLoading || !passwordsMatch}
                        className="flex justify-center items-center gap-2 bg-accent disabled:opacity-50 shadow-glow mt-4 rounded-xl w-full h-12 font-bold text-white text-xs uppercase tracking-[0.2em] active:scale-95 transition-all"
                    >
                        {isLoading ? <Loader2 className="animate-spin" size={18} /> : 'Save Password'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;