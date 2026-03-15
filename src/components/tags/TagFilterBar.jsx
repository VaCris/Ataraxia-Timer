import React from 'react';
import { motion } from 'framer-motion';
import { LayoutGrid } from 'lucide-react';
import { useTags } from '@hooks/useTags';

const TagFilterBar = ({ selectedTagId, onSelectTag }) => {
    const { tags } = useTags();

    return (
        <div className="mb-8 w-full">
            <div className="flex items-center gap-3 pb-4 overflow-x-auto no-scrollbar">
                {/* Botón "All" para limpiar filtros */}
                <button
                    onClick={() => onSelectTag(null)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-2xl border transition-all whitespace-nowrap text-[10px] font-black uppercase tracking-[0.2em] relative ${selectedTagId === null
                            ? 'bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.2)]'
                            : 'bg-white/5 text-white/30 border-white/5 hover:border-white/10'
                        }`}
                >
                    <LayoutGrid size={14} strokeWidth={3} />
                    All Focus
                </button>

                {/* Separador sutil */}
                <div className="bg-white/5 mx-1 w-[1px] h-8 shrink-0" />

                {/* Tags dinámicos del usuario */}
                {tags.map((tag) => (
                    <button
                        key={tag.id}
                        onClick={() => onSelectTag(tag.id === selectedTagId ? null : tag.id)}
                        className={`group relative flex items-center gap-3 px-6 py-3 rounded-2xl border transition-all whitespace-nowrap text-[10px] font-black uppercase tracking-[0.2em] ${selectedTagId === tag.id
                                ? 'bg-white text-black border-white shadow-glow'
                                : 'bg-white/5 text-white/30 border-white/5 hover:border-white/20'
                            }`}
                    >
                        {/* Círculo de Color dinámico */}
                        <div
                            className={`w-2 h-2 rounded-full transition-all duration-500 ${selectedTagId === tag.id ? 'scale-125' : 'opacity-40 group-hover:opacity-100'}`}
                            style={{
                                backgroundColor: tag.color,
                                boxShadow: selectedTagId === tag.id ? `0 0 12px ${tag.color}` : 'none'
                            }}
                        />

                        <span className="z-10 relative">{tag.name}</span>

                        {/* Efecto de viaje entre botones (Framer Motion) */}
                        {selectedTagId === tag.id && (
                            <motion.div
                                layoutId="activeFilter"
                                className="absolute inset-0 border-2 border-white rounded-2xl"
                                transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                            />
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default TagFilterBar;