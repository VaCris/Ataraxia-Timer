import React from 'react'
import { Tag as TagIcon, Hash } from 'lucide-react'
import { useTags } from '@/features/tags/hooks/useTags'

const TagInput = ({ tagName, setTagName, tagColor, setTagColor }) => {
    const { tags } = useTags()

    return (
        <div className="flex gap-3">
            <div className="group relative flex flex-1 items-center bg-black/40 px-4 py-3 border border-white/5 focus-within:border-white/10 rounded-2xl transition-all">
                <TagIcon className="mr-3 text-white/20" size={14} />
                <input
                    type="text"
                    value={tagName}
                    onChange={(e) => setTagName(e.target.value)}
                    placeholder="Tag"
                    className="bg-transparent outline-none w-full font-black text-white placeholder:text-white/20 text-xs uppercase tracking-widest"
                />
            </div>

            <div className="group relative">
                <div
                    className="flex justify-center items-center shadow-black/50 shadow-lg border-2 border-white/10 rounded-xl w-10 h-10 group-hover:scale-105 transition-transform cursor-pointer"
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
    )
}

export default TagInput