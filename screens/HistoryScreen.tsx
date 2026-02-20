import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, ScrollView } from 'react-native';
import { RotateCcw, Diamond, Grid } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '../src/theme';

const CHART_DATA = [
    { name: '1-5', value: 5, color: '#334155' },
    { name: '6-10', value: 12, color: '#10b981' },
    { name: '11-15', value: 8, color: '#334155' },
    { name: '16-19', value: 20, color: '#13ec80' },
    { name: '20', value: 4, color: '#13ec80' },
];

const ROLLS = [
    { id: 1, type: 'Critical Hit!', subtitle: '1d20 Check (Stealth)', value: 20, time: 'Just now', icon: 'd20', isCrit: true },
    { id: 2, type: 'Damage Roll', subtitle: '2d6 3 + 5', value: 8, time: '2m ago', icon: 'd6', isCrit: false },
    { id: 3, type: 'Advantage Check', subtitle: '2d20 15, 4', value: 15, time: '5m ago', icon: 'd20', isCrit: false },
    { id: 4, type: 'Skill Check', subtitle: '1d20 Nat 2', value: 2, time: '12m ago', icon: 'd20', isFail: true },
    { id: 5, type: 'Fireball', subtitle: '8d6 Sum of 8', value: 28, time: '25m ago', icon: 'd6', isCrit: false },
];

const BarChart = ({ data }: { data: any[] }) => {
    const maxValue = Math.max(...data.map(d => d.value));
    return (
        <View style={styles.chartContainer}>
            {/* Grid Lines */}
            <View style={styles.gridLines}>
                <View style={styles.gridLine} />
                <View style={styles.gridLine} />
                <View style={styles.gridLine} />
                <View style={styles.gridLine} />
            </View>

            <View style={styles.chartContent}>
                <View style={styles.chartBars}>
                    {data.map((item, index) => (
                        <View key={index} style={styles.barWrapper}>
                            <View style={[styles.bar, {
                                height: `${(item.value / maxValue) * 100}%`,
                                backgroundColor: item.color
                            }]} />
                        </View>
                    ))}
                </View>
                <View style={styles.chartLabels}>
                    {data.map((item, index) => (
                        <Text key={index} style={styles.chartLabelText}>{item.name}</Text>
                    ))}
                </View>
            </View>
        </View>
    );
};

