import { StyleSheet } from "react-native";import { theme } from "src/assets/styles/theme";export const style = StyleSheet.create({  button: {    borderRadius: 10,    padding: 12,    display: "flex",    justifyContent: "center",	  flexDirection: "row"  },  buttonText: {    fontFamily: "Inter-SemiBold",    fontSize: 16,    color: theme.colors.background,    textTransform: "capitalize"  },});