import { ThemedText } from "@/components/ThemedText";
import React, { useState } from "react";
import {
  Alert,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/contexts/AuthContext";

export default function AuthScreen() {
  const { login, register, isLoading } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPasswordError, setShowPasswordError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
        // Auth context will handle navigation automatically
        console.log("Authentication successful");
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
    <SafeAreaView className="flex-1 bg-[#1C1C1E]">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-1 px-5 pt-10">
            <View className="items-center mb-10">
              <View className="w-16 h-16 bg-[#f0f7f236] white rounded-xl justify-center items-center mb-4">
                <ThemedText className="text-[#1C1C1E] text-4xl font-bold">
                  K
                </ThemedText>
              </View>
              <ThemedText className="text-white text-2xl font-bold mb-2">
                Kalender
              </ThemedText>
              <ThemedText className="text-[#8E8E93] text-base text-center">
                Track your meetings easily
              </ThemedText>
            </View>

            <View className="bg-[#2C2C2E] rounded-2xl p-6 shadow-lg shadow-black/30">
              {!isLogin && (
                <View className="mb-5">
                  <ThemedText className="text-white text-base font-semibold mb-2">
                    Full Name
                  </ThemedText>
                  <TextInput
                    className="h-12 border border-[#3A3A3C] rounded-xl px-4 text-base text-white bg-[#1C1C1E]"
                    placeholder="John Doe"
                    placeholderTextColor="#666"
                    value={fullName}
                    onChangeText={setFullName}
                  />
                </View>
              )}

              <View className="mb-5">
                <ThemedText className="text-white text-base font-semibold mb-2">
                  Email Address
                </ThemedText>
                <TextInput
                  className="h-12 border border-[#3A3A3C] rounded-xl px-4 text-base text-white bg-[#1C1C1E]"
                  placeholder="johndoe@gmail.com"
                  placeholderTextColor="#666"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View className="mb-5">
                <ThemedText className="text-white text-base font-semibold mb-2">
                  Password
                </ThemedText>
                <TextInput
                  className="h-12 border border-[#3A3A3C] rounded-xl px-4 text-base text-white bg-[#1C1C1E]"
                  placeholder="Enter your password"
                  placeholderTextColor="#666"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
                {showPasswordError && (
                  <ThemedText className="text-[#FF3B30] text-sm mt-2">
                    Incorrect Password, Please try again
                  </ThemedText>
                )}
              </View>

              <TouchableOpacity
                className={`py-4 rounded-xl items-center mb-5 ${
                  isButtonDisabled ? "bg-[#333]" : "bg-white"
                }`}
                onPress={handleAuth}
                disabled={isButtonDisabled}
              >
                <ThemedText
                  className={`text-base font-semibold ${
                    isButtonDisabled ? "text-[#666]" : "text-[#1C1C1E]"
                  }`}
                >
                  {isSubmitting
                    ? "Please wait..."
                    : isLogin
                      ? "Sign In"
                      : "Sign Up"}
                </ThemedText>
              </TouchableOpacity>

              <TouchableOpacity
                className="items-center"
                onPress={() => {
                  setIsLogin(!isLogin);
                  setShowPasswordError(false);
                }}
              >
                <ThemedText className="text-[#8E8E93] text-sm">
                  {isLogin
                    ? "Don't have an account? "
                    : "Already have an account? "}
                  <ThemedText className="font-semibold underline">
                    {isLogin ? "Sign Up" : "Login"}
                  </ThemedText>
                </ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}


/** ios: 389545278027-t98ietaafotkfn9gia2g2tibsp0ffitd.apps.googleusercontent.com */