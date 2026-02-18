export enum Tab {
    ROLLER = 'ROLLER',
    COLLECTION = 'COLLECTION',
    HISTORY = 'HISTORY',
    SETTINGS = 'SETTINGS'
}

export interface RollResult {
    id: string;
    diceType: string; // e.g., 'd20', '2d6'
    total: number;
    values: number[];
    timestamp: Date;
    isCritical?: boolean;
    isFail?: boolean;
    label?: string; // e.g., 'Stealth Check'
}

export interface DiceSkin {
    id: string;
    name: string;
    rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
    material: string;
    color: string; // hex for preview
    secondaryColor?: string;
    isEquipped: boolean;
}
