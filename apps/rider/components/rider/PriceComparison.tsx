import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface PriceComparisonProps {
    originalPrice: number;
    discountedPrice: number;
    savingsText: string;
    estimatedMinutes: number;
    currency?: string;
}

export function PriceComparison({
    originalPrice,
    discountedPrice,
    savingsText,
    estimatedMinutes,
    currency = '£',
}: PriceComparisonProps) {
    return (
        <View>
            {/* Savings Text */}
            <Text className="text-teal-600 font-medium italic mb-2">
                {savingsText}
            </Text>

            {/* Price Row */}
            <View className="flex-row items-center justify-between">
                <View className="flex-row items-baseline">
                    {/* Original Price (strikethrough) */}
                    <Text className="text-gray-400 text-lg line-through mr-3">
                        {currency}{originalPrice.toFixed(2)}
                    </Text>
                    {/* Discounted Price */}
                    <Text className="text-teal-500 text-3xl font-bold">
                        {currency}{discountedPrice.toFixed(2)}
                    </Text>
                </View>

                {/* Estimated Time */}
                <View className="flex-row items-center">
                    <Ionicons name="time-outline" size={18} color="#6b7280" />
                    <Text className="text-gray-500 ml-1 font-medium">
                        {estimatedMinutes} min
                    </Text>
                </View>
            </View>
        </View>
    );
}
