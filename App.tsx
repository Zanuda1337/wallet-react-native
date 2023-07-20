import {StyleSheet} from 'react-native'
import * as SplashScreen from 'expo-splash-screen';
import React, { useCallback, useEffect } from 'react';
import {SafeAreaView, StatusBar} from 'react-native';
import { useFonts } from 'expo-font';
import Router from "features/router/Router";
import {colors} from "src/assets/styles/styles";

export default function App() {
  const [fontsLoaded] = useFonts({
    'Inter-ExtraLight': require('./src/assets/fonts/Inter-ExtraLight.ttf'),
    'Inter-Light': require('./src/assets/fonts/Inter-Light.ttf'),
    'Inter-Thin': require('./src/assets/fonts/Inter-Thin.ttf'),
    'Inter-Regular': require('./src/assets/fonts/Inter-Regular.ttf'),
    'Inter-Medium': require('./src/assets/fonts/Inter-Medium.ttf'),
    'Inter-Bold': require('./src/assets/fonts/Inter-Bold.ttf'),
    'Inter-SemiBold': require('./src/assets/fonts/Inter-SemiBold.ttf'),
    'Inter-ExtraBold': require('./src/assets/fonts/Inter-ExtraBold.ttf'),
    'Inter-Black': require('./src/assets/fonts/Inter-Black.ttf'),
  });

  useEffect(() => {
    async function prepare() {
      await SplashScreen.preventAutoHideAsync();
    }
    prepare();
  }, []);

  const onLayout = useCallback(async () => {
    if (fontsLoaded) await SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    // <Provider store={store}>
      <SafeAreaView onLayout={onLayout} style={styles.container}>
        <Router />
      </SafeAreaView>
    // </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: StatusBar.currentHeight || 0,
    // flex: 1,
    backgroundColor: colors.background,
    // alignItems: "center",
    // justifyContent: "center",
  },
});
