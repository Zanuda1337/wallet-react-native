import {Animated, RegisteredStyle, ViewStyle} from "react-native";export type AnimatedStyle = Animated.Value | RegisteredStyle<ViewStyle> | Animated.AnimatedInterpolation<string | number> | Animated.WithAnimatedObject<ViewStyle>