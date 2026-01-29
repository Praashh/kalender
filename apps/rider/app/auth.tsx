import React, { useState } from "react";
import {
  Alert,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Text,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/contexts/AuthContext";

export default function AuthScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ returnTo?: string; mode?: string }>();
  const { login, register, isLoading } = useAuth();

  const [isLogin, setIsLogin] = useState(params.mode !== "register");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPasswordError, setShowPasswordError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClose = () => {
    router.back();
  };

  const handleAuth = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (!isLogin && !fullName.trim()) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setIsSubmitting(true);
    setShowPasswordError(false);

    try {
      let success = false;

      if (isLogin) {
        success = await login(email.trim(), password);
        if (!success) {
          setShowPasswordError(true);
          Alert.alert("Login Failed", "Invalid email or password");
        }
      } else {
        success = await register(fullName.trim(), email.trim(), password);
        if (!success) {
          Alert.alert(
            "Signup Failed",
            "Error creating account. Please try again."
          );
        }
      }

      if (success) {
        if (params.returnTo === "booking") {
          router.replace("/finding-rider");
        } else {
          router.back();
        }
      }
    } catch (error) {
      console.error("Auth error:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid =
    email.trim() && password.trim() && (isLogin || fullName.trim());
  const isButtonDisabled = !isFormValid || isSubmitting || isLoading;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* Header with close button */}
        <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-100">
          <TouchableOpacity onPress={handleClose} className="p-2 -ml-2">
            <Ionicons name="close" size={28} color="#374151" />
          </TouchableOpacity>
          <Text className="text-gray-900 text-lg font-semibold">
            {isLogin ? "Sign In" : "Create Account"}
          </Text>
          <View className="w-10" />
        </View>

        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-1 px-5 pt-8">
            {/* Logo */}
            <View className="items-center mb-8">
              <View className="w-16 h-16 bg-teal-500 rounded-2xl justify-center items-center mb-4">
                <Text className="text-white text-3xl font-bold">Z</Text>
              </View>
              <Text className="text-gray-900 text-2xl font-bold mb-2">
                Zipo
              </Text>
              <Text className="text-gray-500 text-base text-center">
                {params.returnTo === "booking"
                  ? "Sign in to confirm your ride"
                  : "Save more on every ride"}
              </Text>
            </View>

            {/* Form */}
            <View className="bg-gray-50 rounded-3xl p-6">
              {!isLogin && (
                <View className="mb-5">
                  <Text className="text-gray-700 text-base font-medium mb-2">
                    Full Name
                  </Text>
                  <TextInput
                    className="h-14 border border-gray-200 rounded-xl px-4 text-base text-gray-900 bg-white"
                    placeholder="John Doe"
                    placeholderTextColor="#9ca3af"
                    value={fullName}
                    onChangeText={setFullName}
                  />
                </View>
              )}

              <View className="mb-5">
                <Text className="text-gray-700 text-base font-medium mb-2">
                  Email Address
                </Text>
                <TextInput
                  className="h-14 border border-gray-200 rounded-xl px-4 text-base text-gray-900 bg-white"
                  placeholder="you@example.com"
                  placeholderTextColor="#9ca3af"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View className="mb-5">
                <Text className="text-gray-700 text-base font-medium mb-2">
                  Password
                </Text>
                <TextInput
                  className="h-14 border border-gray-200 rounded-xl px-4 text-base text-gray-900 bg-white"
                  placeholder="Enter your password"
                  placeholderTextColor="#9ca3af"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
                {showPasswordError && (
                  <Text className="text-red-500 text-sm mt-2">
                    Incorrect password. Please try again.
                  </Text>
                )}
              </View>

              <TouchableOpacity
                className={`py-4 rounded-xl items-center mb-5 ${isButtonDisabled ? "bg-gray-300" : "bg-teal-500"
                  }`}
                onPress={handleAuth}
                disabled={isButtonDisabled}
                activeOpacity={0.8}
              >
                <Text
                  className={`text-base font-semibold ${isButtonDisabled ? "text-gray-500" : "text-white"
                    }`}
                >
                  {isSubmitting
                    ? "Please wait..."
                    : isLogin
                      ? "Sign In"
                      : "Create Account"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="items-center"
                onPress={() => {
                  setIsLogin(!isLogin);
                  setShowPasswordError(false);
                }}
              >
                <Text className="text-gray-500 text-sm">
                  {isLogin
                    ? "Don't have an account? "
                    : "Already have an account? "}
                  <Text className="text-teal-500 font-semibold">
                    {isLogin ? "Sign Up" : "Sign In"}
                  </Text>
                </Text>
              </TouchableOpacity>
            </View>

            {/* Social login options */}
            <View className="mt-6">
              <View className="flex-row items-center mb-6">
                <View className="flex-1 h-px bg-gray-200" />
                <Text className="text-gray-400 mx-4">or continue with</Text>
                <View className="flex-1 h-px bg-gray-200" />
              </View>

              <View className="flex-row gap-4">
                <TouchableOpacity
                  className="flex-1 flex-row items-center justify-center bg-gray-50 py-4 rounded-xl border border-gray-200"
                  activeOpacity={0.7}
                  onPress={() =>
                    Alert.alert("Coming Soon", "Google sign in coming soon!")
                  }
                >
                  <Ionicons name="logo-google" size={20} color="#374151" />
                  <Text className="text-gray-700 font-medium ml-2">Google</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="flex-1 flex-row items-center justify-center bg-gray-50 py-4 rounded-xl border border-gray-200"
                  activeOpacity={0.7}
                  onPress={() =>
                    Alert.alert("Coming Soon", "Apple sign in coming soon!")
                  }
                >
                  <Ionicons name="logo-apple" size={20} color="#374151" />
                  <Text className="text-gray-700 font-medium ml-2">Apple</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
