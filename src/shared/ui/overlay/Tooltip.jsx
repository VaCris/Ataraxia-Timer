import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const Tooltip = ({ children, text }) => {
    const [show, setShow] = useState(false);

    return (
        <div
            className="relative flex items-center"
            onMouseEnter={() => setShow(true)}
            onMouseLeave={() => setShow(false)}
        >
            {children}
            <AnimatePresence>
                {show && (
                    <motion.div
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 20 }}
                        exit={{ opacity: 0, x: 10 }}
                        className="left-full z-50 absolute bg-accent shadow-glow ml-2 px-3 py-1.5 rounded-lg font-black text-[10px] text-white uppercase tracking-tighter whitespace-nowrap pointer-events-none"
                    >
                        {text}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Tooltip;