import {	Animated, ImageStyle,	RegisteredStyle,	StyleProp,	TextStyle,	ViewStyle} from "react-native";export type AnimatedStyle = Animated.Value | RegisteredStyle<ViewStyle> | Animated.AnimatedInterpolation<string | number> | Animated.WithAnimatedObject<ViewStyle>type Style = AnimatedStyle | StyleProp<ViewStyle> | StyleProp<TextStyle> | StyleProp<ImageStyle>