import React, { useState } from 'react';
import { useTags } from '@/features/tags/hooks/useTags';
import { TagResponse } from '@/features/tags/types/tag.dto';
import { Trash2, Edit2, Check, X, Hash, Tag as TagIcon } from 'lucide-react';

const TagLibrary = () => {
    const { tags, updateTag, removeTag } = useTags();
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editName, setEditName] = useState('');
    const [editColor, setEditColor] = useState('');

    const handleStartEdit = (tag: TagResponse) => {
        setEditingId(tag.id);
        setEditName(tag.name);
        setEditColor(tag.color || '#e11d48');
    };

    const handleSave = async (id: string) => {
        if (editName.trim().length >= 2) {
            await updateTag(id, { name: editName.trim(), color: editColor });
        }
        setEditingId(null);
    };

    return (
        <div className="flex flex-col gap-3 mt-4 pr-2 max-h-60 overflow-y-auto custom-scrollbar">
            <p className="mb-1 font-black text-[10px] text-white/20 uppercase tracking-[0.2em]">Your Categories</p>

            {tags.map((tag) => {
                const isEditing = editingId === tag.id;

                return (
                    <div key={tag.id} className="group flex justify-between items-center bg-white/5 p-3 border border-white/5 hover:border-white/10 rounded-2xl transition-all">
                        <div className="flex flex-1 items-center gap-3">
                            {isEditing ? (
                                <div className="group/color relative">
                                    <div
                                        className="flex justify-center items-center border border-white/10 rounded-lg w-8 h-8 cursor-pointer"
                                        style={{ backgroundColor: editColor }}
                                    >
                                        <Hash size={12} className="text-black/40" />
                                        <input
                                            type="color"
                                            value={editColor}
                                            onChange={(e) => setEditColor(e.target.value)}
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div
                                    className="shadow-[0_0_8px] shadow-current rounded-full w-3 h-3"
                                    style={{ color: tag.color || '#5fbfff', backgroundColor: tag.color || '#5fbfff' }}
                                />
                            )}

                            <div className="flex-1">
                                {isEditing ? (
                                    <input
                                        autoFocus
                                        value={editName}
                                        onChange={(e) => setEditName(e.target.value)}
                                        className="bg-transparent border-[#00ffd5] border-b outline-none w-full font-bold text-white text-xs uppercase tracking-widest"
                                    />
                                ) : (
                                    <span className="font-bold text-white/70 text-xs uppercase tracking-widest">
                                        {tag.name}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-1">
                            {isEditing ? (
                                <>
                                    <button onClick={() => handleSave(tag.id)} className="hover:bg-white/5 p-1.5 rounded-lg text-[#00ffd5]">
                                        <Check size={14} />
                                    </button>
                                    <button onClick={() => setEditingId(null)} className="hover:bg-white/5 p-1.5 rounded-lg text-white/20">
                                        <X size={14} />
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button onClick={() => handleStartEdit(tag)} className="opacity-0 group-hover:opacity-100 p-1.5 text-white/10 hover:text-white transition-all">
                                        <Edit2 size={14} />
                                    </button>
                                    <button onClick={() => removeTag(tag.id)} className="opacity-0 group-hover:opacity-100 p-1.5 text-white/10 hover:text-red-500 transition-all">
                                        <Trash2 size={14} />
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default TagLibrary;