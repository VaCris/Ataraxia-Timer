import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import AuthForm from '@components/auth/AuthForm';

const AuthModal = ({ isOpen, onClose }) => {
    const [isLogin, setIsLogin] = useState(true);

    const toggleMode = () => setIsLogin(!isLogin);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="z-[100] fixed inset-0 flex justify-center items-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/40 backdrop-blur-md"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative bg-black/80 shadow-2xl backdrop-blur-3xl p-8 md:p-12 border border-white/10 rounded-[3rem] w-full max-w-md overflow-hidden glass"
                    >
                        <button
                            onClick={onClose}
                            className="top-8 right-8 z-[110] absolute text-white/20 hover:text-white transition-colors"
                        >
                            <X size={20} />
                        </button>

                        <AuthForm
                            isLogin={isLogin}
                            toggleMode={toggleMode}
                            onSuccess={onClose}
                        />
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default AuthModal;