import React, { useState, useRef, useEffect } from 'react';
import { Tag as TagIcon, ChevronDown, Check } from 'lucide-react';
import { useTags } from '@/features/tags/hooks/useTags';

interface TagSelectorProps {
    selectedTagId: string | null;
    onSelectTag: (tagId: string | null) => void;
}

const TagSelector: React.FC<TagSelectorProps> = ({ selectedTagId, onSelectTag }) => {
    const { tags } = useTags();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Encontramos el tag seleccionado para mostrar su nombre y color en el botón
    const selectedTag = tags.find(t => t.id === selectedTagId);

    // Cierra el menú si el usuario hace clic fuera del componente
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative w-full" ref={dropdownRef}>
            {/* BOTÓN PRINCIPAL (Actúa como el Select) */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="flex justify-between items-center gap-3 bg-black/40 hover:bg-black/60 px-4 py-3 border border-white/5 focus-within:border-white/10 rounded-2xl w-full transition-all group"
            >
                <div className="flex items-center gap-3">
                    <TagIcon className="text-white/20" size={14} />
                    {selectedTag ? (
                        <div className="flex items-center gap-2">
                            <div
                                className="shadow-[0_0_8px] shadow-current rounded-full w-2 h-2"
                                style={{
                                    color: selectedTag.color || '#5fbfff',
                                    backgroundColor: selectedTag.color || '#5fbfff'
                                }}
                            />
                            <span className="font-bold text-white text-xs uppercase tracking-widest">
                                {selectedTag.name}
                            </span>
                        </div>
                    ) : (
                        <span className="font-bold text-white/20 text-xs uppercase tracking-widest">
                            Select Category
                        </span>
                    )}
                </div>
                <ChevronDown
                    size={14}
                    className={`text-white/20 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>

            {/* LISTA DESPLEGABLE (Opciones) */}
            {isOpen && (
                <div className="z-50 absolute flex flex-col gap-1 bg-[#0a0a0a]/95 shadow-2xl backdrop-blur-xl mt-2 p-2 border border-white/10 rounded-2xl w-full max-h-48 overflow-y-auto custom-scrollbar">

                    {/* Opción para quitar el tag (Ninguno) */}
                    <button
                        type="button"
                        onClick={() => { onSelectTag(null); setIsOpen(false); }}
                        className="flex justify-between items-center hover:bg-white/5 px-3 py-2.5 rounded-xl transition-colors"
                    >
                        <span className="font-bold text-white/30 text-xs uppercase tracking-widest">
                            No Category
                        </span>
                        {!selectedTagId && <Check size={14} className="text-white/30" />}
                    </button>

                    {/* Mapeo de Tags del usuario */}
                    {tags.map((tag) => {
                        const isSelected = selectedTagId === tag.id;
                        return (
                            <button
                                key={tag.id}
                                type="button"
                                onClick={() => { onSelectTag(tag.id); setIsOpen(false); }}
                                className={`flex justify-between items-center px-3 py-2.5 rounded-xl transition-colors ${isSelected ? 'bg-white/10' : 'hover:bg-white/5'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div
                                        className="shadow-[0_0_8px] shadow-current rounded-full w-2 h-2"
                                        style={{
                                            color: tag.color || '#5fbfff',
                                            backgroundColor: tag.color || '#5fbfff'
                                        }}
                                    />
                                    <span className="font-bold text-white/80 text-xs uppercase tracking-widest">
                                        {tag.name}
                                    </span>
                                </div>
                                {isSelected && <Check size={14} className="text-[#00ffd5]" />}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default TagSelector;