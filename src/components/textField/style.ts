import {createStyles} from "src/utils";export const textFieldStyles = createStyles(theme => ({  textContainer: {    display: "flex",    justifyContent: "flex-end",    flex: 1,  },	multiline: {		flexDirection: 'column',		alignItems: 'flex-start'	},	multilineText: {		width: '100%'	}}));