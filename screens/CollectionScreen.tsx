import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Modal, TextInput, Alert, Dimensions } from 'react-native';
import { Filter, Check, SlidersHorizontal, Save, Trash, Plus, X } from 'lucide-react-native';
import { DiceSkin } from '../src/types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '../src/theme';
import { useProfile } from '../src/context/ProfileContext';

const { width } = Dimensions.get('window');
const COLUMN_WIDTH = (width - 48 - 16) / 2; // 24px padding * 2, 16px gap

const INITIAL_SKINS: DiceSkin[] = [
    { id: '1', name: 'Neon Pulse', rarity: 'Rare', material: 'Gas', color: '#13ec80', isEquipped: true },
    { id: '2', name: 'Dragon Scale', rarity: 'Rare', material: 'Bone', color: '#8B0000', secondaryColor: '#3a1c1c', isEquipped: false },
    { id: '3', name: 'Classic Wood', rarity: 'Common', material: 'Oak', color: '#8b5a2b', isEquipped: false },
    { id: '4', name: 'Void Walker', rarity: 'Epic', material: 'Glass', color: '#4a148c', isEquipped: false },
    { id: '5', name: 'Cyber Mist', rarity: 'Rare', material: 'Gas', color: '#00bcd4', isEquipped: false },
    { id: '6', name: 'Molten Core', rarity: 'Legendary', material: 'Stone', color: '#ff5722', isEquipped: false },
];

