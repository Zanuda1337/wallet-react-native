import React, { createContext } from "react";
import { useAppSelector } from "src/store/hooks";
import {Dimensions, StyleSheet, useColorScheme} from "react-native";

type TThemeProviderProps = {
  children: JSX.Element;
};
export type Theme = ReturnType<typeof createTheme>;


type Colors = typeof darkThemeColors;

const darkThemeColors = {
  primary: "#3660c1",
  secondary: "#DD82EC",
  background: "#232323",
  foreground: "#ffffff",
  subtext: "#b1b1b1",
  icons: "#e0e0e0",
  pale: "#6a6a6a",
  paleText: "#d7d7d7",
  blue: "#0d91c6",
  green: "#47bb72",
  red: "#db5647",
  gray: "#585858",
  lightgray: "#313131",
  error: "#ff7262",
  warning: "#efb127",
  commonShadow: "#000000",
  popUp: '#313131',
  checkboxChecked: '#fff',
  independentForeground: '#fff',
  selectBackground: '#313131',
  success: '#26DD38',
  primaryLight: '#a9c1fa'
};
const lightThemeColors = {
  primary: "#2D79FF",
  secondary: "#DD82EC",
  background: "#efefef",
  foreground: "#444d5a",
  subtext: "#b1b1b1",
  icons: "#fff",
  pale: "#d7d7d7",
  paleText: '#7d7d7d',
  blue: "#1abcfe",
  green: "#5BDF8A",
  red: "#ff7262",
  gray: "#e0e0e0",
  lightgray: "#f3f3f3",
  error: "#ff7262",
  warning: "#efb127",
  commonShadow: "#808080",
  popUp: '#ffffff',
  checkboxChecked: '#fff',
  independentForeground: '#fff',
  selectBackground: '#232323',
  success: '#26DD38',
  primaryLight: '#8aa8ec'
};

export const createTheme = (
  lightThemeColors: Colors,
  darkThemeColors: Colors,
  mode: "light" | "dark"
) => {
  const colors = mode === "light" ? lightThemeColors : darkThemeColors;
  return {
    mode,
    colors,
    styles: StyleSheet.create({
      circle: {
        borderRadius: 50,
        width: 56,
        height: 56,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      },
      outline: { borderWidth: 1.5, borderColor: colors.pale },
      filled: { backgroundColor: colors.primary },
      title: {
        fontWeight: "600",
        color: colors.foreground,
        fontSize: 20,
        fontFamily: "Inter-SemiBold",
        textTransform: "capitalize",
      },
      container: {
        display: "flex",
        paddingHorizontal: 18,
        paddingVertical: 10,
        gap: 20,
      },
      item: {
        display: "flex",
        justifyContent: "space-between",
        flexDirection: "row",
        borderBottomColor: colors.pale,
        borderBottomWidth: 1,
        paddingVertical: 10,
        alignItems: "center",
        gap: 10,
        zIndex: 1,
      },
      label: {
        fontFamily: "Inter-SemiBold",
        fontSize: 14,
        color: colors.subtext,
        textTransform: "capitalize",
        zIndex: -1,
      },
      value: {
        fontFamily: "Inter-SemiBold",
        fontSize: 16,
        color: colors.foreground,
      },
      dialogueText: {
        fontFamily: "Inter-Medium",
        fontSize: 16,
        color: colors.foreground,
      },
      messagePopupArrow: {
        position: "absolute",
        width: 15,
        height: 15,
        top: 35,
        left: 14,
        backgroundColor: colors.foreground,
        transform: [{ rotate: "45deg" }],
      },
      messagePopupContainer: {
        position: "absolute",
        top: 40,
        left: 0,
        backgroundColor: colors.foreground,
        borderRadius: 10,
        paddingVertical: 5,
        paddingHorizontal: 12,
        maxWidth: Dimensions.get("screen").width - 36,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        zIndex: 1,
      },
      messagePopup: {
        color: colors.background,
        fontFamily: "Inter-Regular",
        fontSize: 13,
        maxWidth: Dimensions.get("screen").width - 36 - 12,
      },
    }),
  };
};

export const ThemeContext = createContext<Theme>(
  createTheme(darkThemeColors, lightThemeColors, "light")
);

const ThemeProvider: React.FC<TThemeProviderProps> = ({ children }) => {
  const themeType = useAppSelector((state) => state.settingsReducer.theme) || 'light';
  const systemTheme = useColorScheme() || 'light'
  const newTheme =
    themeType === "system" ? systemTheme : themeType;
  return (
    <ThemeContext.Provider
      value={createTheme(lightThemeColors, darkThemeColors, newTheme)}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
