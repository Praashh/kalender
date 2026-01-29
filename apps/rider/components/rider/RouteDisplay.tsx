import React from 'react';
import { View, Text } from 'react-native';

interface RouteDisplayProps {
    startLocation: string;
    endLocation: string;
}

export function RouteDisplay({ startLocation, endLocation }: RouteDisplayProps) {
    return (
        <View className="py-4">
            {/* Start */}
            <View className="flex-row items-start">
                <View className="items-center mr-4">
                    <View className="w-3 h-3 bg-green-500 rounded-full" />
                    <View className="w-0.5 h-8 bg-gray-200 my-1" />
                </View>
                <View className="flex-1">
                    <Text className="text-gray-400 text-xs font-medium uppercase tracking-wide">
                        Start
                    </Text>
                    <Text className="text-gray-900 font-semibold mt-0.5">{startLocation}</Text>
                </View>
            </View>

            {/* Destination */}
            <View className="flex-row items-start">
                <View className="items-center mr-4">
                    <View className="w-3 h-3 bg-teal-500 rounded-full" />
                </View>
                <View className="flex-1">
                    <Text className="text-gray-400 text-xs font-medium uppercase tracking-wide">
                        Destination
                    </Text>
                    <Text className="text-gray-900 font-semibold mt-0.5">{endLocation}</Text>
                </View>
            </View>
        </View>
    );
}
