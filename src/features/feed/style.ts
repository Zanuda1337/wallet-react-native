import {createStyles} from "src/utils";import {Dimensions} from "react-native";export const feedStyles = createStyles(theme => ({	container: {		paddingHorizontal: 20,		display: 'flex',		flexDirection: 'row',		alignItems: 'center',		gap: 20,		backgroundColor: theme.colors.background,		marginVertical: -5,		paddingVertical: 5,		borderRadius: 30,	},	back: {		position: 'absolute',		top: -5,		// left: 18,		paddingVertical: 5,		paddingHorizontal: 10,		backgroundColor: theme.colors.popUp,		width: Dimensions.get('screen').width - 38,		borderRadius: 30,		display: 'flex',		flexDirection: 'row',		justifyContent: 'space-between'	},	hiddenIcon: {		position: "absolute",		paddingTop: 10,		width: 50,		height: 50,		display: "flex",		justifyContent: "center",		alignItems: "center",	},	circle: {		width: 50,		height: 50	},	textContainer: {		display: 'flex',		justifyContent: 'center',		flexGrow: 1	},	from: {		fontSize: 14,		fontFamily: 'Inter-Regular',		color: theme.colors.subtext	},	to: {		fontSize: 14,		fontFamily: 'Inter-Medium',		color: theme.colors.foreground	},	row: {		display: 'flex',		justifyContent: 'space-between',		flexDirection: 'row',		flexShrink: 1	},	price: {		fontSize: 16,		fontFamily: 'Inter-SemiBold',	}}))