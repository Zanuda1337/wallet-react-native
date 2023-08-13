import { StyleSheet } from "react-native";import {theme} from "src/assets/styles/theme";export const style = StyleSheet.create({  container: {    position: "absolute",    bottom: 0,    left: 0,    width: "100%",  },  widget: {    display: "flex",    justifyContent: "space-between",	  backgroundColor: theme.colors.background,	  alignItems: "center",	  flexDirection: "row",		height: 77,	  paddingVertical: 25,	  paddingHorizontal: 28,	  borderRadius: 38,	  shadowColor: "#808080",	  shadowOpacity: 0.5,	  shadowRadius: 15,	  elevation: 7,  },});