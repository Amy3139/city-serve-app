import { auth } from '@/config/firebase';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useRouter } from 'expo-router';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function SignupScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({
    email: false,
    password: false,
    confirmPassword: false,
  });
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  // Email validation
  const validateEmail = (value: string) => {
    if (!value) {
      return 'Email is required';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return 'Please enter a valid email address';
    }
    return '';
  };

  // Password validation
  const validatePassword = (value: string) => {
    if (!value) {
      return 'Password is required';
    }
    if (value.length < 8) {
      return 'Password must be at least 8 characters';
    }
    if (!/[a-z]/.test(value)) {
      return 'Password must contain a lowercase letter';
    }
    if (!/[A-Z]/.test(value)) {
      return 'Password must contain an uppercase letter';
    }
    if (!/[0-9]/.test(value)) {
      return 'Password must contain a number';
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
      return 'Password must contain a special character';
    }
    return '';
  };

  // Confirm password validation
  const validateConfirmPassword = (value: string) => {
    if (!value) {
      return 'Please confirm your password';
    }
    if (value !== password) {
      return 'Passwords do not match';
    }
    return '';
  };

  // Handle email change
  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (touched.email) {
      setEmailError(validateEmail(value));
    }
  };

  // Handle password change
  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (touched.password) {
      setPasswordError(validatePassword(value));
    }
    // Re-validate confirm password if it's been touched
    if (touched.confirmPassword && confirmPassword) {
      setConfirmPasswordError(value !== confirmPassword ? 'Passwords do not match' : '');
    }
  };

  // Handle confirm password change
  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value);
    if (touched.confirmPassword) {
      setConfirmPasswordError(validateConfirmPassword(value));
    }
  };

  // Handle field blur
  const handleBlur = (field: 'email' | 'password' | 'confirmPassword') => {
    setTouched({ ...touched, [field]: true });
    
    if (field === 'email') {
      setEmailError(validateEmail(email));
    } else if (field === 'password') {
      setPasswordError(validatePassword(password));
    } else if (field === 'confirmPassword') {
      setConfirmPasswordError(validateConfirmPassword(confirmPassword));
    }
  };

  const handleSignup = async () => {
    // Mark all fields as touched
    setTouched({
      email: true,
      password: true,
      confirmPassword: true,
    });

    // Validate all fields
    const emailValidation = validateEmail(email);
    const passwordValidation = validatePassword(password);
    const confirmPasswordValidation = validateConfirmPassword(confirmPassword);

    setEmailError(emailValidation);
    setPasswordError(passwordValidation);
    setConfirmPasswordError(confirmPasswordValidation);

    // If any validation fails, stop
    if (emailValidation || passwordValidation || confirmPasswordValidation) {
      Alert.alert('Validation Error', 'Please fix the errors before continuing');
      return;
    }

    // Create user account with Firebase
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      Alert.alert(
        'Success', 
        'Account created successfully!',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error: any) {
      // Handle Firebase errors
      let errorMessage = 'Failed to create account. Please try again.';
      
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'This email is already registered. Please sign in instead.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address.';
      } else if (error.code === 'auth/operation-not-allowed') {
        errorMessage = 'Email/password accounts are not enabled. Please contact support.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak. Please use a stronger password.';
      }
      
      Alert.alert('Signup Failed', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.formContainer}>
          <Text style={[styles.title, { color: colors.text }]}>Create Account</Text>
          <Text style={[styles.subtitle, { color: colors.text }]}>
            Sign up to get started
          </Text>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.text }]}>Email</Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colorScheme === 'dark' ? '#333' : '#f5f5f5',
                  color: colors.text,
                  borderColor: emailError ? '#ef4444' : colors.text + '20',
                  borderWidth: emailError ? 2 : 1,
                },
              ]}
              placeholder="Enter your email"
              placeholderTextColor={colors.text + '60'}
              value={email}
              onChangeText={handleEmailChange}
              onBlur={() => handleBlur('email')}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />
            {emailError && touched.email ? (
              <Text style={styles.errorText}>{emailError}</Text>
            ) : null}
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.text }]}>Password</Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colorScheme === 'dark' ? '#333' : '#f5f5f5',
                  color: colors.text,
                  borderColor: passwordError ? '#ef4444' : colors.text + '20',
                  borderWidth: passwordError ? 2 : 1,
                },
              ]}
              placeholder="Enter your password"
              placeholderTextColor={colors.text + '60'}
              value={password}
              onChangeText={handlePasswordChange}
              onBlur={() => handleBlur('password')}
              secureTextEntry
              autoCapitalize="none"
              autoComplete="password-new"
            />
            {passwordError && touched.password ? (
              <Text style={styles.errorText}>{passwordError}</Text>
            ) : null}
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.text }]}>Confirm Password</Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colorScheme === 'dark' ? '#333' : '#f5f5f5',
                  color: colors.text,
                  borderColor: confirmPasswordError ? '#ef4444' : colors.text + '20',
                  borderWidth: confirmPasswordError ? 2 : 1,
                },
              ]}
              placeholder="Confirm your password"
              placeholderTextColor={colors.text + '60'}
              value={confirmPassword}
              onChangeText={handleConfirmPasswordChange}
              onBlur={() => handleBlur('confirmPassword')}
              secureTextEntry
              autoCapitalize="none"
              autoComplete="password-new"
            />
            {confirmPasswordError && touched.confirmPassword ? (
              <Text style={styles.errorText}>{confirmPasswordError}</Text>
            ) : null}
          </View>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.tint }]}
            onPress={handleSignup}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Sign Up</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={[styles.backButtonText, { color: colors.tint }]}>
              Already have an account? Sign in
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 32,
    textAlign: 'center',
    opacity: 0.7,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    borderWidth: 1,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  button: {
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  backButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 14,
  },
});
