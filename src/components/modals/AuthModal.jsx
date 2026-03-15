import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux'; // Escuchamos el estado
import { X } from 'lucide-react';
import AuthForm from '@components/auth/AuthForm';

const AuthModal = ({ isOpen, onClose }) => {
    const [isLogin, setIsLogin] = useState(true);

    // Obtenemos el estado de autenticación de Redux
    const { status } = useSelector(state => state.auth);

    const toggleMode = () => setIsLogin(!isLogin);

    // EFECTO DE CIERRE AUTOMÁTICO
    // Si la Saga tiene éxito, el status cambiará a 'authenticated'
    // y el modal se cerrará solo, sin lógica extra en los componentes.
    useEffect(() => {
        if (status === 'authenticated' && isOpen) {
            onClose();
        }
    }, [status, isOpen, onClose]);

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
                        className="relative bg-black/90 shadow-2xl backdrop-blur-3xl p-10 md:p-16 border border-white/10 rounded-[4rem] w-full max-w-xl overflow-hidden glass"
                    >
                        <button
                            onClick={onClose}
                            className="top-10 right-10 z-[110] absolute text-white/20 hover:text-white transition-colors"                        >
                            <X size={24} />
                        </button>

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