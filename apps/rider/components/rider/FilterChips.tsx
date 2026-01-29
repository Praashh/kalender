import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface FilterChip {
    id: string;
    label: string;
    icon: keyof typeof Ionicons.glyphMap;
}

interface FilterChipsProps {
    chips: FilterChip[];
    selectedIds: string[];
    onToggle: (id: string) => void;
}

export function FilterChips({ chips, selectedIds, onToggle }: FilterChipsProps) {
    return (
        <View className="flex-row gap-3">
            {chips.map((chip) => {
                const isSelected = selectedIds.includes(chip.id);
                return (
                    <TouchableOpacity
                        key={chip.id}
                        onPress={() => onToggle(chip.id)}
                        activeOpacity={0.7}
                        className={`flex-row items-center px-4 py-2.5 rounded-full border ${isSelected
                                ? 'border-teal-500 bg-teal-50'
                                : 'border-gray-200 bg-white'
                            }`}
                    >
                        <Ionicons
                            name={chip.icon}
                            size={18}
                            color={isSelected ? '#14B8A6' : '#6b7280'}
                        />
                        <Text
                            className={`ml-2 font-medium ${isSelected ? 'text-teal-600' : 'text-gray-600'
                                }`}
                        >
                            {chip.label}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}
