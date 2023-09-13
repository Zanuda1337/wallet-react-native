import React from 'react';import {Text, View} from "react-native";import SvgSelector from "src/components/svgSelector/SvgSelector";import Button from "src/components/button/Button";import {useStyles, useTheme} from "src/hooks";import {feedStyles} from "features/feed/style";type TChipProps = {	isActive: boolean;	title: string	cutIfLong?: boolean	onPress?: () => void;}const Chip: React.FC<TChipProps> = ({isActive, title, cutIfLong, onPress}) => {	const style = useStyles(feedStyles);	const theme = useTheme()	return (		<View style={{borderRadius: 8, overflow: "hidden"}}><Button			translate={false}			styles={{root: {paddingVertical: 3, backgroundColor: isActive ? theme.colors.primary : theme.colors.pale}}}			onPress={onPress}		>			<View				style={[style.flexRow, {					gap: 5,				}]}			>				<Text					style={[{						...theme.styles.dialogueText,						color: isActive ? theme.colors.independentForeground : theme.colors.foreground,						fontSize: 14					}, {maxWidth: cutIfLong ? 100 : 'auto'}]}					numberOfLines={1}				>					{title}				</Text>				{isActive && <View style={{marginRight: -7}}>					<SvgSelector						id="multiply"						stroke={theme.colors.independentForeground}						size={18}					/>				</View>}			</View>		</Button></View>	);};export default Chip;