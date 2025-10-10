import { ThemedText } from '@/components/ThemedText';
import React, { useState } from 'react';
import { 
  Alert, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  View, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/AuthContext';

export default function AuthScreen() {
  const { login, register, isLoading } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPasswordError, setShowPasswordError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAuth = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (!isLogin && !fullName.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
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
          Alert.alert('Login Failed', 'Invalid email or password');
        }
      } else {
        success = await register(fullName.trim(), email.trim(), password);
        if (!success) {
          Alert.alert('Signup Failed', 'Error creating account. Please try again.');
        }
      }

      if (success) {
        // Auth context will handle navigation automatically
        console.log('Authentication successful');
      }
    } catch (error) {
      console.error('Auth error:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = email.trim() && password.trim() && (isLogin || fullName.trim());
  const isButtonDisabled = !isFormValid || isSubmitting || isLoading;

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView 
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            {/* Branding */}
            <View style={styles.branding}>
              <View style={styles.logo}>
                <ThemedText style={styles.logoText}>K</ThemedText>
              </View>
              <ThemedText style={styles.appName}>Kalender</ThemedText>
              <ThemedText style={styles.tagline}>Track your meetings easily</ThemedText>
            </View>

            {/* Auth Form */}
            <View style={styles.authContainer}>
              {!isLogin && (
                <View style={styles.inputGroup}>
                  <ThemedText style={styles.label}>Full Name</ThemedText>
                  <TextInput
                    style={styles.textInput}
                    placeholder="John Doe"
                    placeholderTextColor="#666"
                    value={fullName}
                    onChangeText={setFullName}
                  />
                </View>
              )}

              <View style={styles.inputGroup}>
                <ThemedText style={styles.label}>Email Address</ThemedText>
                <TextInput
                  style={styles.textInput}
                  placeholder="johndoe@gmail.com"
                  placeholderTextColor="#666"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputGroup}>
                <ThemedText style={styles.label}>Password</ThemedText>
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter your password"
                  placeholderTextColor="#666"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
                {showPasswordError && (
                  <ThemedText style={styles.errorText}>
                    Incorrect Password, Please try again
                  </ThemedText>
                )}
              </View>

              <TouchableOpacity
                style={[
                  styles.authButton,
                  { backgroundColor: isButtonDisabled ? '#333' : 'white' }
                ]}
                onPress={handleAuth}
                disabled={isButtonDisabled}
              >
                <ThemedText
                  style={[
                    styles.authButtonText,
                    { color: isButtonDisabled ? '#666' : '#1C1C1E' }
                  ]}
                >
                  {isSubmitting ? 'Please wait...' : (isLogin ? 'Sign In' : 'Sign Up')}
                </ThemedText>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.switchAuth}
                onPress={() => {
                  setIsLogin(!isLogin);
                  setShowPasswordError(false);
                }}
              >
                <ThemedText style={styles.switchAuthText}>
                  {isLogin ? "Don't have an account? " : "Already have an account? "}
                  <ThemedText style={styles.switchAuthLink}>
                    {isLogin ? 'Sign Up' : 'Login'}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1C1E',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  branding: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 60,
    height: 60,
    backgroundColor: 'white',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoText: {
    color: '#1C1C1E',
    fontSize: 32,
    fontWeight: 'bold',
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
  },
  authContainer: {
    backgroundColor: '#2C2C2E',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  separator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#3A3A3C',
  },
  separatorText: {
    marginHorizontal: 16,
    color: '#8E8E93',
    fontSize: 14,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginBottom: 8,
  },
  textInput: {
    height: 50,
    borderWidth: 1,
    borderColor: '#3A3A3C',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: 'white',
    backgroundColor: '#1C1C1E',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 14,
    marginTop: 8,
  },
  authButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  authButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  switchAuth: {
    alignItems: 'center',
  },
  switchAuthText: {
    fontSize: 14,
    color: '#8E8E93',
  },
  switchAuthLink: {
    textDecorationLine: 'underline',
    color: 'white',
    fontWeight: '600',
  },
});
