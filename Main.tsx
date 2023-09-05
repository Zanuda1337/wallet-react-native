import * as SplashScreen from "expo-splash-screen";
import React, { useCallback, useEffect } from "react";
import {
  SafeAreaView,
  StatusBar,
  StyleSheet
} from "react-native";
import { useFonts } from "expo-font";
import Router from "features/router/Router";
import { createStyles } from "src/utils";
import { useStyles, useTheme } from "src/hooks";
import { useAppSelector, useBoundActions } from "src/store/hooks";
import { settingsActions } from "features/settings/Settings.slice";
import NoticeProvider from "src/providers/noticeProvider/NoticeProvider";
import { transactionsActions } from "src/features/transactions/Transactions.slice";
import { useIntl } from "react-intl";
import * as NavigationBar from "expo-navigation-bar";

const Main = () => {
  const initialized = useAppSelector(
    (state) => state.settingsReducer.initialized
  );
  const theme = useTheme();
  const items = useAppSelector((state) => state.transactionsReducer.items);
  const intl = useIntl();
  const boundActions = useBoundActions({
    ...settingsActions,
    ...transactionsActions,
  });
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
      // await SplashScreen.preventAutoHideAsync();
      await SplashScreen.hideAsync()
    }
    prepare();
    boundActions.repeatTransactions();
  }, []);

  useEffect(() => {
    if (!initialized) {
      boundActions.init();
    }
    else if (!items.length) boundActions.addDefaultItems(intl);
  }, [initialized]);

  useEffect(() => {
    const updateNav = async () => {
      await NavigationBar.setBackgroundColorAsync(theme.colors.background);
      await NavigationBar.setButtonStyleAsync(
        theme.mode === "light" ? "dark" : "light"
      );
    };
    updateNav();
  }, [theme.mode]);

  const onLayout = useCallback(async () => {
    // if (fontsLoaded) await SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  const style = useStyles(appStyles);

  return (
    <SafeAreaView
      onLayout={onLayout}
      style={{
        ...style.container,
        ...StyleSheet.absoluteFillObject,
      }}
    >
      <StatusBar
        backgroundColor={theme.colors.background}
        barStyle={theme.mode === "light" ? "dark-content" : "light-content"}
      />
      <NoticeProvider>
        <Router />
      </NoticeProvider>
    </SafeAreaView>
  );
};

export default Main;

const appStyles = createStyles((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
}));
