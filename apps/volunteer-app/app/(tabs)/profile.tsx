import { auth, db } from '@/config/firebase';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function ProfileTab() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [age, setAge] = useState('');
  const [phone, setPhone] = useState('');
  const [waiverConsent, setWaiverConsent] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<{
    firstName?: string;
    lastName?: string;
    age?: string;
    phone?: string;
    waiverConsent?: string;
  }>({});
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  useEffect(() => {
    // Listen for auth state changes to ensure user is loaded before fetching profile
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        loadProfileData(user.uid);
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const loadProfileData = async (userId: string) => {
    try {
      const profileDoc = await getDoc(doc(db, 'profiles', userId));
      if (profileDoc.exists()) {
        const data = profileDoc.data();
        setFirstName(data.firstName || '');
        setLastName(data.lastName || '');
        setAge(data.age ? data.age.toString() : '');
        setPhone(data.phone || '');
        setWaiverConsent(data.waiverConsent || false);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      Alert.alert('Error', 'Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    // Validation with inline errors
    const newErrors: Record<string, string> = {};
    if (!firstName.trim()) newErrors.firstName = 'First name is required';
    if (!lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!age.trim()) newErrors.age = 'Age is required';

    const ageNum = parseInt(age);
    if (age.trim() && (isNaN(ageNum) || ageNum < 1 || ageNum > 120)) {
      newErrors.age = 'Please enter a valid age';
    }

    if (!phone.trim()) newErrors.phone = 'Phone number is required';
    const phoneDigits = phone.replace(/\D/g, '');
    if (phone.trim() && phoneDigits.length < 10) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (!waiverConsent) newErrors.waiverConsent = 'Waiver consent is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      Alert.alert('Error', 'Please fix the errors in the form');
      return;
    }

    setErrors({});

    // Save profile to Firestore
    try {
      const user = auth.currentUser;
      if (!user) {
        Alert.alert('Error', 'You must be logged in to save your profile');
        return;
      }

      // Save profile data to Firestore
      await setDoc(doc(db, 'profiles', user.uid), {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        age: parseInt(age),
        phone: phone.trim(),
        waiverConsent,
        updatedAt: new Date().toISOString(),
      });

      Alert.alert('Success', 'Profile saved successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert('Error', 'Failed to save profile. Please try again.');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.tint} />
          <Text style={[styles.loadingText, { color: colors.text }]}>Loading profile...</Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.formContainer}>
            <Text style={[styles.title, { color: colors.text }]}>Profile</Text>
            <Text style={[styles.subtitle, { color: colors.text }]}>
              Complete your profile information
            </Text>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.text }]}>
              First Name
              <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colorScheme === 'dark' ? '#333' : '#f5f5f5',
                  color: colors.text,
                  borderColor: errors.firstName ? '#ff4d4f' : colors.text + '20',
                },
              ]}
              placeholder="Enter your first name"
              placeholderTextColor={colors.text + '60'}
              value={firstName}
              onChangeText={setFirstName}
              autoCapitalize="words"
              autoComplete="given-name"
            />
            {errors.firstName ? (
              <Text style={styles.errorText}>{errors.firstName}</Text>
            ) : null}
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.text }]}>
              Last Name
              <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colorScheme === 'dark' ? '#333' : '#f5f5f5',
                  color: colors.text,
                  borderColor: errors.lastName ? '#ff4d4f' : colors.text + '20',
                },
              ]}
              placeholder="Enter your last name"
              placeholderTextColor={colors.text + '60'}
              value={lastName}
              onChangeText={setLastName}
              autoCapitalize="words"
              autoComplete="family-name"
            />
            {errors.lastName ? (
              <Text style={styles.errorText}>{errors.lastName}</Text>
            ) : null}
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.text }]}>
              Age
              <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colorScheme === 'dark' ? '#333' : '#f5f5f5',
                  color: colors.text,
                  borderColor: errors.age ? '#ff4d4f' : colors.text + '20',
                },
              ]}
              placeholder="Enter your age"
              placeholderTextColor={colors.text + '60'}
              value={age}
              onChangeText={setAge}
              keyboardType="number-pad"
              maxLength={3}
            />
            {errors.age ? <Text style={styles.errorText}>{errors.age}</Text> : null}
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.text }]}>
              Phone
              <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colorScheme === 'dark' ? '#333' : '#f5f5f5',
                  color: colors.text,
                  borderColor: errors.phone ? '#ff4d4f' : colors.text + '20',
                },
              ]}
              placeholder="Enter your phone number"
              placeholderTextColor={colors.text + '60'}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              autoComplete="tel"
            />
            {errors.phone ? (
              <Text style={styles.errorText}>{errors.phone}</Text>
            ) : null}
          </View>

          <View style={styles.waiverContainer}>
            <View style={styles.waiverTextContainer}>
              <Text style={[styles.label, { color: colors.text, marginBottom: 4 }]}>
                  Waiver Consent
                  <Text style={styles.required}>*</Text>
                </Text>
              <Text style={[styles.waiverText, { color: colors.text }]}>
                I agree to the terms and conditions of the waiver
              </Text>
            </View>
            <Switch
              value={waiverConsent}
              onValueChange={setWaiverConsent}
              trackColor={{ false: '#767577', true: colors.tint + '80' }}
              thumbColor={waiverConsent ? colors.tint : '#f4f3f4'}
            />
            {errors.waiverConsent ? (
              <Text style={styles.errorText}>{errors.waiverConsent}</Text>
            ) : null}
          </View>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.tint }]}
            onPress={handleSaveProfile}
          >
            <Text style={styles.buttonText}>Save Profile</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
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
  waiverContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingVertical: 12,
  },
  waiverTextContainer: {
    flex: 1,
    marginRight: 12,
  },
  waiverText: {
    fontSize: 14,
    opacity: 0.7,
  },
  required: {
    color: '#ff4d4f',
    marginLeft: 4,
    fontWeight: '700',
  },
  errorText: {
    color: '#ff4d4f',
    marginTop: 6,
    fontSize: 13,
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
});
