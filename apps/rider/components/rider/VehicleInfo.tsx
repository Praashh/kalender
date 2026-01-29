import React from 'react';
import { View, Text } from 'react-native';

interface VehicleInfoProps {
    vehicleType: string;
    model: string;
    plateNumber: string;
}

export function VehicleInfo({ vehicleType, model, plateNumber }: VehicleInfoProps) {
    return (
        <View className="flex-row mt-4 pt-4 border-t border-gray-100">
            {/* Vehicle Type */}
            <View className="flex-1">
                <Text className="text-gray-400 text-xs font-medium uppercase tracking-wide">
                    Vehicle
                </Text>
                <Text className="text-gray-900 font-semibold mt-1">{vehicleType}</Text>
                <Text className="text-gray-500 text-sm">{model}</Text>
            </View>

            {/* Plate Number */}
            <View className="flex-1">
                <Text className="text-gray-400 text-xs font-medium uppercase tracking-wide">
                    Plate
                </Text>
                <View className="flex-row items-center mt-1">
                    <View className="bg-gray-100 rounded-lg px-3 py-1">
                        <Text className="text-gray-900 font-bold">{plateNumber}</Text>
                    </View>
                </View>
            </View>
        </View>
    );
}
