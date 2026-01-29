import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';

interface RideCompletedCardProps {
    youReceived: number;
    competitorTake: number;
    competitorName?: string;
    currency?: string;
}

export function RideCompletedCard({
    youReceived,
    competitorTake,
    competitorName = 'Uber/Bolt',
    currency = '£',
}: RideCompletedCardProps) {
    const total = youReceived + competitorTake;
    const yourPercent = Math.round((youReceived / total) * 100);
    const competitorPercent = 100 - yourPercent;

    return (
        <View className="bg-white rounded-3xl p-6 shadow-lg mx-4">
            <Text className="text-gray-900 text-xl font-bold text-center mb-6">
                Ride Completed
            </Text>

            <View className="flex-row">
                {/* Zipo Side */}
                <View className="flex-1 items-center">
                    <View className="w-14 h-14 bg-teal-50 rounded-2xl items-center justify-center mb-3">
                        <Text className="text-teal-500 text-xl font-bold">Z</Text>
                    </View>
                    <Text className="text-teal-500 text-2xl font-bold">
                        {currency}{youReceived.toFixed(2)}
                    </Text>
                    <Text className="text-gray-500 text-sm mt-1">You received</Text>
                    <Text className="text-gray-400 text-xs">{yourPercent}%</Text>
                </View>

                {/* Divider */}
                <View className="w-px bg-gray-200 mx-4" />

                {/* Competitor Side */}
                <View className="flex-1 items-center">
                    <View className="w-14 h-14 bg-gray-100 rounded-2xl items-center justify-center mb-3">
                        <Ionicons name="car" size={24} color="#EF4444" />
                    </View>
                    <Text className="text-gray-400 text-2xl font-bold line-through">
                        {currency}{competitorTake.toFixed(2)}
                    </Text>
                    <Text className="text-gray-500 text-sm mt-1">{competitorName} take</Text>
                    <Text className="text-gray-400 text-xs">{competitorPercent}%</Text>
                </View>
            </View>
        </View>
    );
}
