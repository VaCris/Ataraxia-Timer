import React from 'react';
import { Leaf } from 'lucide-react';
import { motion } from 'framer-motion';

const EmptyTasks = () => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col justify-center items-center p-8 border-2 border-white/5 border-dashed rounded-[2.5rem] h-64 text-center"
        >
            <div className="bg-accent/10 mb-4 p-4 rounded-full">
                <Leaf className="text-accent/40" size={32} />
            </div>
            <h3 className="font-bold text-white/60 text-sm uppercase tracking-widest">Zen State</h3>
            <p className="mt-2 max-w-[200px] text-white/30 text-xs">
                There are no pending missions. Take a break or add a new goal.
            </p>
        </motion.div>
    );
};

export default EmptyTasks;