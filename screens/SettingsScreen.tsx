import React from 'react';
import { View, Text, Switch, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Slider from '@react-native-community/slider';
import { Smartphone, Volume2, Globe, Disc, RotateCcw } from 'lucide-react-native';
import { useSettings } from '../src/context/SettingsContext';
import { COLORS } from '../src/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Toggle: React.FC<{ label: string; subLabel: string; icon: React.ReactNode; checked: boolean; onChange: (val: boolean) => void }> = ({ label, subLabel, icon, checked, onChange }) => (
    <View style={styles.toggleContainer}>
        <View style={styles.toggleLeft}>
            <View style={styles.iconContainer}>
                {icon}
            </View>
            <View style={styles.labelContainer}>
                <Text style={styles.labelText}>{label}</Text>
                <Text style={styles.subLabelText}>{subLabel}</Text>
            </View>
        </View>
        <Switch
            trackColor={{ false: '#3e3e3e', true: COLORS.primary }}
            thumbColor={checked ? COLORS.white : '#f4f3f4'}
            onValueChange={onChange}
            value={checked}
        />
    </View>
);

const SettingsScreen = ({ navigation }: any) => {
    const insets = useSafeAreaInsets();
    const { settings, updateSetting, resetSettings } = useSettings();

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
             <View style={styles.header}>
                <View style={{ width: 40 }} />
                <Text style={styles.headerTitle}>Configuration</Text>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.doneButton}>
                    <Text style={styles.doneText}>Done</Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 40 }]}>
                {/* General Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionHeader}>General</Text>
                    <View style={styles.card}>
                        <Toggle
                            label="Haptic Feedback"
                            subLabel="Feel collisions and rolls"
                            icon={<Smartphone size={24} color={COLORS.primary} />}
                            checked={settings.haptics}
                            onChange={(val) => updateSetting('haptics', val)}
                        />
                        <View style={styles.divider} />
                        <Toggle
                            label="Sound Effects"
                            subLabel="Rolling clatter sounds"
                            icon={<Volume2 size={24} color={COLORS.primary} />}
                            checked={settings.sound}
                            onChange={(val) => updateSetting('sound', val)}
                        />
                        <View style={styles.divider} />
                        <Toggle
                            label="Shake to Roll"
                            subLabel="Use accelerometer"
                            icon={<Smartphone size={24} color={COLORS.primary} />}
                            checked={settings.shakeToRoll}
                            onChange={(val) => updateSetting('shakeToRoll', val)}
                        />
                    </View>
                </View>

                {/* Physics Section */}
                <View style={styles.section}>
                    <View style={styles.sectionHeaderRow}>
                        <Text style={styles.sectionHeader}>Physics</Text>
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>Experimental</Text>
                        </View>
                    </View>

                    <View style={[styles.card, { padding: 16, gap: 24 }]}>
                         {/* Gravity */}
                        <View>
                            <View style={styles.sliderHeader}>
                                <View style={styles.sliderLabelRow}>
                                    <Globe size={20} color={COLORS.textSlate} />
                                    <Text style={styles.sliderLabel}>Gravity</Text>
                                </View>
                                <Text style={styles.sliderValue}>{(settings.gravity/50).toFixed(1)}x</Text>
                            </View>
                            <Slider
                                style={{ width: '100%', height: 40 }}
                                minimumValue={0}
                                maximumValue={100}
                                value={settings.gravity}
                                onValueChange={(val) => updateSetting('gravity', Math.round(val))}
                                minimumTrackTintColor={COLORS.primary}
                                maximumTrackTintColor={COLORS.surfaceHighlight}
                                thumbTintColor={COLORS.white}
                            />
                            <View style={styles.sliderLabels}>
                                <Text style={styles.sliderMinMax}>Moon</Text>
                                <Text style={styles.sliderMinMax}>Jupiter</Text>
                            </View>
                        </View>

                        {/* Bounce */}
                        <View>
                            <View style={styles.sliderHeader}>
                                <View style={styles.sliderLabelRow}>
                                    <Disc size={20} color={COLORS.textSlate} />
                                    <Text style={styles.sliderLabel}>Bounce Intensity</Text>
                                </View>
                                <Text style={styles.sliderValue}>{(settings.bounce/100).toFixed(2)}</Text>
                            </View>
                            <Slider
                                style={{ width: '100%', height: 40 }}
                                minimumValue={0}
                                maximumValue={100}
                                value={settings.bounce}
                                onValueChange={(val) => updateSetting('bounce', Math.round(val))}
                                minimumTrackTintColor={COLORS.primary}
                                maximumTrackTintColor={COLORS.surfaceHighlight}
                                thumbTintColor={COLORS.white}
                            />
                            <View style={styles.sliderLabels}>
                                <Text style={styles.sliderMinMax}>Dull</Text>
                                <Text style={styles.sliderMinMax}>Super Bouncy</Text>
                            </View>
                        </View>
                    </View>
                </View>

                <TouchableOpacity
                    style={styles.resetButton}
                    onPress={resetSettings}
                >
                    <RotateCcw size={20} color={COLORS.textSlate} />
                    <Text style={styles.resetButtonText}>Reset to Defaults</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.white,
    },
    doneButton: {
        padding: 8,
    },
    doneText: {
        color: COLORS.primary,
        fontWeight: '600',
        fontSize: 16,
    },
    content: {
        padding: 24,
        gap: 32,
    },
    section: {
        gap: 12,
    },
    sectionHeader: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.textSlate,
        textTransform: 'uppercase',
        letterSpacing: 1,
        paddingLeft: 4,
    },
    sectionHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingRight: 4,
    },
    badge: {
        backgroundColor: 'rgba(19, 236, 128, 0.1)',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 12,
    },
    badgeText: {
        fontSize: 10,
        fontWeight: '500',
        color: COLORS.primary,
    },
    card: {
        backgroundColor: COLORS.surface,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
        overflow: 'hidden',
    },
    toggleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
    },
    toggleLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        flex: 1,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 8,
        backgroundColor: COLORS.surfaceHighlight,
        alignItems: 'center',
        justifyContent: 'center',
    },
    labelContainer: {
        flex: 1,
    },
    labelText: {
        fontSize: 16,
        fontWeight: '500',
        color: COLORS.white,
    },
    subLabelText: {
        fontSize: 12,
        color: COLORS.textSlate,
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.05)',
        marginHorizontal: 16,
    },
    sliderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginBottom: 8,
    },
    sliderLabelRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    sliderLabel: {
        fontSize: 16,
        fontWeight: '500',
        color: COLORS.white,
    },
    sliderValue: {
        color: COLORS.primary,
        fontWeight: 'bold',
        fontFamily: 'monospace',
    },
    sliderLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 4,
    },
    sliderMinMax: {
        fontSize: 12,
        color: COLORS.textSlate,
        fontWeight: '500',
    },
    resetButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        padding: 16,
        backgroundColor: COLORS.surfaceHighlight,
        borderRadius: 12,
    },
    resetButtonText: {
        color: COLORS.textSlate,
        fontWeight: '500',
        fontSize: 16,
    },
});

export default SettingsScreen;
