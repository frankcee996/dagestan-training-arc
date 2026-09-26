import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';
import { Mascot } from '../../src/components/Mascot';
import { PrimaryButton } from '../../src/components/PrimaryButton';
import { colors, radii, spacing } from '../../src/theme';
import { signUp } from '../../src/firebase/auth';

export default function SignUpScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    setError(null);
    if (!name || !email || !password || !confirmPassword) {
      setError('Fill in all fields to create your account.');
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }
    setLoading(true);
    try {
      await signUp(name, email, password);
      router.replace('/(onboarding)/onboarding');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Mascot size={90} breathe={false} />
      <Text style={styles.heading}>Create Your Account</Text>

      <TextInput style={styles.input} placeholder="Name" placeholderTextColor={colors.steel} value={name} onChangeText={setName} />
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor={colors.steel}
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput style={styles.input} placeholder="Password" placeholderTextColor={colors.steel} secureTextEntry value={password} onChangeText={setPassword} />
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        placeholderTextColor={colors.steel}
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      {error && <Text style={styles.error}>{error}</Text>}

      <View style={{ marginTop: spacing.md, width: '100%' }}>
        <PrimaryButton label="Create Account" onPress={handleSignUp} loading={loading} />
      </View>

      <Pressable onPress={() => router.back()}>
        <Text style={styles.link}>Already have an account? Login</Text>
      </Pressable>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.obsidian,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  heading: {
    color: colors.white,
    fontSize: 22,
    fontWeight: '800',
    textTransform: 'uppercase',
    marginTop: spacing.md,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    backgroundColor: colors.carbon,
    color: colors.white,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    marginBottom: spacing.md,
  },
  error: {
    color: colors.red,
    marginBottom: spacing.sm,
    fontSize: 13,
    textAlign: 'center',
  },
  link: {
    color: colors.white,
    fontWeight: '700',
    marginTop: spacing.lg,
    textDecorationLine: 'underline',
  },
});
