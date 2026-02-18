import React, { useState } from 'react';
import { Smartphone, Volume2, Globe, Disc, RotateCcw } from 'lucide-react';

const Toggle: React.FC<{ label: string; subLabel: string; icon: React.ReactNode; checked: boolean; onChange: () => void }> = ({ label, subLabel, icon, checked, onChange }) => (
    <div className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors cursor-pointer" onClick={onChange}>
        <div className="flex items-center gap-4">
            <div className="flex items-center justify-center rounded-lg bg-surface-highlight text-primary size-10 shrink-0">
                {icon}
            </div>
            <div className="flex flex-col">
                <span className="text-base font-medium text-white">{label}</span>
                <span className="text-xs text-gray-400">{subLabel}</span>
            </div>
        </div>
        <div className={`relative flex h-[30px] w-[50px] items-center rounded-full p-0.5 transition-colors duration-200 ${checked ? 'bg-primary justify-end' : 'bg-surface-highlight justify-start'}`}>
            <div className="h-[26px] w-[26px] rounded-full bg-white shadow-sm transition-all" />
        </div>
    </div>
);

const SettingsScreen: React.FC = () => {
    const [haptics, setHaptics] = useState(true);
    const [sound, setSound] = useState(true);
    const [shake, setShake] = useState(false);
    const [gravity, setGravity] = useState(50);
    const [bounce, setBounce] = useState(65);

    return (
        <div className="flex-1 flex flex-col h-full bg-[#111814] relative z-10">
             {/* Main Modal Look */}
             <div className="flex-1 flex flex-col bg-[#111814] rounded-t-2xl shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.5)] border-t border-white/10 mt-12">
                 {/* Drag Handle */}
                <div className="w-full flex justify-center pt-3 pb-1">
                    <div className="w-12 h-1.5 bg-white/20 rounded-full"></div>
                </div>

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
                    <div className="w-12"></div>
                    <h2 className="text-xl font-bold tracking-tight text-center text-white">Dice Configuration</h2>
                    <button className="w-12 flex items-center justify-end text-primary font-semibold hover:text-primary/80 transition-colors">
                        Done
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8">
                    {/* General Section */}
                    <section>
                        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4 px-1">General</h3>
                        <div className="flex flex-col gap-1 bg-surface-dark rounded-xl overflow-hidden border border-white/5">
                            <Toggle 
                                label="Haptic Feedback" 
                                subLabel="Feel collisions and rolls" 
                                icon={<Smartphone size={24} />} 
                                checked={haptics} 
                                onChange={() => setHaptics(!haptics)} 
                            />
                            <div className="h-px bg-white/5 mx-4"></div>
                            <Toggle 
                                label="Sound Effects" 
                                subLabel="Rolling clatter sounds" 
                                icon={<Volume2 size={24} />} 
                                checked={sound} 
                                onChange={() => setSound(!sound)} 
                            />
                            <div className="h-px bg-white/5 mx-4"></div>
                            <Toggle 
                                label="Shake to Roll" 
                                subLabel="Use accelerometer" 
                                icon={<Smartphone size={24} />} 
                                checked={shake} 
                                onChange={() => setShake(!shake)} 
                            />
                        </div>
                    </section>

                    {/* Physics Section */}
                    <section>
                        <div className="flex items-center justify-between mb-4 px-1">
                            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Physics</h3>
                            <span className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-full font-medium">Experimental</span>
                        </div>
                        <div className="bg-surface-dark rounded-xl p-5 border border-white/5 space-y-6">
                            {/* Gravity */}
                            <div>
                                <div className="flex justify-between items-end mb-2">
                                    <label className="text-base font-medium text-white flex items-center gap-2">
                                        <Globe size={20} className="text-gray-400" />
                                        Gravity
                                    </label>
                                    <span className="text-primary font-bold font-mono">{(gravity/50).toFixed(1)}x</span>
                                </div>
                                <div className="relative w-full h-8 flex items-center">
                                    <input 
                                        type="range" 
                                        min="0" 
                                        max="100" 
                                        value={gravity}
                                        onChange={(e) => setGravity(parseInt(e.target.value))}
                                        className="relative z-10 w-full cursor-pointer h-1"
                                        style={{
                                            background: `linear-gradient(to right, #13ec80 0%, #13ec80 ${gravity}%, #283930 ${gravity}%, #283930 100%)`,
                                            borderRadius: '2px'
                                        }}
                                    />
                                    {/* Custom Thumb handled via CSS in index.html, but inline styles for track gradient work well */}
                                </div>
                                <div className="flex justify-between text-xs text-gray-500 mt-1 font-medium">
                                    <span>Moon</span>
                                    <span>Jupiter</span>
                                </div>
                            </div>

                            {/* Bounce */}
                            <div>
                                <div className="flex justify-between items-end mb-2">
                                    <label className="text-base font-medium text-white flex items-center gap-2">
                                        <Disc size={20} className="text-gray-400" />
                                        Bounce Intensity
                                    </label>
                                    <span className="text-primary font-bold font-mono">{(bounce/100).toFixed(2)}</span>
                                </div>
                                <div className="relative w-full h-8 flex items-center">
                                    <input 
                                        type="range" 
                                        min="0" 
                                        max="100" 
                                        value={bounce}
                                        onChange={(e) => setBounce(parseInt(e.target.value))}
                                        className="relative z-10 w-full cursor-pointer h-1"
                                        style={{
                                            background: `linear-gradient(to right, #13ec80 0%, #13ec80 ${bounce}%, #283930 ${bounce}%, #283930 100%)`,
                                            borderRadius: '2px'
                                        }}
                                    />
                                </div>
                                <div className="flex justify-between text-xs text-gray-500 mt-1 font-medium">
                                    <span>Dull</span>
                                    <span>Super Bouncy</span>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Footer */}
                <div className="px-6 py-6 border-t border-white/5 bg-[#111814]/50 backdrop-blur-md pb-10">
                    <button 
                        className="w-full py-3.5 px-4 bg-surface-highlight hover:bg-surface-highlight/80 text-gray-300 font-medium rounded-xl transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2 group"
                        onClick={() => {
                            setHaptics(true);
                            setSound(true);
                            setShake(false);
                            setGravity(50);
                            setBounce(65);
                        }}
                    >
                        <RotateCcw size={20} className="group-hover:-rotate-180 transition-transform duration-500" />
                        Reset to Defaults
                    </button>
                </div>
             </div>
        </div>
    );
};

export default SettingsScreen;