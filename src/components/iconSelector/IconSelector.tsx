import React, { useEffect, useState } from "react";import {Animated, Dimensions, Modal, Text, View} from "react-native";import IconButton from "src/components/iconButton/IconButton";import { useTransition } from "src/hooks";import { theme } from "src/assets/styles/theme";import { style } from "./style";import SvgSelector from "src/components/svgSelector/SvgSelector";import { ITEM_ICONS } from "src/components/iconSelector/IconSelector.consts";import {FormattedMessage} from "react-intl";const screenWidth = Dimensions.get('screen').widthtype TIconSelectorProps = {  value: string;  label: string  onChange: (icon: string) => void;  backgroundColor?: string,};const IconSelector: React.FC<TIconSelectorProps> = ({ value, label,backgroundColor,onChange }) => {  const [visible, setVisible] = useState(false);  const [show, setShow] = useState(false);  const top = useTransition(100, 0, visible, { duration: 400 });  const iconButtonSize = screenWidth / 6 - 10 - 4.5	const iconSize = iconButtonSize * 0.4  useEffect(() => {    if (visible) {      setShow(true);      return () => clearTimeout(id);    }    const id = setTimeout(() => {      setShow(false);    }, 370);    return () => clearTimeout(id);  }, [visible]);  return (    <View style={theme.styles.item}>      <Text style={theme.styles.label}><FormattedMessage id={label}/></Text>      <View>        <IconButton          variant="ghost"          size={40}          icon={<SvgSelector id={value} fill={theme.colors.foreground} stroke={theme.colors.foreground} size={20}/>}          onPress={() => setVisible(true)}        />      </View>      <Modal visible={show} transparent={true}>        <>          <View	          onTouchStart={() => setVisible(false)}	          style={{ flexGrow: 1 }}          />          <Animated.View	          style={{              ...style.content,              top: top.interpolate({                inputRange: [0, 100],                outputRange: ["0%", "100%"],              }),            }}          >            <View style={[theme.styles.container, style.list]}>              {ITEM_ICONS.map((icon) => (                <IconButton key={icon} variant='filled' color={backgroundColor} size={iconButtonSize} onPress={() => {	                onChange(icon)	                setVisible(false)                }} icon={<SvgSelector id={icon} fill={'#fff'} stroke={'#fff'} size={iconSize} />} />              ))}            </View>          </Animated.View>        </>      </Modal>    </View>  );};export default IconSelector;