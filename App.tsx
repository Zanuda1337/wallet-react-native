import * as SplashScreen from "expo-splash-screen";
import React, { useCallback, useEffect } from "react";
import { SafeAreaView, StatusBar, StyleSheet } from "react-native";
import { useFonts } from "expo-font";
import Router from "features/router/Router";
import { theme } from "src/assets/styles/theme";
import { Provider } from "react-redux";
import { persistor, store } from "src/store";
import { PersistGate } from "redux-persist/integration/react";
import ConnectedIntlProvider from "src/providers/connectedIntlProvider/ConnectedIntlProvider";
import MomentProvider from "src/providers/momentProvider/MomentProvider";
import {formatMoney} from "src/utils";

const App = () => {
  const [fontsLoaded] = useFonts({
    "Inter-ExtraLight": require("./src/assets/fonts/Inter-ExtraLight.ttf"),
    "Inter-Light": require("./src/assets/fonts/Inter-Light.ttf"),
    "Inter-Thin": require("./src/assets/fonts/Inter-Thin.ttf"),
    "Inter-Regular": require("./src/assets/fonts/Inter-Regular.ttf"),
    "Inter-Medium": require("./src/assets/fonts/Inter-Medium.ttf"),
    "Inter-Bold": require("./src/assets/fonts/Inter-Bold.ttf"),
    "Inter-SemiBold": require("./src/assets/fonts/Inter-SemiBold.ttf"),
    "Inter-ExtraBold": require("./src/assets/fonts/Inter-ExtraBold.ttf"),
    "Inter-Black": require("./src/assets/fonts/Inter-Black.ttf"),
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
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ConnectedIntlProvider>
          <MomentProvider>
            <SafeAreaView
              onLayout={onLayout}
              style={{ ...styles.container, ...StyleSheet.absoluteFillObject }}
            >
              <Router />
            </SafeAreaView>
          </MomentProvider>
        </ConnectedIntlProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    marginTop: StatusBar.currentHeight || 0,
    flex: 1,
    backgroundColor: theme.colors.background,
  },
});
