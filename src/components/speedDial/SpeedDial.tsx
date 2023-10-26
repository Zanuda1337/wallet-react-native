import React, { useEffect, useState } from "react";import { Modal, View } from "react-native";import { useStyles, useTheme } from "src/hooks";import { speedDialStyles } from "src/components/speedDial/style";import SvgSelector, {  TSvgSelectorProps,} from "src/components/svgSelector/SvgSelector";import Item from "src/components/speedDial/item/Item";type TMenuItem = {  iconName: string;  onPress: () => void;  iconProps?: Partial<TSvgSelectorProps>;};type TSpeedDialProps = {  open: boolean;  onClose: () => void;  options: TMenuItem[];};const SpeedDial: React.FC<TSpeedDialProps> = ({ open, options, onClose }) => {  const style = useStyles(speedDialStyles);  const theme = useTheme();  const [visible, setVisible] = useState(open);  useEffect(() => {    if (open) {      setVisible(true);    } else {      setTimeout(() => setVisible(false), options.length * 75 + 100);    }  }, [open]);  return (    <Modal      visible={visible}      transparent      animationType={"fade"}      statusBarTranslucent      onRequestClose={onClose}    >      <View style={style.backdrop} onTouchStart={onClose}>        <View style={style.buttons} onTouchStart={(e) => e.stopPropagation()}>          {options.map((option, index) => (            <Item              key={index}              position={index}              length={options.length}              icon={                <SvgSelector                  id={option.iconName}                  size={25}                  fill={theme.colors.foreground}                  stroke={theme.colors.foreground}                  {...option.iconProps}                />              }              visible={open}              onPress={() => {                option.onPress();                onClose();              }}            />          ))}        </View>      </View>    </Modal>  );};export default SpeedDial;