import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';

export interface VehicleType {
    id: string;
    name: string;
    seats: number;
    icon: 'car' | 'car-sport';
}

interface VehicleTypeSelectorProps {
    options: VehicleType[];
    selectedId: string;
    onSelect: (id: string) => void;
}

export function VehicleTypeSelector({
    options,
    selectedId,
    onSelect,
}: VehicleTypeSelectorProps) {
    return (
        <View className="flex-row gap-3">
            {options.map((option) => {
                const isSelected = option.id === selectedId;
                return (
                    <TouchableOpacity
                        key={option.id}
                        onPress={() => onSelect(option.id)}
                        activeOpacity={0.7}
                        className={`flex-1 py-4 rounded-xl items-center border-2 ${isSelected
                                ? 'border-teal-500 bg-teal-50'
                                : 'border-gray-200 bg-white'
                            }`}
                    >
                        <Ionicons
                            name={option.icon}
                            size={28}
                            color={isSelected ? Colors.brand.teal : '#6b7280'}
                        />
                        <Text
                            className={`mt-2 font-semibold ${isSelected ? 'text-teal-600' : 'text-gray-700'
                                }`}
                        >
                            {option.name}
                        </Text>
                        <Text className="text-gray-400 text-sm">{option.seats} seats</Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}
