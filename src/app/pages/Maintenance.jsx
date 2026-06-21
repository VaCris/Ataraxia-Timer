import React from 'react';

const Maintenance = ({ customImage }) => {
    return (
        <div className="flex flex-col justify-center items-center bg-[#0a0a0a] w-screen min-h-screen p-8 md:p-16 text-white font-sans">
            <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-20 max-w-5xl w-full">
                {/* Left: Text */}
                <div className="flex flex-col text-left max-w-md w-full">
                    <h1 className="font-display font-black text-4xl md:text-5xl tracking-tight uppercase mb-4 leading-none">
                        Under <br />
                        <span className="text-white/40">Maintenance</span>
                    </h1>
                    <p className="text-white/60 text-xs md:text-sm font-light leading-relaxed">
                        Ataraxia is currently undergoing upgrades. We will be back online shortly. Thank you for your patience.
                    </p>
                </div>

                {/* Right: Image */}
                <div className="w-full max-w-md aspect-video rounded-lg overflow-hidden bg-white/[0.02] flex items-center justify-center relative">
                    {customImage ? (
                        <img 
                            src={customImage} 
                            alt="Maintenance" 
                            className="object-cover w-full h-full" 
                        />
                    ) : (
                        <div className="text-white/20 font-mono text-[10px] tracking-widest uppercase">
                            Maintenance Graphic
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Maintenance;