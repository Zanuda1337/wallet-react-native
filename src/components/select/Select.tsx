import React, { useEffect, useRef, useState } from "react";
import {
  Modal,
  View,
  LayoutRectangle,
  Animated,
  StyleSheet,
  Easing,
  Dimensions,
  StyleProp,
  ViewStyle,
  TextStyle,
  StatusBar,
} from "react-native";
import TextField from "src/components/textField/TextField";
import { selectStyles } from "./style";
import Button from "src/components/button/Button";
import { TOption } from "src/components/select/Select.types";
import { useStyles, useTransition } from "src/hooks";
import absoluteFill = StyleSheet.absoluteFill;
import { useIntl } from "react-intl";
import { capitalize, clamp } from "src/utils";
import { FlatList } from "react-native";

type TSelectProps = {
  label: string;
  options: TOption[];
  value: string;
  onChange: (value: string) => void;
  styles?: { root?: StyleProp<ViewStyle>; optionText?: StyleProp<TextStyle> };
  renderValue?: (value: string) => string;
};

const Select: React.FC<TSelectProps> = ({
  label,
  options,
  value,
  onChange,
  renderValue,
  styles,
}) => {
  const style = useStyles(selectStyles);
  const [visible, setVisible] = useState(false);
  const [show, setShow] = useState(visible);
  const [layout, setLayout] = useState<LayoutRectangle>({
    y: 0,
    height: 0,
    x: 0,
    width: 0,
  });
  const ref = useRef<View>(null);
  const intl = useIntl();
  const transition = useTransition(0, 1, visible, {
    duration: 250,
    easing: Easing.cubic,
  });
  const handleClose = () => {
    if (!visible) return;
    setVisible(false);
    setTimeout(() => setShow(false), 500);
  };
  const handleOpen = () => {
    setVisible(true);
    setShow(true);
  };
  const displayLabel = (text: string, isCapitalize: boolean = true) => {
    if (renderValue) return renderValue(text);
    const string = intl.formatMessage({ id: text });
    if (isCapitalize) return capitalize(string);
    return string;
  };

  useEffect(() => {
    if (!ref.current) return;
    ref.current.measureInWindow((x, y, width, height) => {
      setLayout({ width, x, height, y });
    });
  }, [ref, show]);

  return (
    <View style={styles?.root} ref={ref} collapsable={false}>
      <TextField
        label={label}
        disabled={true}
        value={displayLabel(
          options.find((opt) => opt.value === value)?.label || "",
          true
        )}
        onPress={handleOpen}
      />
      <Modal
        visible={show}
        transparent={true}
        statusBarTranslucent
        onRequestClose={handleClose}
      >
        <View
          style={[absoluteFill, { paddingTop: StatusBar.currentHeight }]}
          onTouchStart={handleClose}
        >
          <Animated.View
            onTouchStart={(e) => e.stopPropagation()}
            style={{
              ...style.container,
              maxHeight: clamp(
                Dimensions.get("screen").height -
                  (layout.y + +layout.height),
                0,
                250
              ),
              top:
                transition.interpolate({
                  inputRange: [0, 1],
                  outputRange: [
                    layout.y + +layout.height - 17,
                    layout.y + +layout.height,
                  ],
                }) || 0,
              transform: [
                {
                  scale: transition.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.8, 1],
                  }),
                },
              ],
              opacity: transition,
            }}
          >
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={({ item: option }) => (
                <Button
                  translate={false}
                  text={displayLabel(option.label, false)}
                  variant={value === option.value ? "filled" : "ghost"}
                  styles={{
                    root: style.option,
                    text: [style.optionText, styles?.optionText],
                  }}
                  onPress={() => {
                    onChange(option.value);
                    handleClose();
                  }}
                />
              )}
            />
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
};

export default Select;
