import React, { useState } from "react";
import {
  Modal,
  View,
  LayoutRectangle,
  Animated,
  StyleSheet,
  Easing, Dimensions,
} from "react-native";
import TextField from "src/components/textField/TextField";
import { selectStyles } from "./style";
import Button from "src/components/button/Button";
import { TOption } from "src/components/select/Select.types";
import { useStyles, useTransition } from "src/hooks";
import absoluteFill = StyleSheet.absoluteFill;
import { useIntl } from "react-intl";
import { capitalize } from "src/utils";
import { FlatList } from "react-native";

type TSelectProps = {
  label: string;
  options: TOption[];
  value: string;
  onChange: (value: string) => void;
  renderValue?: (value: string) => string;
};

const Select: React.FC<TSelectProps> = ({
  label,
  options,
  value,
  onChange,
  renderValue,
}) => {
  const style = useStyles(selectStyles);
  const [visible, setVisible] = useState(false);
  const [show, setShow] = useState(visible);
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
  const [layout, setLayout] = useState<LayoutRectangle>();
  return (
    <View onLayout={(event) => setLayout(event.nativeEvent.layout)}>
      <TextField
        label={label}
        disabled={true}
        value={displayLabel(
          options.find((opt) => opt.value === value)?.label || "",
          true
        )}
        onPress={handleOpen}
      />
      <Modal visible={show} transparent={true}>
        <View style={[absoluteFill]} onTouchStart={handleClose}>
          <Animated.View
            onTouchStart={(e) => e.stopPropagation()}
            style={{
              ...style.container,
              maxHeight: Dimensions.get('screen').height - (layout?.y + +layout?.height) - 150,
              top:
                transition.interpolate({
                  inputRange: [0, 1],
                  outputRange: [
                    60 + layout?.y + +layout?.height,
                    83 + layout?.y + +layout?.height,
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
                  styles={{ root: style.option, text: style.optionText }}
                  onPress={() => {
                    onChange(option.value);
                    handleClose();
                  }}
                />
              )}
            />

            {/*{options.map((option) => (*/}
            {/*  <Button*/}
            {/*    translate={false}*/}
            {/*    key={option.value}*/}
            {/*    text={displayLabel(option.label, false)}*/}
            {/*    variant={value === option.value ? "filled" : "ghost"}*/}
            {/*    styles={{ root: style.option, text: style.optionText }}*/}
            {/*    onPress={() => {*/}
            {/*      onChange(option.value);*/}
            {/*      handleClose();*/}
            {/*    }}*/}
            {/*  />*/}
            {/*))}*/}
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
};

export default Select;
