import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { UserProvider } from '../src/state/UserContext';
import { colors } from '../src/theme';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.obsidian }}>
      <UserProvider>
        <StatusBar style="light" backgroundColor={colors.obsidian} />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.obsidian },
          }}
        />
      </UserProvider>
    </GestureHandlerRootView>
  );
}
