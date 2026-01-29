import React, { useRef, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Image,
  Animated,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { ONBOARDING_SLIDES } from "@/constants/mockData";

const { width } = Dimensions.get("window");
const ONBOARDING_KEY = "hasCompletedOnboarding";

interface SlideProps {
  item: (typeof ONBOARDING_SLIDES)[0];
}

const Slide: React.FC<SlideProps> = ({ item }) => {
  return (
    <View style={{ width }} className="flex-1 items-center justify-center px-8">
      <View className="w-72 h-72 rounded-3xl overflow-hidden mb-10 shadow-lg bg-teal-50">
        <Image
          source={{ uri: item.image }}
          className="w-full h-full"
          resizeMode="cover"
        />
      </View>
      <Text className="text-gray-900 text-3xl font-bold text-center mb-4">
        {item.title}
      </Text>
      <Text className="text-gray-500 text-lg text-center leading-7">
        {item.subtitle}
      </Text>
    </View>
  );
};

interface PaginationProps {
  currentIndex: number;
  total: number;
}

const Pagination: React.FC<PaginationProps> = ({ currentIndex, total }) => {
  return (
    <View className="flex-row items-center justify-center gap-2">
      {Array.from({ length: total }).map((_, index) => (
        <View
          key={index}
          className={`h-2 rounded-full ${index === currentIndex
              ? "w-8 bg-teal-500"
              : "w-2 bg-gray-300"
            }`}
        />
      ))}
    </View>
  );
};

export default function OnboardingScreen() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const handleNext = () => {
    if (currentIndex < ONBOARDING_SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      completeOnboarding();
    }
  };

  const handleSkip = () => {
    completeOnboarding();
  };

  const completeOnboarding = async () => {
    try {
      await AsyncStorage.setItem(ONBOARDING_KEY, "true");
      router.replace("/(tabs)");
    } catch (error) {
      console.error("Error saving onboarding status:", error);
      router.replace("/(tabs)");
    }
  };

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: any[] }) => {
      if (viewableItems.length > 0) {
        setCurrentIndex(viewableItems[0].index || 0);
      }
    }
  ).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const isLastSlide = currentIndex === ONBOARDING_SLIDES.length - 1;

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Skip button */}
      <View className="absolute top-16 right-6 z-10">
        {!isLastSlide && (
          <TouchableOpacity onPress={handleSkip} className="py-2 px-4">
            <Text className="text-gray-500 text-base font-medium">Skip</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Logo */}
      <View className="absolute top-16 left-6 z-10">
        <View className="flex-row items-center">
          <View className="w-10 h-10 bg-teal-500 rounded-xl items-center justify-center">
            <Text className="text-white text-xl font-bold">Z</Text>
          </View>
          <Text className="text-gray-900 text-xl font-bold ml-2">Zipo</Text>
        </View>
      </View>

      {/* Slides */}
      <View className="flex-1 justify-center">
        <FlatList
          ref={flatListRef}
          data={ONBOARDING_SLIDES}
          renderItem={({ item }) => <Slide item={item} />}
          keyExtractor={(item) => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          bounces={false}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: false }
          )}
        />
      </View>

      {/* Bottom section */}
      <View className="px-6 pb-8">
        {/* Pagination dots */}
        <View className="mb-8">
          <Pagination
            currentIndex={currentIndex}
            total={ONBOARDING_SLIDES.length}
          />
        </View>

        {/* Action button */}
        <TouchableOpacity
          onPress={handleNext}
          className="bg-teal-500 py-4 rounded-2xl items-center"
          activeOpacity={0.8}
        >
          <Text className="text-white text-lg font-semibold">
            {isLastSlide ? "Get Started" : "Next"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
