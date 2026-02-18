import React, { useState } from 'react';
import { Tab } from './types';
import RollerScreen from './screens/RollerScreen';
import CollectionScreen from './screens/CollectionScreen';
import HistoryScreen from './screens/HistoryScreen';
import SettingsScreen from './screens/SettingsScreen';
import BottomNav from './components/BottomNav';

const App: React.FC = () => {
    const [currentTab, setCurrentTab] = useState<Tab>(Tab.ROLLER);

    const renderScreen = () => {
        switch (currentTab) {
            case Tab.ROLLER:
                return <RollerScreen />;
            case Tab.COLLECTION:
                return <CollectionScreen />;
            case Tab.HISTORY:
                return <HistoryScreen />;
            case Tab.SETTINGS:
                return <SettingsScreen />;
            default:
                return <RollerScreen />;
        }
    };

    return (
        <div className="flex flex-col h-[100dvh] bg-background-dark text-white overflow-hidden relative">
            <main className="flex-1 relative overflow-hidden flex flex-col">
                {renderScreen()}
            </main>
            <BottomNav currentTab={currentTab} onTabChange={setCurrentTab} />
        </div>
    );
};

export default App;