import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable } from 'react-native';
import { router } from 'expo-router';
import { PrimaryButton } from '../../src/components/PrimaryButton';
import { colors, radii, spacing } from '../../src/theme';
import { resetPassword } from '../../src/firebase/auth';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'sent' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    setError(null);
    if (!email) {
      setError('Enter the email on your account.');
      return;
    }
    setLoading(true);
    try {
      await resetPassword(email);
      setStatus('sent');
    } catch (err: any) {
      setStatus('error');
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Reset Password</Text>
      {status === 'sent' ? (
        <Text style={styles.info}>
          If an account exists for that email, a password reset link is on its way.
        </Text>
      ) : (
        <>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor={colors.steel}
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          {error && <Text style={styles.error}>{error}</Text>}
          <View style={{ width: '100%', marginTop: spacing.md }}>
            <PrimaryButton label="Send Reset Link" onPress={handleReset} loading={loading} />
          </View>
        </>
      )}
      <Pressable onPress={() => router.back()}>
        <Text style={styles.link}>Back to Login</Text>
      </Pressable>
    </View>
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
  info: {
    color: colors.steel,
    textAlign: 'center',
    marginBottom: spacing.lg,
    lineHeight: 20,
  },
  error: {
    color: colors.red,
    marginBottom: spacing.sm,
    fontSize: 13,
  },
  link: {
    color: colors.white,
    fontWeight: '700',
    marginTop: spacing.xl,
    textDecorationLine: 'underline',
  },
});
