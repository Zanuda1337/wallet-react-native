import {createStyles} from "src/utils";export const dialogueStyles = createStyles(theme =>({  backdrop: {    backgroundColor: "rgba(0,0,0,0.5)",	  width: '100%',	  height: '100%',	  display: "flex",	  justifyContent: "center",	  alignItems: "center",	  padding: 30,  },	header: {		paddingVertical: 0,		paddingHorizontal: 0,	},	wrapper: {  	padding: 18,  	backgroundColor: theme.colors.popUp,		width: '100%',		borderRadius: 25	},	content: {  	paddingVertical: 18,		gap: 10,	},	footer: {  	display: "flex",		flexWrap: "wrap",		flexDirection: "row",		gap: 15,	},	button: {  	flex: 1	},	leftButton: {  	backgroundColor: theme.colors.pale	},	leftButtonText: {  	color: theme.colors.paleText,	}}));