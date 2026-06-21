import React from 'react';
import { ChevronLeft } from 'lucide-react';

const ComingSoon = ({ onBack, type, customImage }) => {
    const content = {
        games: { title: 'Games Module', desc: 'Interactive focus tools and scheduled micro-breaks.' },
        stats: { title: 'Advanced Insights', desc: 'Analytical logs and productivity diagnostics.' },
        achievements: { title: 'Achievements', desc: 'Performance milestones and accomplishments.' },
        default: { title: 'New Module', desc: 'Feature preparation is currently in progress.' }
    };

    const { title, desc } = content[type] || content.default;

    return (
        <div className="flex flex-col justify-center items-center bg-[#0a0a0a] w-screen min-h-screen p-8 md:p-16 text-white font-sans relative">
            {onBack && (
                <button 
                    onClick={onBack} 
                    className="absolute top-8 left-8 flex items-center gap-1.5 text-[10px] text-white/40 hover:text-white uppercase tracking-widest transition-all cursor-pointer"
                >
                    <ChevronLeft size={12} /> Back
                </button>
            )}

            <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-20 max-w-5xl w-full">
                {/* Left: Text */}
                <div className="flex flex-col text-left max-w-md w-full">
                    <h1 className="font-display font-black text-4xl md:text-5xl tracking-tight uppercase mb-4 leading-none">
                        {title} <br />
                        <span className="text-white/40">In Development</span>
                    </h1>
                    <p className="text-white/60 text-xs md:text-sm font-light leading-relaxed">
                        {desc}
                    </p>
                </div>

                {/* Right: Image */}
                <div className="w-full max-w-md aspect-video rounded-lg overflow-hidden bg-white/[0.02] flex items-center justify-center relative">
                    {customImage ? (
                        <img 
                            src={customImage} 
                            alt={title} 
                            className="object-cover w-full h-full" 
                        />
                    ) : (
                        <div className="text-white/20 font-mono text-[10px] tracking-widest uppercase">
                            Feature Preview
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ComingSoon;