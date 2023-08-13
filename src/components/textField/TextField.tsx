import React from "react";import {  StyleSheet,  Text,  TextInput,  TextInputProps,  View,} from "react-native";import { theme } from "src/assets/styles/theme";import { style } from "./style";import SvgSelector from "src/components/svgSelector/SvgSelector";import { FormattedMessage } from "react-intl";interface ITextFieldProps extends TextInputProps {  label: string;  disabled?: boolean;  error?: boolean;  message?: string;  onPress?: () => void;}const TextField: React.FC<ITextFieldProps> = ({  label,  disabled,  message,  error,  onPress,  ...textInputProps}) => {  const multiline = textInputProps.multiline && !!textInputProps.value;  return (    <View      onTouchStart={onPress}      style={StyleSheet.compose(        {          ...theme.styles.item,          borderBottomColor: error            ? theme.colors.error            : theme.styles.item.borderBottomColor,        },        multiline && style.multiline      )}    >      <Text        style={{          ...theme.styles.label,          color: error ? theme.colors.error : theme.styles.label.color,        }}      >        <FormattedMessage id={ label } />      </Text>      <View style={multiline ? style.multilineText : style.textContainer}>        <TextInput          editable={!disabled}          style={[            theme.styles.value,            { textAlign: multiline ? "left" : "right" },          ]}          multiline={multiline}          {...textInputProps}        />      </View>      {!!message && (        <>          <View style={theme.styles.messagePopupArrow} />          <View style={theme.styles.messagePopupContainer}>            <SvgSelector id="warning" fill={theme.colors.error} size={20} />            <Text style={theme.styles.messagePopup}>              <FormattedMessage id={ message } />            </Text>          </View>        </>      )}    </View>  );};export default TextField;