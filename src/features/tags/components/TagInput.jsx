import React, { useState, useRef, useEffect } from 'react';
import { Tag as TagIcon, Hash, Check } from 'lucide-react';

const COLORS = ['#ef4444', '#f97316', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#a3a3a3'];

const TagInput = ({ tagName, setTagName, tagColor, setTagColor }) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="flex gap-3" ref={containerRef}>
            <div className="group relative flex flex-1 items-center bg-black/40 px-4 py-3 border border-white/5 focus-within:border-white/10 rounded-2xl transition-all">
                <TagIcon className="mr-3 text-white/20" size={14} />
                <input
                    type="text"
                    value={tagName}
                    onChange={(e) => setTagName(e.target.value)}
                    placeholder="Tag name"
                    className="bg-transparent outline-none w-full font-black text-white placeholder:text-white/20 text-xs uppercase tracking-widest"
                />
            </div>

            <div className="relative">
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex justify-center items-center shadow-black/50 shadow-lg border-2 border-white/10 rounded-xl w-11 h-11 hover:scale-105 transition-transform cursor-pointer"
                    style={{ backgroundColor: tagColor }}
                >
                    <Hash size={16} className="text-black/60" />
                </button>

                {isOpen && (
                    <div className="absolute right-0 top-14 z-[100] p-3 bg-[#1a1a1a]/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl w-40">
                        <div className="grid grid-cols-4 gap-2">
                            {COLORS.map((c) => (
                                <button
                                    key={c}
                                    type="button"
                                    onClick={() => { setTagColor(c); setIsOpen(false); }}
                                    className="relative w-7 h-7 rounded-lg hover:scale-110 transition-transform flex items-center justify-center"
                                    style={{ backgroundColor: c }}
                                >
                                    {tagColor === c && <Check size={14} className="text-white" strokeWidth={3} />}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TagInput;