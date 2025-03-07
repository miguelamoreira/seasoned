import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import UserProvider, { useUserContext, UserContext } from '@/contexts/UserContext';

import { useColorScheme } from '@/hooks/useColorScheme';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    Caprasimo: require('../assets/fonts/Caprasimo-Regular.ttf'),
    Arimo: require('../assets/fonts/Arimo-VariableFont_wght.ttf'),
    DMSerifText: require('../assets/fonts/DMSerifText-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <UserProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index"/>
          <Stack.Screen name="signin"/>
          <Stack.Screen name="register"/>
          <Stack.Screen name="homepage"/>
          <Stack.Screen name="popularShows"/>
          <Stack.Screen name="popularReviews"/>
          <Stack.Screen name="search"/>
          <Stack.Screen name="main"/>
          <Stack.Screen name="notifications"/>
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </UserProvider>
  );
}
