import 'react-native-get-random-values';
import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { AuthProvider } from '../contexts/AuthContext.jsx';
import { setupNotifications } from '../notifications/setup';
import { useThemeColor } from '../hooks/useThemeColor';

export default function Layout() {
  const { colors } = useThemeColor();

  useEffect(() => {
    setupNotifications();
  }, []);

  return (
    <AuthProvider>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.card },
          headerTitleStyle: { color: colors.text },
          headerTintColor: colors.text,
        }}
      />
    </AuthProvider>
  );
}