const CollectionScreen = () => {
    const insets = useSafeAreaInsets();
    const { profiles, addProfile, selectProfile, deleteProfile, currentProfile } = useProfile();
    const [skins, setSkins] = useState<DiceSkin[]>(INITIAL_SKINS);
    const [filter, setFilter] = useState('All');
    const [modalVisible, setModalVisible] = useState(false);
    const [newProfileName, setNewProfileName] = useState('');

    const equippedSkin = skins.find(s => s.isEquipped);

    const filteredSkins = skins.filter(s => {
        if (filter === 'All') return true;
        if (filter === 'Favorites') return s.isEquipped;
        if (filter === 'Neon') return s.name.includes('Neon') || s.material === 'Gas';
        if (filter === 'Metal') return s.material === 'Metal';
        if (filter === 'Glass') return s.material === 'Glass';
        return s.material === filter;
    });

    const handleEquip = (id: string) => {
        setSkins(skins.map(s => ({ ...s, isEquipped: s.id === id })));
    };

    const handleSaveProfile = async () => {
        if (!newProfileName.trim()) {
            Alert.alert('Error', 'Please enter a profile name');
            return;
        }
        const currentEquipped = skins.find(s => s.isEquipped);
        if (currentEquipped) {
            await addProfile(newProfileName, [currentEquipped], currentEquipped.color);
            setNewProfileName('');
            setModalVisible(false);
            Alert.alert('Success', 'Profile saved!');
        }
    };

    const renderSkinItem = ({ item }: { item: DiceSkin }) => (
        <TouchableOpacity
            style={[
                styles.skinItem,
                item.isEquipped && styles.skinItemEquipped
            ]}
            onPress={() => handleEquip(item.id)}
            activeOpacity={0.8}
        >
            {item.isEquipped && (
                <View style={styles.checkIcon}>
                    <Check size={14} color={COLORS.backgroundDarker} strokeWidth={3} />
                </View>
            )}

            <View style={[styles.skinPreview, { backgroundColor: item.secondaryColor || '#000' }]}>
                <View style={styles.gradientOverlay} />
                <View style={[
                    styles.diceVisual,
                    {
                        backgroundColor: item.color,
                        shadowColor: item.material === 'Gas' ? item.color : '#000',
                        shadowOpacity: item.material === 'Gas' ? 0.6 : 0.2
                    }
                ]}>
                    <View style={styles.dicePip} />
                </View>
            </View>

            <View>
                <Text style={styles.skinName}>{item.name}</Text>
                {item.isEquipped ? (
                    <Text style={styles.equippedText}>Equipped</Text>
                ) : (
                    <Text style={styles.rarityText}>{item.rarity} • {item.material}</Text>
                )}
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>My Collection</Text>
                <View style={styles.headerActions}>
                     <TouchableOpacity
                        style={styles.iconButton}
                        onPress={() => setModalVisible(true)}
                    >
                        <Save size={18} color={COLORS.primary} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconButton}>
                        <Filter size={18} color={COLORS.primary} />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Tags */}
            <View style={styles.tagsContainer}>
                <FlatList
                    horizontal
                    data={['All', 'Favorites', 'Metal', 'Glass', 'Neon']}
                    keyExtractor={(item) => item}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.tagsList}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            onPress={() => setFilter(item)}
                            style={[
                                styles.tagButton,
                                filter === item && styles.tagButtonActive
                            ]}
                        >
                            <Text style={[
                                styles.tagText,
                                filter === item && styles.tagTextActive
                            ]}>{item}</Text>
                        </TouchableOpacity>
                    )}
                />
            </View>

            {/* Grid */}
            <FlatList
                data={filteredSkins}
                renderItem={renderSkinItem}
                keyExtractor={(item) => item.id}
                numColumns={2}
                contentContainerStyle={[styles.grid, { paddingBottom: 150 }]}
                columnWrapperStyle={styles.columnWrapper}
                showsVerticalScrollIndicator={false}
            />

            {/* Customize Panel Floating */}
            <View style={[styles.floatingPanelContainer, { paddingBottom: insets.bottom + 80 }]}>
                <View style={styles.floatingPanel}>
                    <View style={styles.panelContent}>
                        <View>
                            <Text style={styles.panelLabel}>Selected: {equippedSkin?.name}</Text>
                            <Text style={styles.panelTitle}>Customize Dice</Text>
                        </View>
                        <TouchableOpacity style={styles.openButton}>
                            <SlidersHorizontal size={18} color={COLORS.backgroundDarker} />
                            <Text style={styles.openButtonText}>Open</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            {/* Profile Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Save Profile</Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <X size={24} color={COLORS.textDim} />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.modalBody}>
                            <Text style={styles.inputLabel}>Profile Name</Text>
                            <TextInput
                                style={styles.textInput}
                                placeholder="e.g. Stealth Build"
                                placeholderTextColor={COLORS.textDim}
                                value={newProfileName}
                                onChangeText={setNewProfileName}
                            />

                            <Text style={[styles.inputLabel, { marginTop: 16 }]}>Saved Profiles</Text>
                            <FlatList
                                data={profiles}
                                keyExtractor={(item) => item.id}
                                style={{ maxHeight: 200 }}
                                renderItem={({ item }) => (
                                    <View style={styles.profileItem}>
                                        <TouchableOpacity
                                            style={styles.profileInfo}
                                            onPress={() => {
                                                // Load profile logic (simulate)
                                                if (item.skins.length > 0) {
                                                    handleEquip(item.skins[0].id); // Simplified: Assume profile maps to a skin id
                                                    setModalVisible(false);
                                                }
                                            }}
                                        >
                                            <View style={[styles.profileColor, { backgroundColor: item.color }]} />
                                            <Text style={styles.profileName}>{item.name}</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => deleteProfile(item.id)}>
                                            <Trash size={18} color={COLORS.danger} />
                                        </TouchableOpacity>
                                    </View>
                                )}
                            />
                        </View>

                        <TouchableOpacity
                            style={styles.saveButton}
                            onPress={handleSaveProfile}
                        >
                            <Text style={styles.saveButtonText}>Save Current Setup</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
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
    headerActions: {
        flexDirection: 'row',
        gap: 8,
    },
    iconButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(28, 39, 33, 0.5)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(19, 236, 128, 0.2)',
    },
    tagsContainer: {
        marginBottom: 16,
    },
    tagsList: {
        paddingHorizontal: 24,
        gap: 12,
    },
    tagButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 12,
        backgroundColor: COLORS.surface,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    tagButtonActive: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    tagText: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.textSlate,
    },
    tagTextActive: {
        color: COLORS.backgroundDarker,
    },
    grid: {
        paddingHorizontal: 24,
    },
    columnWrapper: {
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    skinItem: {
        width: COLUMN_WIDTH,
        backgroundColor: COLORS.surface,
        borderRadius: 16,
        padding: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
        gap: 12,
    },
    skinItemEquipped: {
        borderColor: COLORS.primary,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
        elevation: 5,
    },
    checkIcon: {
        position: 'absolute',
        top: 12,
        right: 12,
        zIndex: 10,
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: COLORS.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    skinPreview: {
        width: '100%',
        aspectRatio: 1,
        borderRadius: 12,
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    gradientOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.2)',
    },
    diceVisual: {
        width: '66%',
        height: '66%',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        transform: [{ rotate: '25deg' }],
    },
    dicePip: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: 'rgba(255,255,255,0.8)',
    },
    skinName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.white,
    },
    equippedText: {
        fontSize: 12,
        fontWeight: '500',
        color: COLORS.primary,
        marginTop: 4,
        textTransform: 'uppercase',
    },
    rarityText: {
        fontSize: 12,
        fontWeight: '500',
        color: COLORS.textSlate,
        marginTop: 4,
    },
    floatingPanelContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 16,
    },
    floatingPanel: {
        backgroundColor: 'rgba(28, 46, 36, 0.95)',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
        elevation: 10,
    },
    panelContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    panelLabel: {
        fontSize: 12,
        fontWeight: '500',
        color: COLORS.primary,
        textTransform: 'uppercase',
        marginBottom: 4,
    },
    panelTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.white,
    },
    openButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: COLORS.primary,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 12,
    },
    openButtonText: {
        color: COLORS.backgroundDarker,
        fontWeight: 'bold',
        fontSize: 14,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.8)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: COLORS.background,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 24,
        minHeight: 400,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.white,
    },
    modalBody: {
        flex: 1,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '500',
        color: COLORS.textSlate,
        marginBottom: 8,
    },
    textInput: {
        backgroundColor: COLORS.surface,
        borderRadius: 12,
        padding: 16,
        color: COLORS.white,
        fontSize: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    saveButton: {
        backgroundColor: COLORS.primary,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 24,
    },
    saveButtonText: {
        color: COLORS.backgroundDarker,
        fontWeight: 'bold',
        fontSize: 16,
    },
    profileItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
    },
    profileInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        flex: 1,
    },
    profileColor: {
        width: 16,
        height: 16,
        borderRadius: 8,
    },
    profileName: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: '500',
    },
});

export default CollectionScreen;
