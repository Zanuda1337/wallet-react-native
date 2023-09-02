import { createStyles } from "src/utils";export const pieChartStyles = createStyles((theme) => ({  container: {    display: "flex",	  paddingTop: 30,  },  pieChart: {    display: "flex",    alignItems: "center",  },	title: {  	fontSize: 20,		color: theme.colors.foreground,		fontFamily: 'Inter-SemiBold'	},  table: {    display: "flex",	  gap: 2,	  paddingTop: 20,	  paddingHorizontal: 10,  },  row: {    display: "flex",    flexDirection: "row",    justifyContent: "space-between",  },  item: {    display: "flex",    flexDirection: "row",    alignItems: "center",    gap: 10,    width: "30%",  },  secondItem: {    width: "30%",	  justifyContent: "flex-end",  },  thirdItem: {    width: "40%",    justifyContent: "flex-end",  },	headTitle: {		fontFamily: "Inter-Bold",		color: theme.colors.foreground,		fontSize: 14,		textTransform: 'capitalize'	},	header: {  	paddingBottom: 5,	},  square: {    width: 10,    height: 10,  },  label: {    fontFamily: "Inter-Regular",    color: theme.colors.foreground,    fontSize: 12,  },}));