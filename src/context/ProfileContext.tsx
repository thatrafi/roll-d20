import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DiceSkin } from '../types';

export interface DiceProfile {
  id: string;
  name: string;
  skins: DiceSkin[];
  color: string;
}

interface ProfileContextType {
  profiles: DiceProfile[];
  currentProfile: DiceProfile | null;
  addProfile: (name: string, skins: DiceSkin[], color: string) => Promise<void>;
  updateProfile: (profile: DiceProfile) => Promise<void>;
  deleteProfile: (id: string) => Promise<void>;
  selectProfile: (id: string) => void;
  isLoading: boolean;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profiles, setProfiles] = useState<DiceProfile[]>([]);
  const [currentProfile, setCurrentProfile] = useState<DiceProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = async () => {
    try {
      const storedProfiles = await AsyncStorage.getItem('@dice_profiles');
      if (storedProfiles) {
        const parsed = JSON.parse(storedProfiles);
        setProfiles(parsed);
        // Load last selected profile
        const lastSelected = await AsyncStorage.getItem('@current_profile_id');
        if (lastSelected) {
          const profile = parsed.find((p: DiceProfile) => p.id === lastSelected);
          if (profile) setCurrentProfile(profile);
        } else if (parsed.length > 0) {
            setCurrentProfile(parsed[0]);
        }
      }
    } catch (e) {
      console.error('Failed to load profiles', e);
    } finally {
      setIsLoading(false);
    }
  };

  const saveProfiles = async (newProfiles: DiceProfile[]) => {
    try {
      await AsyncStorage.setItem('@dice_profiles', JSON.stringify(newProfiles));
    } catch (e) {
      console.error('Failed to save profiles', e);
    }
  };

  const addProfile = async (name: string, skins: DiceSkin[], color: string) => {
    const newProfile: DiceProfile = {
      id: Date.now().toString(),
      name,
      skins,
      color,
    };
    const newProfiles = [...profiles, newProfile];
    setProfiles(newProfiles);
    await saveProfiles(newProfiles);
    // Auto select
    setCurrentProfile(newProfile);
    await AsyncStorage.setItem('@current_profile_id', newProfile.id);
  };

  const updateProfile = async (updatedProfile: DiceProfile) => {
    const newProfiles = profiles.map(p => p.id === updatedProfile.id ? updatedProfile : p);
    setProfiles(newProfiles);
    await saveProfiles(newProfiles);
    if (currentProfile?.id === updatedProfile.id) {
        setCurrentProfile(updatedProfile);
    }
  };

  const deleteProfile = async (id: string) => {
    const newProfiles = profiles.filter(p => p.id !== id);
    setProfiles(newProfiles);
    await saveProfiles(newProfiles);
    if (currentProfile?.id === id) {
        setCurrentProfile(newProfiles.length > 0 ? newProfiles[0] : null);
        if (newProfiles.length > 0) {
            await AsyncStorage.setItem('@current_profile_id', newProfiles[0].id);
        } else {
            await AsyncStorage.removeItem('@current_profile_id');
        }
    }
  };

  const selectProfile = async (id: string) => {
    const profile = profiles.find(p => p.id === id);
    if (profile) {
        setCurrentProfile(profile);
        await AsyncStorage.setItem('@current_profile_id', id);
    }
  };

  return (
    <ProfileContext.Provider value={{ profiles, currentProfile, addProfile, updateProfile, deleteProfile, selectProfile, isLoading }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};
