import React from 'react';
import { Leaf, Plus } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';

const EmptyTasks = ({ onCreate }) => {
    const reduceMotion = useReducedMotion();

    return (
        <motion.div
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0.08 : 0.25 }}
            className="flex flex-col justify-center items-center p-6 sm:p-8 border border-white/10 border-dashed rounded-[2rem] min-h-64 text-center"
        >
            <div className="flex items-center justify-center bg-accent/10 mb-4 rounded-full w-14 h-14" aria-hidden="true">
                <Leaf className="text-accent" size={26} />
            </div>
            <h3 className="font-black text-white/80 text-sm uppercase tracking-[0.14em]">No missions yet</h3>
            <p className="mt-2 max-w-[260px] text-white/60 text-[12px] sm:text-[13px] leading-relaxed">
                Create your first mission to give the next focus session a clear objective.
            </p>
            <button
                type="button"
                onClick={onCreate}
                className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 font-black text-[11px] uppercase tracking-[0.12em] text-white/80 transition-all hover:bg-white/10 hover:text-white active:scale-95"
            >
                <Plus size={15} strokeWidth={2.5} />
                Create mission
            </button>
        </motion.div>
    );
};

export default EmptyTasks;
