import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, CheckCircle, AlertCircle } from 'lucide-react';

const Toast = ({ message, type = 'xp', isOpen, onClose }) => {
    useEffect(() => {
        if (isOpen) {
            const timer = setTimeout(onClose, 3000);
            return () => clearTimeout(timer);
        }
    }, [isOpen, onClose]);

    const icons = {
        xp: <Award className="text-accent" size={20} />,
        success: <CheckCircle className="text-green-500" size={20} />,
        error: <AlertCircle className="text-red-500" size={20} />,
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: 50, x: '-50%' }}
                    animate={{ opacity: 1, y: 0, x: '-50%' }}
                    exit={{ opacity: 0, scale: 0.95, x: '-50%' }}
                    className="bottom-10 left-1/2 z-[100] fixed flex items-center gap-3 bg-surface shadow-2xl backdrop-blur-xl px-6 py-4 border border-white/10 rounded-2xl"
                >
                    <div className="bg-white/5 p-2 rounded-lg">
                        {icons[type]}
                    </div>
                    <p className="font-bold text-cream text-sm tracking-wide whitespace-nowrap">
                        {message}
                    </p>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Toast;