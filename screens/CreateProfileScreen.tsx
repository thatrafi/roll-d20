import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '../src/theme';
import { useProfile } from '../src/context/ProfileContext';
import { DiceSkin } from '../src/types';

const INITIAL_SKIN: DiceSkin = {
    id: '1',
    name: 'Neon Pulse',
    rarity: 'Rare',
    material: 'Gas',
    color: '#13ec80',
    isEquipped: true
};

const CreateProfileScreen = () => {
    const insets = useSafeAreaInsets();
    const { addProfile } = useProfile();
    const [name, setName] = useState('');

    const handleCreate = async () => {
        if (!name.trim()) {
            Alert.alert('Required', 'Please enter a profile name');
            return;
        }
        await addProfile(name.trim(), [INITIAL_SKIN], INITIAL_SKIN.color);
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}
        >
            <View style={styles.content}>
                <View style={styles.header}>
                    <View style={styles.logoBox}>
                        <View style={styles.logoDot} />
                    </View>
                    <Text style={styles.title}>Welcome</Text>
                    <Text style={styles.subtitle}>Create your roller profile to start</Text>
                </View>

                <View style={styles.form}>
                    <Text style={styles.label}>Profile Name</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="e.g. Dungeon Master"
                        placeholderTextColor={COLORS.textDim}
                        value={name}
                        onChangeText={setName}
                        autoCapitalize="words"
                        autoCorrect={false}
                    />

                    <TouchableOpacity
                        style={styles.button}
                        onPress={handleCreate}
                    >
                        <Text style={styles.buttonText}>Start Rolling</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.backgroundDarker,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 32,
        gap: 48,
    },
    header: {
        alignItems: 'center',
        gap: 16,
    },
    logoBox: {
        width: 64,
        height: 64,
        borderWidth: 4,
        borderColor: COLORS.primary,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
        elevation: 10,
    },
    logoDot: {
        width: 16,
        height: 16,
        backgroundColor: COLORS.white,
        borderRadius: 8,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: COLORS.white,
    },
    subtitle: {
        fontSize: 16,
        color: COLORS.textDim,
        textAlign: 'center',
    },
    form: {
        gap: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.textSlate,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    input: {
        backgroundColor: COLORS.surface,
        borderRadius: 16,
        padding: 20,
        color: COLORS.white,
        fontSize: 18,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    button: {
        backgroundColor: COLORS.primary,
        padding: 20,
        borderRadius: 16,
        alignItems: 'center',
        marginTop: 16,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    buttonText: {
        color: COLORS.backgroundDarker,
        fontSize: 18,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 1,
    }
});

export default CreateProfileScreen;
