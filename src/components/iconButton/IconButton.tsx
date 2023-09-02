import React from "react";import {  Animated,  BackgroundPropType,  TouchableNativeFeedback,  TouchableWithoutFeedbackProps,} from "react-native";import SvgSelector from "src/components/svgSelector/SvgSelector";import { TIconButtonStyles } from "src/components/iconButton/IconButton.types";import {useTheme} from "src/hooks";import AnimatedValue = Animated.AnimatedValue;import AnimatedInterpolation = Animated.AnimatedInterpolation;export type IconButtonVariant = "outlined" | "filled" | 'ghost'export interface IIconButtonProps extends TouchableWithoutFeedbackProps {  styles?: TIconButtonStyles;  icon?: JSX.Element;  size?: number | "small" | "medium" | "large";  color?: string | AnimatedValue | AnimatedInterpolation<string | number>;  variant?: IconButtonVariant;  ripple?: BackgroundPropType}enum buttonSize {  "small" = 56,  "medium" = 61,  "large" = 73,}const IconButton: React.FC<IIconButtonProps> = ({  styles,  size = buttonSize.small,  variant = "outlined",  icon,  color,  ripple,  ...touchableProps}) => {  const calculatedSize = typeof size === "number" ? size : buttonSize[size];  const theme = useTheme()  const containerStyles = [    {      ...theme.styles.circle,      width: calculatedSize,      height: calculatedSize,    },    styles?.root,  ];  if (variant === "outlined") containerStyles.unshift(theme.styles.outline);  else if (variant === "filled")    containerStyles.unshift({ backgroundColor: color || theme.colors.primary });  return (    <TouchableNativeFeedback      {...touchableProps}      background={ripple || TouchableNativeFeedback.Ripple(        "rgba(210,236,248,0.55)",        true,        calculatedSize / 2      )}    >      <Animated.View style={containerStyles}>        {icon || <SvgSelector id="placeholder" size={25} stroke={theme.colors.icons} />}      </Animated.View>    </TouchableNativeFeedback>  );};export default IconButton;