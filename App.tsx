import React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Dices, Folder, History, Settings } from 'lucide-react-native';
import { ProfileProvider, useProfile } from './src/context/ProfileContext';
import { SettingsProvider } from './src/context/SettingsContext';

import RollerScreen from './screens/RollerScreen';
import CollectionScreen from './screens/CollectionScreen';
import HistoryScreen from './screens/HistoryScreen';
import SettingsScreen from './screens/SettingsScreen';
import CreateProfileScreen from './screens/CreateProfileScreen';

const Tab = createBottomTabNavigator();

const AppContent = () => {
    const { profiles, isLoading } = useProfile();

    if (isLoading) {
        return <View style={{ flex: 1, backgroundColor: '#111814' }} />;
    }

    if (profiles.length === 0) {
        return <CreateProfileScreen />;
    }

    return (
        <Tab.Navigator
              screenOptions={{
            headerShown: false,
            tabBarStyle: {
              backgroundColor: '#111814',
              borderTopColor: 'rgba(255,255,255,0.1)',
              height: 60,
              paddingBottom: 8,
              paddingTop: 8,
            },
            tabBarActiveTintColor: '#13ec80',
            tabBarInactiveTintColor: '#64748b',
            tabBarLabelStyle: {
              fontSize: 12,
              fontWeight: '600',
            },
          }}
        >
          <Tab.Screen
            name="Roller"
            component={RollerScreen}
            options={{
              tabBarIcon: ({ color, size }) => <Dices color={color} size={size} />,
            }}
          />
          <Tab.Screen
            name="Collection"
            component={CollectionScreen}
            options={{
              tabBarIcon: ({ color, size }) => <Folder color={color} size={size} />,
            }}
          />
          <Tab.Screen
            name="History"
            component={HistoryScreen}
            options={{
              tabBarIcon: ({ color, size }) => <History color={color} size={size} />,
            }}
          />
              <Tab.Screen
                name="Settings"
                component={SettingsScreen}
                options={{
                  tabBarIcon: ({ color, size }) => <Settings color={color} size={size} />,
                }}
              />
            </Tab.Navigator>
    );
};

export default function App() {
  return (
    <SafeAreaProvider>
      <SettingsProvider>
        <ProfileProvider>
          <StatusBar style="light" />
          <NavigationContainer>
             <AppContent />
          </NavigationContainer>
        </ProfileProvider>
      </SettingsProvider>
    </SafeAreaProvider>
  );
}
