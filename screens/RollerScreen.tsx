import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions, LayoutAnimation, Platform, UIManager } from 'react-native';
import { History, Trash2, RotateCcw, Settings } from 'lucide-react-native';
import { Accelerometer } from 'expo-sensors';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '../src/theme';
import { useSettings } from '../src/context/SettingsContext';
import Dice from '../src/components/Dice';

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

interface ActiveDie {
    id: string;
    type: 'd4' | 'd6' | 'd8' | 'd10' | 'd12' | 'd20' | 'd100';
    value: number;
    rolling: boolean;
}

const RollerScreen = ({ navigation }: any) => {
    const insets = useSafeAreaInsets();
    const { settings } = useSettings();
    const [dice, setDice] = useState<ActiveDie[]>([
        { id: '1', type: 'd20', value: 20, rolling: false },
        { id: '2', type: 'd6', value: 6, rolling: false }
    ]);
    const [isRolling, setIsRolling] = useState(false);

    // Calculate total result
    const totalResult = dice.reduce((acc, die) => acc + die.value, 0);

    useEffect(() => {
        if (!settings.shakeToRoll) return;
        const subscription = Accelerometer.addListener(data => {
            const totalForce = Math.abs(data.x) + Math.abs(data.y) + Math.abs(data.z);
            if (totalForce > 2.5 && !isRolling) {
                 handleRoll();
            }
        });
        Accelerometer.setUpdateInterval(100);
        return () => subscription && subscription.remove();
    }, [settings.shakeToRoll, isRolling, dice]);

    const addDie = (type: ActiveDie['type']) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setDice([...dice, {
            id: Date.now().toString() + Math.random().toString(),
            type,
            value: parseInt(type.substring(1)), // Default to max value
            rolling: false
        }]);
    };

    const removeDie = (id: string) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setDice(dice.filter(d => d.id !== id));
    };

    const clearDice = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setDice([]);
    };

    const rollDieValue = (type: string) => {
        const max = parseInt(type.substring(1));
        return Math.floor(Math.random() * max) + 1;
    };

    const handleRoll = () => {
        if (isRolling || dice.length === 0) return;
        setIsRolling(true);
        if (settings.haptics) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

        // Set visual rolling state
        setDice(prev => prev.map(d => ({ ...d, rolling: true })));

        setTimeout(() => {
            setDice(prev => prev.map(d => ({
                ...d,
                value: rollDieValue(d.type),
                rolling: false
            })));
            setIsRolling(false);
            if (settings.haptics) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }, 800);
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerTitleContainer}>
                    <View style={styles.logoBox}>
                        <View style={styles.logoDot} />
                    </View>
                    <Text style={styles.headerTitle}>Tabletop Roller</Text>
                </View>
                <TouchableOpacity
                    style={styles.settingsButton}
                    onPress={() => navigation.navigate('Settings')}
                >
                    <Settings size={20} color={COLORS.text} />
                </TouchableOpacity>
            </View>

            {/* Viewport */}
            <View style={styles.viewport}>
                <View style={styles.diceArea}>
                     {dice.length === 0 ? (
                         <View style={styles.emptyState}>
                             <Text style={styles.emptyStateText}>Add dice to roll</Text>
                         </View>
                     ) : (
                         <View style={styles.diceGrid}>
                             {dice.map((die) => (
                                 <TouchableOpacity
                                    key={die.id}
                                    onPress={() => removeDie(die.id)}
                                    activeOpacity={0.7}
                                    style={styles.dieWrapper}
                                >
                                     <Dice
                                        type={die.type}
                                        value={die.value}
                                        rolling={die.rolling}
                                        size={80}
                                    />
                                 </TouchableOpacity>
                             ))}
                         </View>
                     )}
                    
                    {/* Big Background Number (Total) */}
                    <View style={styles.backgroundNumberContainer}>
                        <Text style={styles.backgroundNumber}>
                            {dice.length > 0 ? totalResult : 0}
                        </Text>
                    </View>

                    <View style={styles.shakeHintContainer}>
                        <Text style={styles.shakeHint}>
                            {settings.shakeToRoll ? "Shake device to roll" : "Tap Roll to start"}
                        </Text>
                    </View>
                </View>
            </View>

            {/* Controls */}
            <View style={styles.controls}>
                <View style={styles.handleContainer}>
                    <View style={styles.handle} />
                </View>

                {/* Result Display */}
                <View style={styles.resultDisplay}>
                    <View>
                        <Text style={styles.resultLabel}>Total Result</Text>
                        <View style={styles.resultValueContainer}>
                            <Text style={styles.resultValue}>{totalResult}</Text>
                            {dice.some(d => d.type === 'd20' && d.value === 20) && (
                                <Text style={styles.criticalText}>CRIT!</Text>
                            )}
                            {dice.some(d => d.type === 'd20' && d.value === 1) && (
                                <Text style={[styles.criticalText, { color: COLORS.danger }]}>FAIL</Text>
                            )}
                        </View>
                    </View>
                    <TouchableOpacity
                        style={styles.historyButton}
                        onPress={() => navigation.navigate('History')}
                    >
                        <History size={18} color={COLORS.textDim} />
                        <Text style={styles.historyButtonText}>History</Text>
                    </TouchableOpacity>
                </View>

                {/* Dice Selector */}
                <View style={styles.diceSelector}>
                    <Text style={styles.sectionLabel}>Add Dice</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.diceList}>
                        {['d4', 'd6', 'd8', 'd10', 'd12', 'd20', 'd100'].map((d) => (
                            <TouchableOpacity
                                key={d}
                                style={styles.diceButton}
                                onPress={() => addDie(d as ActiveDie['type'])}
                            >
                                <Text style={styles.diceButtonText}>{d.toUpperCase()}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* Action Buttons */}
                <View style={[styles.actionButtons, { paddingBottom: insets.bottom + 10 }]}>
                    <TouchableOpacity
                        style={styles.trashButton}
                        onPress={clearDice}
                    >
                        <Trash2 size={24} color={COLORS.text} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={handleRoll}
                        disabled={isRolling || dice.length === 0}
                        style={[styles.rollButton, (isRolling || dice.length === 0) && styles.rollButtonDisabled]}
                    >
                        <RotateCcw size={24} color={COLORS.background} />
                        <Text style={styles.rollButtonText}>{isRolling ? 'Rolling...' : 'Roll Dice'}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.backgroundDarker,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        paddingVertical: 12,
        zIndex: 10,
    },
    headerTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    logoBox: {
        width: 24,
        height: 24,
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.8)',
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoDot: {
        width: 6,
        height: 6,
        backgroundColor: 'white',
        borderRadius: 3,
    },
    headerTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: 'rgba(255,255,255,0.8)',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    settingsButton: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    viewport: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.backgroundDarker,
    },
    diceArea: {
        width: '100%',
        height: '100%',
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
    },
    diceGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 16,
        width: '80%',
    },
    dieWrapper: {
        padding: 4,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyStateText: {
        color: 'rgba(255,255,255,0.3)',
        fontSize: 16,
    },
    backgroundNumberContainer: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -100 }, { translateY: -100 }], // Approx centering adjustment
        opacity: 0.05,
        zIndex: -1,
    },
    backgroundNumber: {
        fontSize: 200,
        fontWeight: '900',
        color: COLORS.white,
    },
    shakeHintContainer: {
        position: 'absolute',
        top: 100,
        width: '100%',
        alignItems: 'center',
    },
    shakeHint: {
        color: 'rgba(255,255,255,0.4)',
        fontSize: 12,
        letterSpacing: 2,
        textTransform: 'uppercase',
    },
    controls: {
        backgroundColor: COLORS.background,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.05)',
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        marginTop: -24,
        paddingTop: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -10 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
        elevation: 20,
    },
    handleContainer: {
        alignItems: 'center',
        paddingBottom: 4,
    },
    handle: {
        width: 48,
        height: 6,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 3,
    },
    resultDisplay: {
        paddingHorizontal: 24,
        paddingVertical: 16,
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
    },
    resultLabel: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 14,
        fontWeight: '500',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    resultValueContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: 8,
    },
    resultValue: {
        fontSize: 48,
        fontWeight: 'bold',
        color: COLORS.white,
    },
    criticalText: {
        color: COLORS.primary,
        fontSize: 18,
        fontWeight: '500',
    },
    historyButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    historyButtonText: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 14,
        fontWeight: '500',
    },
    diceSelector: {
        marginTop: 8,
        paddingLeft: 24,
    },
    sectionLabel: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.4)',
        fontWeight: '500',
        marginBottom: 12,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    diceList: {
        paddingRight: 24,
        gap: 12,
        paddingBottom: 8,
    },
    diceButton: {
        width: 64,
        height: 80,
        borderRadius: 12,
        backgroundColor: COLORS.surface,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    diceButtonText: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 18,
        fontWeight: 'bold',
    },
    actionButtons: {
        paddingHorizontal: 24,
        marginTop: 24,
        flexDirection: 'row',
        gap: 12,
    },
    trashButton: {
        width: 56,
        height: 56,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 12,
        backgroundColor: COLORS.surface,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    rollButton: {
        flex: 1,
        height: 56,
        backgroundColor: COLORS.primary,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: 8,
    },
    rollButtonDisabled: {
        opacity: 0.8,
    },
    rollButtonText: {
        color: COLORS.backgroundDarker,
        fontSize: 18,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
});

export default RollerScreen;
