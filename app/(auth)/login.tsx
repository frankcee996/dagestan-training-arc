import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';
import { Mascot } from '../../src/components/Mascot';
import { PrimaryButton } from '../../src/components/PrimaryButton';
import { colors, radii, spacing } from '../../src/theme';
import { logIn } from '../../src/firebase/auth';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError(null);
    if (!email || !password) {
      setError('Enter your email and password.');
      return;
    }
    setLoading(true);
    try {
      await logIn(email, password);
      // Auth state listener + index.tsx route the user onward automatically.
      router.replace('/');
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
      <Mascot size={100} breathe={false} />
      <Text style={styles.brand}>2–3 YEARS DAGESTAN</Text>
      <Text style={styles.heading}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor={colors.steel}
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor={colors.steel}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {error && <Text style={styles.error}>{error}</Text>}

      <View style={{ marginTop: spacing.md, width: '100%' }}>
        <PrimaryButton label="Login" onPress={handleLogin} loading={loading} />
      </View>

      <Pressable onPress={() => router.push('/(auth)/forgot-password')}>
        <Text style={styles.link}>Forgot password?</Text>
      </Pressable>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Don't have an account?</Text>
        <Pressable onPress={() => router.push('/(auth)/signup')}>
          <Text style={styles.link}>Create Account</Text>
        </Pressable>
      </View>
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
  brand: {
    color: colors.steel,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginTop: spacing.md,
  },
  heading: {
    color: colors.white,
    fontSize: 24,
    fontWeight: '800',
    textTransform: 'uppercase',
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
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
  },
  link: {
    color: colors.white,
    fontWeight: '700',
    marginTop: spacing.lg,
    textDecorationLine: 'underline',
  },
  footer: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.xl,
    alignItems: 'center',
  },
  footerText: {
    color: colors.steel,
  },
});
