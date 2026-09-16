import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';
import { X } from 'lucide-react';
import AuthForm from '@/features/auth/components/AuthForm';

const AuthModal = ({ isOpen, onClose }) => {
    const [isLogin, setIsLogin] = useState(true);

    const { status } = useSelector(state => state.auth);
    const toggleMode = () => setIsLogin(!isLogin);

    // Auto-close on successful auth
    useEffect(() => {
        if (status === 'authenticated' && isOpen) {
            onClose();
        }
    }, [status, isOpen, onClose]);

    // Trap focus and disable scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            const handleEscape = (e) => {
                if (e.key === 'Escape') onClose();
            };
            window.addEventListener('keydown', handleEscape);
            return () => {
                document.body.style.overflow = 'unset';
                window.removeEventListener('keydown', handleEscape);
            };
        }
    }, [isOpen, onClose]);

    const overlayVariants = {
        hidden: { opacity: 0, backdropFilter: 'blur(0px)' },
        visible: { 
            opacity: 1, 
            backdropFilter: 'blur(16px)',
            transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } 
        },
        exit: { 
            opacity: 0, 
            backdropFilter: 'blur(0px)',
            transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1], delay: 0.1 } 
        }
    };

    const modalVariants = {
        hidden: { opacity: 0, scale: 0.95, y: 30, rotateX: 5 },
        visible: { 
            opacity: 1, 
            scale: 1, 
            y: 0, 
            rotateX: 0,
            transition: { 
                duration: 0.5, 
                ease: [0.16, 1, 0.3, 1],
                delay: 0.05 
            }
        },
        exit: { 
            opacity: 0, 
            scale: 0.95, 
            y: 20, 
            transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } 
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div 
                    className="z-[100] fixed inset-0 flex justify-center items-center p-4 sm:p-6 md:p-12"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="auth-modal-title"
                >
                    <motion.div
                        variants={overlayVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 md:bg-black/40"
                        aria-hidden="true"
                    />

                    <motion.div
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="relative bg-[#050505]/95 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)] backdrop-blur-3xl p-8 sm:p-12 md:p-16 border border-white/10 sm:rounded-[3rem] rounded-[2rem] w-full max-w-xl overflow-hidden ring-1 ring-white/5"
                        style={{ perspective: '1000px' }}
                    >
                        <button
                            onClick={onClose}
                            className="top-6 right-6 sm:top-8 sm:right-8 z-[110] absolute flex items-center justify-center w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-accent active:scale-95"
                            aria-label="Close authentication window"
                        >
                            <X size={20} />
                        </button>

                        <div id="auth-modal-title" className="sr-only">
                            {isLogin ? 'Login to your account' : 'Create a new account'}
                        </div>

                        <AuthForm
                            isLogin={isLogin}
                            toggleMode={toggleMode}
                        />
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default AuthModal;