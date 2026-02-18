import React from 'react';
import { RotateCcw, Box, Diamond, Grid } from 'lucide-react';
import { BarChart, Bar, ResponsiveContainer, Cell } from 'recharts';

const HistoryScreen: React.FC = () => {
    // Dummy Data
    const chartData = [
        { name: '1-5', value: 5, color: '#334155' },
        { name: '6-10', value: 12, color: '#10b981' }, // Slightly different green
        { name: '11-15', value: 8, color: '#334155' },
        { name: '16-19', value: 20, color: '#13ec80' },
        { name: '20', value: 4, color: '#13ec80' },
    ];

    const rolls = [
        { id: 1, type: 'Critical Hit!', subtitle: '1d20 Check (Stealth)', value: 20, time: 'Just now', icon: 'd20', isCrit: true },
        { id: 2, type: 'Damage Roll', subtitle: '2d6 3 + 5', value: 8, time: '2m ago', icon: 'd6', isCrit: false },
        { id: 3, type: 'Advantage Check', subtitle: '2d20 15, 4', value: 15, time: '5m ago', icon: 'd20', isCrit: false },
        { id: 4, type: 'Skill Check', subtitle: '1d20 Nat 2', value: 2, time: '12m ago', icon: 'd20', isFail: true },
        { id: 5, type: 'Fireball', subtitle: '8d6 Sum of 8', value: 28, time: '25m ago', icon: 'd6', isCrit: false },
    ];

    return (
        <div className="flex flex-col h-full bg-background-dark overflow-hidden">
            {/* Header */}
            <header className="flex items-center justify-between px-5 pt-12 pb-4 shrink-0 bg-background-dark z-20">
                <h1 className="text-2xl font-bold tracking-tight text-white">Roll History</h1>
                <button className="flex items-center gap-1 text-sm font-medium text-slate-400 hover:text-primary transition-colors">
                    <RotateCcw size={16} />
                    Reset Stats
                </button>
            </header>

            <div className="flex-1 overflow-y-auto no-scrollbar px-5 pb-6">
                {/* Stats Section */}
                <section className="mb-8">
                    <div className="flex items-end justify-between mb-4">
                        <h2 className="text-lg font-semibold text-slate-200">Session Stats</h2>
                        <div className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
                            Total Rolls: <span className="font-bold">42</span>
                        </div>
                    </div>
                    
                    {/* Filters */}
                    <div className="flex p-1 bg-surface-dark rounded-xl mb-6 border border-white/5">
                        <button className="flex-1 py-2 text-xs font-semibold rounded-lg bg-[#2A4034] text-white shadow-sm transition-all">All</button>
                        <button className="flex-1 py-2 text-xs font-medium rounded-lg text-slate-400 hover:text-white transition-all">d20</button>
                        <button className="flex-1 py-2 text-xs font-medium rounded-lg text-slate-400 hover:text-white transition-all">d10</button>
                        <button className="flex-1 py-2 text-xs font-medium rounded-lg text-slate-400 hover:text-white transition-all">d6</button>
                    </div>

                    {/* Chart */}
                    <div className="bg-surface-dark rounded-2xl p-5 shadow-sm border border-white/5 h-48 relative">
                        <div className="absolute inset-0 px-5 py-5 flex flex-col justify-between opacity-10 pointer-events-none">
                            <div className="w-full h-px bg-slate-400"></div>
                            <div className="w-full h-px bg-slate-400"></div>
                            <div className="w-full h-px bg-slate-400"></div>
                            <div className="w-full h-px bg-slate-400"></div>
                        </div>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                    {chartData.map((entry, index) => (
                                        <Cell 
                                            key={`cell-${index}`} 
                                            fill={index === 4 ? '#13ec80' : index > 2 ? '#10b981' : '#334155'}
                                            className={index === 4 ? 'animate-pulse drop-shadow-[0_0_10px_rgba(19,236,128,0.4)]' : ''}
                                        />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                        <div className="flex justify-between mt-2 px-2">
                             {chartData.map((d, i) => (
                                 <span key={i} className="text-[10px] text-slate-400 font-medium">{d.name}</span>
                             ))}
                        </div>
                    </div>
                </section>

                {/* List Section */}
                <section>
                    <div className="flex items-center justify-between mb-4 sticky top-0 bg-background-dark py-2 z-10">
                        <h2 className="text-lg font-semibold text-slate-200">Recent Rolls</h2>
                        <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Today</span>
                    </div>

                    <div className="flex flex-col gap-3">
                        {rolls.map((roll) => (
                            <div 
                                key={roll.id} 
                                className={`flex items-center gap-4 bg-surface-dark p-4 rounded-xl border transition-colors group ${
                                    roll.isCrit ? 'border-primary/20 shadow-[0_4px_20px_-10px_rgba(19,236,128,0.15)]' : 'border-transparent hover:border-white/10'
                                }`}
                            >
                                {roll.isCrit && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-l-xl"></div>}
                                
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${roll.isFail ? 'bg-red-500/10' : 'bg-white/5'}`}>
                                    {roll.icon === 'd20' ? <Diamond size={24} className={roll.isFail ? 'text-red-400' : 'text-slate-300'} /> : <Grid size={24} className="text-slate-300" />}
                                </div>
                                
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-baseline gap-2">
                                        <h3 className="text-white font-bold text-base truncate">{roll.type}</h3>
                                        {roll.isCrit && <span className="text-xs text-primary font-medium">Natural 20</span>}
                                    </div>
                                    <div className="text-xs text-slate-400 mt-1 truncate">{roll.subtitle}</div>
                                </div>

                                <div className="flex flex-col items-end gap-1">
                                    <span className={`text-2xl font-bold tabular-nums ${roll.isCrit ? 'text-primary' : roll.isFail ? 'text-red-400' : 'text-white'}`}>
                                        {roll.value}
                                    </span>
                                    <span className="text-[10px] text-slate-500">{roll.time}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default HistoryScreen;