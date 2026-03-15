import React, { useState } from 'react';
import { useTasks } from '@hooks/useTasks';
import TagFilterBar from './TagFilterBar';
import { motion, AnimatePresence } from 'framer-motion';

const TaskManager = () => {
    const { tasks, loading } = useTasks();
    const [filterTagId, setFilterTagId] = useState(null);

    const filteredTasks = filterTagId
        ? tasks.filter(task => task.tagId === filterTagId)
        : tasks;

    return (
        <div className="flex flex-col mx-auto p-6 w-full max-w-5xl">
            <header className="mb-8">
                <h2 className="mb-4 font-black text-[10px] text-white/20 uppercase tracking-[0.5em]">Focus View</h2>

                <TagFilterBar
                    selectedTagId={filterTagId}
                    onSelectTag={setFilterTagId}
                />
            </header>

            <div className="flex flex-col gap-4">
                <AnimatePresence mode="popLayout">
                    {filteredTasks.map((task) => (
                        <motion.div
                            key={task.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            layout
                        >
                            {/* Aquí va tu componente de TaskItem */}
                            <div className="flex justify-between items-center bg-white/5 p-6 border border-white/5 rounded-3xl">
                                <span className="font-medium text-white">{task.title}</span>
                                {/* Buscamos el color del tag de la tarea si lo tiene */}
                                {task.tag && (
                                    <div className="rounded-full w-2 h-2" style={{ backgroundColor: task.tag.color }} />
                                )}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {/* Estado vacío cuando no hay tareas en esa categoría */}
                {filteredTasks.length === 0 && !loading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="py-20 border border-white/5 border-dashed rounded-[3rem] text-center"
                    >
                        <p className="text-[10px] text-white/10 uppercase tracking-widest">
                            No tasks found in this focus area
                        </p>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default TaskManager;