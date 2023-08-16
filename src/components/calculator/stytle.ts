import {createStyles} from "src/utils";export const calculatorStyles = createStyles(theme => ({	calculator: {		display: "flex",		flex: 1	},	container: {		padding: 18	},	display: {		flexGrow: 1,		gap: 35,		backgroundColor: theme.colors.background	},	textContainer: {		width: '100%',		alignItems: "flex-end",	},	keyboard: {		backgroundColor: theme.colors.lightgray,		flexDirection: 'row',		flexWrap: 'wrap',		gap: 20	},	key: {	},	keyText: {		fontFamily: 'Inter-Regular',		fontSize: 30,		color: theme.colors.foreground,	},	highlightedKey: {},	text: {		fontFamily: 'Inter-SemiBold',		fontSize: 50,		color: theme.colors.foreground,	},	subtext: {		fontFamily: 'Inter-SemiBold',		fontSize: 40,		color: theme.colors.foreground,	},	symbol: {},	svg: {}}))