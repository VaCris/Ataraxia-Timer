import React, { useState } from 'react';
import EmptyTasks from './EmptyTasks';
import { usePomodoro } from '../../context/PomodoroContext';
import { Plus, Trash2, CheckCircle2, Circle, Tag as TagIcon, Hash } from 'lucide-react';

const TaskManager = () => {
    const { state, dispatch } = usePomodoro();
    const [name, setName] = useState('');
    const [est, setEst] = useState(1);
    const [tagName, setTagName] = useState('General');
    const [tagColor, setTagColor] = useState('#e11d48');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (name.trim().length < 2) return;

        dispatch({
            type: 'ADD_TASK',
            payload: {
                id: crypto.randomUUID(),
                name: name.trim(),
                estPomos: est,
                completed: false,
                tag: tagName || 'General',
                tagColor: tagColor,
                createdAt: new Date().toISOString()
            }
        });
        setName('');
        setEst(1);
    };

    return (
        <div className="flex flex-col bg-surface/20 backdrop-blur-md p-6 border border-white/5 rounded-[2.5rem] h-full">
            <h2 className="flex items-center gap-3 mb-6 px-2 font-bold text-lg">
                <span className="bg-accent rounded-full w-2 h-2"></span>
                Mission Log
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4 mb-8 px-2">
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="What's the next objective?"
                    className="bg-black/40 px-5 py-4 border border-white/10 focus:border-accent/50 rounded-2xl focus:outline-none w-full placeholder:text-white/20 text-sm transition-all"
                    maxLength={40}
                />

                <div className="flex gap-3">
                    <div className="relative flex-1">
                        <TagIcon className="top-1/2 left-4 absolute text-white/20 -translate-y-1/2" size={14} />
                        <input
                            type="text"
                            value={tagName}
                            onChange={(e) => setTagName(e.target.value)}
                            placeholder="Tag"
                            className="bg-black/20 py-3 pr-4 pl-10 border border-white/5 focus:border-white/20 rounded-2xl outline-none w-full font-bold text-xs uppercase tracking-widest transition-all"
                        />
                    </div>

                    <div className="group relative">
                        <div
                            className="flex justify-center items-center border-2 border-white/10 rounded-xl w-10 h-10 group-hover:scale-105 transition-transform cursor-pointer"
                            style={{ backgroundColor: tagColor }}
                        >
                            <Hash size={14} className="text-black/40" />
                            <input
                                type="color"
                                value={tagColor}
                                onChange={(e) => setTagColor(e.target.value)}
                                className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex gap-3">
                    <div className="flex flex-1 justify-between items-center bg-black/20 px-5 py-2 border border-white/5 rounded-2xl">
                        <span className="font-bold text-[10px] text-white/30 uppercase tracking-widest">Est. Pomos</span>
                        <input
                            type="number" min="1" max="10"
                            value={est}
                            onChange={(e) => setEst(parseInt(e.target.value))}
                            className="bg-transparent focus:outline-none w-12 font-bold text-right"
                        />
                    </div>
                    <button type="submit" className="bg-cream p-4 rounded-2xl text-black hover:scale-105 active:scale-95 transition-transform">
                        <Plus size={20} strokeWidth={3} />
                    </button>
                </div>
            </form>

            <div className="flex-1 space-y-3 px-2 overflow-y-auto custom-scrollbar">
                {state.tasks.length === 0 ? (
                    <EmptyTasks />
                ) : (
                    state.tasks.map(task => (
                        <div key={task.id} className={`group flex items-center justify-between p-5 rounded-2xl border transition-all ${task.completed ? 'bg-black/20 border-white/5 opacity-50' : 'bg-surface border-white/10 hover:border-accent/30'
                            }`}>
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => dispatch({ type: 'TOGGLE_TASK', payload: task.id })}
                                    className="active:scale-90 transition-transform"
                                >
                                    {task.completed ? <CheckCircle2 className="text-accent" /> : <Circle className="text-white/20" />}
                                </button>
                                <div>
                                    <p className={`text-sm font-medium ${task.completed ? 'line-through' : ''}`}>{task.name}</p>
                                    <div className="flex items-center gap-3 mt-1.5">
                                        <div className="flex gap-1">
                                            {[...Array(task.estPomos)].map((_, i) => (
                                                <div key={i} className="bg-white/10 rounded-full w-1.5 h-1.5" />
                                            ))}
                                        </div>
                                        {task.tag && (
                                            <span
                                                className="flex items-center gap-1 font-black text-[9px] uppercase tracking-tighter"
                                                style={{ color: task.tagColor }}
                                            >
                                                <div className="rounded-full w-1 h-1" style={{ backgroundColor: task.tagColor }} />
                                                {task.tag}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => dispatch({ type: 'DELETE_TASK', payload: task.id })}
                                className="opacity-0 group-hover:opacity-100 p-2 text-white/20 hover:text-red-500 transition-all"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default TaskManager;