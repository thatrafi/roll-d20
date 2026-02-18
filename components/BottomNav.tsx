import React from 'react';
import { Dices, Grid, History, Settings } from 'lucide-react';
import { Tab } from '../types';

interface BottomNavProps {
    currentTab: Tab;
    onTabChange: (tab: Tab) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onTabChange }) => {
    const navItems = [
        { tab: Tab.ROLLER, label: 'Roll', icon: Dices },
        { tab: Tab.HISTORY, label: 'Log', icon: History },
        { tab: Tab.COLLECTION, label: 'Skins', icon: Grid },
        { tab: Tab.SETTINGS, label: 'Settings', icon: Settings },
    ];

    return (
        <nav className="shrink-0 bg-[#0f1612] border-t border-[#283930] px-6 pb-6 pt-3 z-50">
            <div className="flex justify-between items-center max-w-md mx-auto">
                {navItems.map((item) => {
                    const isActive = currentTab === item.tab;
                    const Icon = item.icon;
                    
                    return (
                        <button
                            key={item.tab}
                            onClick={() => onTabChange(item.tab)}
                            className={`flex flex-col items-center justify-center gap-1 transition-all duration-300 group w-16 ${
                                isActive ? 'text-primary' : 'text-[#9db9ab] hover:text-white'
                            }`}
                        >
                            <div className={`p-1 rounded-full transition-transform ${isActive ? 'scale-110' : 'group-hover:scale-105'}`}>
                                <Icon 
                                    size={24} 
                                    className={isActive ? "fill-current opacity-20 absolute" : "hidden"} 
                                />
                                <Icon 
                                    size={24} 
                                    strokeWidth={isActive ? 2.5 : 2}
                                />
                            </div>
                            <span className="text-[10px] font-medium tracking-wide">
                                {item.label}
                            </span>
                        </button>
                    );
                })}
            </div>
        </nav>
    );
};

export default BottomNav;