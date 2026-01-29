import React from 'react';
import { View, Text, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';

interface DriverCardProps {
    name: string;
    photo: string;
    rating: number;
    trips: number;
    yearsWithZipo: number;
    isOnline?: boolean;
}

export function DriverCard({
    name,
    photo,
    rating,
    trips,
    yearsWithZipo,
    isOnline = true,
}: DriverCardProps) {
    return (
        <View className="bg-white rounded-2xl p-4 shadow-sm">
            <View className="flex-row items-center">
                {/* Driver Photo */}
                <View className="relative">
                    <Image
                        source={{ uri: photo }}
                        className="w-16 h-16 rounded-full"
                    />
                    {isOnline && (
                        <View className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
                    )}
                </View>

                {/* Driver Info */}
                <View className="flex-1 ml-4">
                    <View className="flex-row items-center">
                        <Text className="text-gray-900 text-lg font-semibold mr-2">
                            {name}
                        </Text>
                        <View className="flex-row items-center bg-gray-100 rounded-full px-2 py-0.5">
                            <Ionicons name="star" size={14} color={Colors.brand.gold} />
                            <Text className="text-gray-700 text-sm font-medium ml-1">
                                {rating.toFixed(1)}
                            </Text>
                        </View>
                    </View>
                    <Text className="text-gray-500 text-sm mt-1">
                        {trips.toLocaleString()} trips • {yearsWithZipo} year{yearsWithZipo > 1 ? 's' : ''} with Zipo
                    </Text>
                </View>
            </View>
        </View>
    );
}
