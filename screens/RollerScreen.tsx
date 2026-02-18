import React, { useState, useEffect } from 'react';
import { History, Trash2, RotateCcw, Settings } from 'lucide-react';

const DiceD20: React.FC<{ value: number; rolling: boolean }> = ({ value, rolling }) => {
    return (
        <div className={`relative w-24 h-24 transition-all duration-700 ${rolling ? 'animate-bounce rotate-[360deg]' : 'rotate-12'}`}>
            <div className="absolute inset-0 bg-gradient-to-br from-slate-700 to-slate-900 rounded-xl flex items-center justify-center shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/5 rotate-45 transform transition-transform">
                <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent rounded-xl pointer-events-none"></div>
                <span className={`text-primary font-bold text-3xl -rotate-45 drop-shadow-[0_0_8px_rgba(19,236,128,0.8)] ${rolling ? 'blur-sm' : ''}`}>
                    {rolling ? '...' : value}
                </span>
            </div>
        </div>
    );
};

const DiceD6: React.FC<{ rolling: boolean }> = ({ rolling }) => {
    // A simplified visual D6
    return (
        <div className={`relative w-20 h-20 transition-all duration-700 ${rolling ? 'animate-pulse rotate-[-180deg]' : '-rotate-6'}`}>
            <div className="w-full h-full bg-gradient-to-br from-slate-800 to-black rounded-lg flex items-center justify-center shadow-[0_20px_40px_rgba(0,0,0,0.6)] border border-white/5">
                <div className="grid grid-cols-2 gap-3 p-4">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="w-3 h-3 rounded-full bg-primary shadow-[0_0_8px_rgba(19,236,128,0.8)]"></div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const RollerScreen: React.FC = () => {
    const [result, setResult] = useState(26);
    const [isRolling, setIsRolling] = useState(false);
    const [diceList, setDiceList] = useState<string[]>(['d20', 'd6']);

    const handleRoll = () => {
        setIsRolling(true);
        // Simulate roll delay
        setTimeout(() => {
            const newTotal = Math.floor(Math.random() * 20) + 1 + Math.floor(Math.random() * 6) + 1;
            setResult(newTotal);
            setIsRolling(false);
        }, 800);
    };

    return (
        <div className="flex-1 flex flex-col h-full bg-background-dark relative overflow-hidden">
            {/* Header */}
            <header className="flex items-center justify-between px-6 pt-12 pb-4 z-20 absolute top-0 left-0 right-0 bg-gradient-to-b from-black/80 to-transparent">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 border-2 border-white/80 rounded-sm flex items-center justify-center">
                        <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                    </div>
                    <span className="text-sm font-semibold tracking-wide text-white/80 uppercase">Tabletop Roller</span>
                </div>
                <button className="p-2 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 transition-colors">
                    <Settings size={20} className="text-white" />
                </button>
            </header>

            {/* 3D Tray Viewport */}
            <div className="flex-1 w-full relative overflow-hidden flex items-center justify-center group bg-[#0f1612]">
                {/* Felt Texture Pattern (Simulated) */}
                <div className="absolute inset-0 opacity-40" style={{
                    backgroundImage: `radial-gradient(#18231d 15%, transparent 16%), radial-gradient(#18231d 15%, transparent 16%)`,
                    backgroundSize: '4px 4px',
                    backgroundColor: '#0f1612'
                }}></div>
                
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-background-dark pointer-events-none z-10"></div>

                {/* Dice Area */}
                <div className="relative z-0 w-full h-full flex items-center justify-center">
                    <div className="absolute top-1/3 left-1/4">
                        <DiceD20 value={Math.min(result, 20)} rolling={isRolling} />
                    </div>
                    <div className="absolute bottom-1/3 right-1/4">
                        <DiceD6 rolling={isRolling} />
                    </div>
                    
                    {/* Big Background Number */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 opacity-5 scale-150 pointer-events-none">
                        <span className="text-[12rem] font-black text-white select-none">{result}</span>
                    </div>

                    <div className="absolute top-24 w-full text-center z-10">
                        <p className="text-white/40 text-xs tracking-[0.2em] uppercase animate-pulse">Shake device to roll</p>
                    </div>
                </div>
            </div>

            {/* Controls Section */}
            <div className="bg-background-dark border-t border-white/5 rounded-t-[2rem] shadow-[0_-10px_40px_rgba(0,0,0,0.5)] relative z-30 -mt-6 pb-4">
                {/* Handle */}
                <div className="w-full flex justify-center pt-3 pb-1">
                    <div className="w-12 h-1.5 bg-white/10 rounded-full"></div>
                </div>

                {/* Result Display */}
                <div className="px-6 py-4 flex items-end justify-between">
                    <div>
                        <span className="text-white/50 text-sm font-medium uppercase tracking-wide">Result</span>
                        <div className="flex items-baseline gap-2">
                            <h2 className="text-5xl font-bold text-white tracking-tight">{result}</h2>
                            {result >= 20 && (
                                <span className="text-primary text-lg font-medium drop-shadow-[0_0_8px_rgba(19,236,128,0.5)] animate-pulse">
                                    CRITICAL!
                                </span>
                            )}
                        </div>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition text-white/70 text-sm font-medium border border-white/5">
                        <History size={18} />
                        History
                    </button>
                </div>

                {/* Dice Selector */}
                <div className="mt-2 pl-6">
                    <p className="text-xs text-white/40 font-medium mb-3 uppercase tracking-wider">Add Dice</p>
                    <div className="flex gap-3 overflow-x-auto no-scrollbar pr-6 pb-2">
                        {['D4', 'D6', 'D8', 'D10', 'D12'].map((d) => (
                            <button key={d} className="flex-shrink-0 w-16 h-20 rounded-xl bg-[#1c2721] border border-white/5 flex flex-col items-center justify-center gap-1 hover:border-primary/50 hover:bg-[#25332b] transition-all group">
                                <span className="text-white/60 text-lg font-bold group-hover:text-primary">{d}</span>
                            </button>
                        ))}
                        {/* Selected D20 */}
                        <button className="flex-shrink-0 w-16 h-20 rounded-xl bg-primary/20 border border-primary/50 flex flex-col items-center justify-center gap-1 transition-all group relative overflow-hidden shadow-[0_0_15px_rgba(19,236,128,0.15)]">
                            <div className="absolute inset-0 bg-primary/10 blur-xl"></div>
                            <span className="text-primary font-bold text-lg relative z-10">D20</span>
                        </button>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="px-6 mt-6 flex gap-3">
                    <button 
                        className="h-14 w-14 flex items-center justify-center rounded-xl bg-[#1c2721] text-white hover:bg-[#2a3830] transition-colors border border-white/5"
                        onClick={() => setDiceList([])}
                    >
                        <Trash2 size={24} />
                    </button>
                    <button 
                        onClick={handleRoll}
                        disabled={isRolling}
                        className="flex-1 h-14 bg-primary hover:bg-[#10d673] text-background-dark rounded-xl font-bold text-lg tracking-wide uppercase shadow-[0_0_20px_rgba(19,236,128,0.4)] hover:shadow-[0_0_30px_rgba(19,236,128,0.6)] transition-all flex items-center justify-center gap-2 group active:scale-[0.98]"
                    >
                        <RotateCcw size={24} className={`group-hover:rotate-180 transition-transform duration-500 ${isRolling ? 'animate-spin' : ''}`} />
                        {isRolling ? 'Rolling...' : 'Roll Dice'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RollerScreen;