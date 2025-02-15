import * as SplashScreen from "expo-splash-screen";
import React, { useCallback, useEffect, useState } from "react";
import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
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
import Dialogue from "src/components/dialogue/Dialogue";
import SvgSelector from "src/components/svgSelector/SvgSelector";
import Header from "src/components/header/Header";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Main = () => {
  const initialized = useAppSelector(
    (state) => state.settingsReducer.initialized
  );
  const theme = useTheme();
  const items = useAppSelector((state) => state.transactionsReducer.items);
  const [open, setOpen] = useState(true);
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

  const handleClose = () => {
    setOpen(false);
  };
  const handleSubmit = () => {
    void AsyncStorage.setItem('cash_keeper_last_version', '1.0.3');
    handleClose()
  };

  useEffect(() => {
    async function prepare() {
      // await SplashScreen.preventAutoHideAsync();
      await SplashScreen.hideAsync();
      const version = await AsyncStorage.getItem('cash_keeper_last_version') || '1.0.0';
      setOpen(version !== '1.0.3');
    }
    prepare();
    boundActions.repeatTransactions();
  }, []);

  useEffect(() => {
    if (!initialized) {
      boundActions.init();
    } else if (!items.length) boundActions.addDefaultItems(intl);
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
        <>
          <Dialogue
            visible={open}
            cancelButtonProps={{ visible: false }}
            submitButtonProps={{ text: "continue", onPress: handleSubmit }}
            onBackdropPress={handleClose}
            onClose={handleClose}
            styles={{
              root: {
                padding: 0,
                maxHeight: Dimensions.get("screen").height * 0.6,
                overflow: "hidden",
                flexGrow: 1,
                paddingBottom: 60,
              },
              footer: {
                padding: 14,
                marginTop: -64,
              },
            }}
            header={
              <Header
                styles={{
                  root: {
                    marginBottom: -28,
                  },
                }}
                label={"v1.0.3, 15-02-2024"}
                leftButtonProps={{ visible: false }}
                rightButtonProps={{
                  onPress: handleClose,
                  icon: (
                    <SvgSelector
                      id="multiply"
                      stroke={theme.colors.foreground}
                      size={20}
                    />
                  ),
                  size: 42,
                }}
              />
            }
          >
            <View style={{ height: "100%" }}>
              <ScrollView>
                <Text
                  style={{ ...theme.styles.dialogueText, marginVertical: 5 }}
                >
                  Основное
                </Text>
                {[
                  "Добавлена возможность создавать пользовательскую тему",
                  "Добавлена возможность менять ориентацию списков",
                ].map((text) => (
                  <ChangeLogItem key={text} text={text} />
                ))}
                <Text
                  style={{ ...theme.styles.dialogueText, marginVertical: 5 }}
                >
                  Исправления
                </Text>
                {[
                  "Исправлено позиционирование всплывающих контекстных окон",
                ].map((text) => (
                  <ChangeLogItem key={text} text={text} />
                ))}
                <Text
                  style={{ ...theme.styles.dialogueText, marginVertical: 5 }}
                >
                  Разное
                </Text>
                {[
                  "Добавлены новые иконки",
                  "Панель навигации устройства теперь скрыта",
                ].map((text) => (
                  <ChangeLogItem key={text} text={text} />
                ))}
              </ScrollView>
            </View>
          </Dialogue>
          <Router />
        </>
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

const ChangeLogItem: React.FC<{ text: string }> = ({ text }) => {
  const theme = useTheme();
  return (
    <View
      style={{
        display: "flex",
        flexDirection: "row",
        marginVertical: 3,
      }}
    >
      <View
        style={{
          backgroundColor: theme.colors.foreground,
          width: 4,
          height: 4,
          marginTop: 9,
          marginHorizontal: 8,
          borderRadius: 2,
        }}
      />
      <Text
        style={{
          ...theme.styles.value,
          color: theme.colors.subtext,
          fontSize: 13,
        }}
      >
        {text}
      </Text>
    </View>
  );
};
