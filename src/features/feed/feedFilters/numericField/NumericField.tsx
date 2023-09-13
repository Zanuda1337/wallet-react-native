import React from 'react';import {	Text,	TextInput,	TextInputProps,	View} from "react-native";import {useTheme} from "src/hooks";interface INumericFieldProps extends Omit<TextInputProps, 'onChange'> {	value: string;	label: string;	min?: number;	max?: number;	onChange: (text: string) => void;}const NumericField: React.FC<INumericFieldProps> = ({value, label,onChange,min= 0, max= Number.POSITIVE_INFINITY, ...props}) => {	const theme = useTheme();	return (		<View style={{ flex: 1, gap: 7}}>			<Text				style={[					{						color: theme.colors.foreground,						fontFamily: "Inter-SemiBold",						fontSize: 14,						textTransform: "none",					},				]}			>				{label}			</Text>			<TextInput				keyboardType={"numeric"}				value={value.toString()}				onChange={(e) => onChange(e.nativeEvent.text)}				style={{					backgroundColor: theme.colors.pale + '66',					borderRadius: 7,					paddingHorizontal: 10,					paddingVertical: 3,					color: theme.colors.foreground,					fontFamily: "Inter-Regular",				}}				{...props}			/>		</View>	);};export default NumericField;