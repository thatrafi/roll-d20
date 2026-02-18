import React, { useState } from 'react';
import { Filter, Check, SlidersHorizontal } from 'lucide-react';
import { DiceSkin } from '../types';

const INITIAL_SKINS: DiceSkin[] = [
    { id: '1', name: 'Neon Pulse', rarity: 'Rare', material: 'Gas', color: '#13ec80', isEquipped: true },
    { id: '2', name: 'Dragon Scale', rarity: 'Rare', material: 'Bone', color: '#8B0000', secondaryColor: '#3a1c1c', isEquipped: false },
    { id: '3', name: 'Classic Wood', rarity: 'Common', material: 'Oak', color: '#8b5a2b', isEquipped: false },
    { id: '4', name: 'Void Walker', rarity: 'Epic', material: 'Glass', color: '#4a148c', isEquipped: false },
    { id: '5', name: 'Cyber Mist', rarity: 'Rare', material: 'Gas', color: '#00bcd4', isEquipped: false },
    { id: '6', name: 'Molten Core', rarity: 'Legendary', material: 'Stone', color: '#ff5722', isEquipped: false },
];

const CollectionScreen: React.FC = () => {
    const [skins, setSkins] = useState<DiceSkin[]>(INITIAL_SKINS);
    const [filter, setFilter] = useState('All');

    const equippedSkin = skins.find(s => s.isEquipped);

    return (
        <div className="flex flex-col h-full bg-background-light dark:bg-background-dark overflow-hidden">
            {/* Header */}
            <header className="flex items-center justify-between px-5 pt-8 pb-4 sticky top-0 z-20 bg-background-dark/95 backdrop-blur-md border-b border-primary/10">
                <h1 className="text-2xl font-bold tracking-tight text-white">My Collection</h1>
                <button className="flex items-center justify-center w-10 h-10 rounded-full bg-surface-dark/50 hover:bg-surface-dark border border-primary/20 text-primary transition-colors">
                    <Filter size={18} />
                </button>
            </header>

            {/* Tags */}
            <div className="flex gap-3 px-5 py-2 overflow-x-auto no-scrollbar pb-4 sticky top-[73px] z-10 bg-background-dark/95 backdrop-blur-md">
                {['All', 'Favorites', 'Metal', 'Glass', 'Neon'].map((tag) => (
                    <button 
                        key={tag}
                        onClick={() => setFilter(tag)}
                        className={`flex shrink-0 items-center justify-center px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                            filter === tag 
                                ? 'bg-primary text-background-dark shadow-[0_0_10px_rgba(19,236,128,0.3)]' 
                                : 'bg-surface-dark border border-white/5 text-slate-400 hover:text-primary hover:border-primary/50'
                        }`}
                    >
                        {tag}
                    </button>
                ))}
            </div>

            {/* Grid */}
            <div className="flex-1 overflow-y-auto pb-32 px-5">
                <div className="grid grid-cols-2 gap-4 pt-2">
                    {skins.map((skin) => (
                        <div 
                            key={skin.id}
                            className={`group relative flex flex-col gap-3 p-3 rounded-2xl bg-surface-dark transition-all active:scale-95 border ${
                                skin.isEquipped 
                                    ? 'border-primary shadow-[0_0_20px_rgba(19,236,128,0.15)]' 
                                    : 'border-white/5 hover:border-primary/30'
                            }`}
                            onClick={() => {
                                setSkins(skins.map(s => ({ ...s, isEquipped: s.id === skin.id })));
                            }}
                        >
                            {skin.isEquipped && (
                                <div className="absolute top-3 right-3 z-10">
                                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-background-dark shadow-sm">
                                        <Check size={14} strokeWidth={3} />
                                    </span>
                                </div>
                            )}

                            {/* Dice Visual Placeholder */}
                            <div className="w-full aspect-square rounded-xl relative overflow-hidden flex items-center justify-center" style={{ backgroundColor: skin.secondaryColor || '#000' }}>
                                {/* Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-black/60"></div>
                                
                                {/* The 'Dice' */}
                                <div 
                                    className="w-2/3 h-2/3 rounded-lg border flex items-center justify-center transform group-hover:rotate-[25deg] transition-all duration-500 shadow-lg"
                                    style={{ 
                                        backgroundColor: skin.color, 
                                        borderColor: 'rgba(255,255,255,0.2)',
                                        boxShadow: skin.material === 'Gas' ? `0 0 15px ${skin.color}60` : 'none'
                                    }}
                                >
                                    {/* Pip */}
                                    <div className="w-3 h-3 rounded-full bg-white/80 shadow-sm"></div>
                                </div>
                            </div>

                            <div>
                                <p className="text-white text-base font-bold leading-tight">{skin.name}</p>
                                {skin.isEquipped ? (
                                    <p className="text-primary text-xs font-medium uppercase tracking-wider mt-1">Equipped</p>
                                ) : (
                                    <p className="text-slate-400 text-xs font-medium mt-1">{skin.rarity} • {skin.material}</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Customize Panel Floating */}
            <div className="absolute bottom-4 left-0 right-0 p-4 z-20">
                <div className="bg-[#1c2e24]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl shadow-black/50">
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex flex-col">
                            <span className="text-xs font-medium text-primary uppercase tracking-wider mb-1">Selected: {equippedSkin?.name}</span>
                            <h3 className="text-white text-lg font-bold">Customize Dice</h3>
                        </div>
                        <button className="bg-primary hover:bg-primary/90 text-background-dark font-bold text-sm px-5 py-2.5 rounded-xl transition-all active:scale-95 shadow-[0_0_15px_rgba(19,236,128,0.25)] flex items-center gap-2">
                            <SlidersHorizontal size={18} />
                            Open
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CollectionScreen;