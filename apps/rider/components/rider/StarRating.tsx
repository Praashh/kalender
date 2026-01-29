import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
} from 'react-native-reanimated';
import { Colors } from '@/constants/Colors';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

interface StarRatingProps {
    rating: number;
    onRatingChange: (rating: number) => void;
    size?: number;
    readonly?: boolean;
}

export function StarRating({
    rating,
    onRatingChange,
    size = 36,
    readonly = false,
}: StarRatingProps) {
    return (
        <View className="flex-row gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
                <StarButton
                    key={star}
                    filled={star <= rating}
                    size={size}
                    onPress={() => !readonly && onRatingChange(star)}
                    disabled={readonly}
                />
            ))}
        </View>
    );
}

interface StarButtonProps {
    filled: boolean;
    size: number;
    onPress: () => void;
    disabled: boolean;
}

function StarButton({ filled, size, onPress, disabled }: StarButtonProps) {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const handlePressIn = () => {
        if (!disabled) {
            scale.value = withSpring(1.2);
        }
    };

    const handlePressOut = () => {
        scale.value = withSpring(1);
    };

    return (
        <AnimatedTouchable
            style={animatedStyle}
            onPress={onPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            activeOpacity={disabled ? 1 : 0.7}
            disabled={disabled}
        >
            <Ionicons
                name={filled ? 'star' : 'star-outline'}
                size={size}
                color={filled ? Colors.brand.gold : '#d1d5db'}
            />
        </AnimatedTouchable>
    );
}
