import {createStyles} from "src/utils";export const headerStyles = createStyles(theme =>({  header: {    flexDirection: "row",    justifyContent: "space-between",    alignItems: "center",    paddingVertical: 26,  },  headerTitle: {    fontSize: 18,    fontWeight: "500",    color: theme.colors.foreground,    fontFamily: 'Inter-Medium',  },  svg: {    fill: 'red',    height: 10  },}));