const HistoryScreen = () => {
    const insets = useSafeAreaInsets();
    const [filter, setFilter] = useState('All');

    const renderHeader = () => (
        <View>
            {/* Stats Section */}
            <View style={styles.statsSection}>
                <View style={styles.statsHeader}>
                    <Text style={styles.sectionTitle}>Session Stats</Text>
                    <View style={styles.statsBadge}>
                        <Text style={styles.statsBadgeText}>Total Rolls: <Text style={styles.statsBadgeBold}>42</Text></Text>
                    </View>
                </View>

                {/* Filters */}
                <View style={styles.filterContainer}>
                    {['All', 'd20', 'd10', 'd6'].map(f => (
                        <TouchableOpacity
                            key={f}
                            style={[styles.filterButton, filter === f && styles.filterButtonActive]}
                            onPress={() => setFilter(f)}
                        >
                            <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>{f}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Chart */}
                <BarChart data={CHART_DATA} />
            </View>

            <View style={styles.listHeader}>
                <Text style={styles.sectionTitle}>Recent Rolls</Text>
                <Text style={styles.todayText}>Today</Text>
            </View>
        </View>
    );

    const renderItem = ({ item }: { item: typeof ROLLS[0] }) => (
        <View style={[
            styles.rollItem,
            item.isCrit && styles.rollItemCrit
        ]}>
            {item.isCrit && <View style={styles.critIndicator} />}

            <View style={[
                styles.iconContainer,
                item.isFail ? styles.iconFail : styles.iconNormal
            ]}>
                {item.icon === 'd20' ? (
                    <Diamond size={24} color={item.isFail ? '#f87171' : '#cbd5e1'} />
                ) : (
                    <Grid size={24} color="#cbd5e1" />
                )}
            </View>

            <View style={styles.rollInfo}>
                <View style={styles.rollTitleRow}>
                    <Text style={styles.rollType} numberOfLines={1}>{item.type}</Text>
                    {item.isCrit && <Text style={styles.nat20Text}>Natural 20</Text>}
                </View>
                <Text style={styles.rollSubtitle} numberOfLines={1}>{item.subtitle}</Text>
            </View>

            <View style={styles.rollValueContainer}>
                <Text style={[
                    styles.rollValue,
                    item.isCrit ? styles.textPrimary : item.isFail ? styles.textDanger : styles.textWhite
                ]}>
                    {item.value}
                </Text>
                <Text style={styles.rollTime}>{item.time}</Text>
            </View>
        </View>
    );

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
             <View style={styles.header}>
                <Text style={styles.headerTitle}>Roll History</Text>
                <TouchableOpacity style={styles.resetButton}>
                    <RotateCcw size={16} color={COLORS.textSlate} />
                    <Text style={styles.resetText}>Reset Stats</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={ROLLS}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + 20 }]}
                ListHeaderComponent={renderHeader()}
                showsVerticalScrollIndicator={false}
            />
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
        paddingVertical: 16,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.white,
    },
    resetButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    resetText: {
        fontSize: 14,
        fontWeight: '500',
        color: COLORS.textSlate,
    },
    listContent: {
        paddingHorizontal: 24,
        paddingBottom: 24,
    },
    statsSection: {
        marginBottom: 24,
    },
    statsHeader: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: 'rgba(255,255,255,0.9)',
    },
    statsBadge: {
        backgroundColor: 'rgba(19, 236, 128, 0.1)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statsBadgeText: {
        fontSize: 12,
        fontWeight: '500',
        color: COLORS.primary,
    },
    statsBadgeBold: {
        fontWeight: 'bold',
    },
    filterContainer: {
        flexDirection: 'row',
        backgroundColor: COLORS.surface,
        borderRadius: 12,
        padding: 4,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    filterButton: {
        flex: 1,
        paddingVertical: 8,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
    },
    filterButtonActive: {
        backgroundColor: '#2A4034', // Dark green
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        elevation: 1,
    },
    filterText: {
        fontSize: 12,
        fontWeight: '500',
        color: COLORS.textSlate,
    },
    filterTextActive: {
        color: COLORS.white,
        fontWeight: '600',
    },
    chartContainer: {
        backgroundColor: COLORS.surface,
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
        height: 200,
        position: 'relative',
    },
    gridLines: {
        ...StyleSheet.absoluteFillObject,
        padding: 20,
        justifyContent: 'space-between',
    },
    gridLine: {
        width: '100%',
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.05)',
    },
    chartContent: {
        flex: 1,
    },
    chartBars: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        paddingHorizontal: 8,
    },
    barWrapper: {
        width: 30,
        height: '100%',
        justifyContent: 'flex-end',
    },
    bar: {
        width: '100%',
        borderTopLeftRadius: 4,
        borderTopRightRadius: 4,
    },
    chartLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
        paddingHorizontal: 8,
    },
    chartLabelText: {
        fontSize: 10,
        color: COLORS.textSlate,
        fontWeight: '500',
        width: 30,
        textAlign: 'center',
    },
    listHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
        backgroundColor: COLORS.backgroundDarker, // Sticky header simulation if needed
        paddingVertical: 8,
    },
    todayText: {
        fontSize: 12,
        color: COLORS.textSlate,
        fontWeight: '500',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    rollItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.surface,
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    rollItemCrit: {
        borderColor: 'rgba(19, 236, 128, 0.2)',
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 2,
    },
    critIndicator: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: 4,
        backgroundColor: COLORS.primary,
        borderTopLeftRadius: 12,
        borderBottomLeftRadius: 12,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    iconNormal: {
        backgroundColor: 'rgba(255,255,255,0.05)',
    },
    iconFail: {
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
    },
    rollInfo: {
        flex: 1,
        marginRight: 16,
    },
    rollTitleRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: 8,
    },
    rollType: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.white,
    },
    nat20Text: {
        fontSize: 12,
        color: COLORS.primary,
        fontWeight: '500',
    },
    rollSubtitle: {
        fontSize: 12,
        color: COLORS.textSlate,
        marginTop: 4,
    },
    rollValueContainer: {
        alignItems: 'flex-end',
    },
    rollValue: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    textPrimary: {
        color: COLORS.primary,
    },
    textDanger: {
        color: '#f87171',
    },
    textWhite: {
        color: COLORS.white,
    },
    rollTime: {
        fontSize: 10,
        color: COLORS.textSlate,
    },
});

export default HistoryScreen;
