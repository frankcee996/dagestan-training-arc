import React from 'react';
import { Tabs } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { colors } from '../../src/theme';

// Minimalist white line icons; selected item uses the Training Red accent (spec section 10).
// Swap these Views for an icon set (e.g. lucide-react-native) in production.
function TabDot({ focused }: { focused: boolean }) {
  return <View style={[styles.dot, focused && styles.dotFocused]} />;
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: colors.obsidian, borderTopColor: colors.carbon },
        tabBarActiveTintColor: colors.red,
        tabBarInactiveTintColor: colors.steel,
        tabBarLabelStyle: { fontWeight: '700', fontSize: 11, textTransform: 'uppercase' },
      }}
    >
      <Tabs.Screen name="home" options={{ title: 'Home', tabBarIcon: TabDot }} />
      <Tabs.Screen name="train" options={{ title: 'Train', tabBarIcon: TabDot }} />
      <Tabs.Screen name="missions" options={{ title: 'Missions', tabBarIcon: TabDot }} />
      <Tabs.Screen name="progress" options={{ title: 'Progress', tabBarIcon: TabDot }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile', tabBarIcon: TabDot }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.steel,
  },
  dotFocused: {
    backgroundColor: colors.red,
  },
});
