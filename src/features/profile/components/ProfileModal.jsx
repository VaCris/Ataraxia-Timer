import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import ProfileView from './ProfileView';

const ProfileModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="z-[200] fixed inset-0 flex justify-center items-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    className="relative w-full max-w-5xl my-8"
                    onClick={(e) => e.stopPropagation()}
                >
                    <button
                        type="button"
                        onClick={onClose}
                        className="top-0 right-0 z-10 absolute flex justify-center items-center bg-black/40 hover:bg-white/10 backdrop-blur-md border border-white/10 rounded-full w-10 h-10 text-white/50 hover:text-white transition-all -translate-y-1/2 translate-x-1/2"
                    >
                        <X size={20} />
                    </button>
                    
                    <div className="w-full h-full max-h-[85vh] overflow-y-auto custom-scrollbar rounded-[3rem]">
                        <ProfileView />
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default ProfileModal;
