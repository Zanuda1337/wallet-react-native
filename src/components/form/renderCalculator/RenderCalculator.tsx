import React, { useState } from "react";import { UseControllerReturn } from "react-hook-form/dist/types";import {Modal, StatusBar, View} from "react-native";import Calculator from "src/components/calculator/Calculator";import TextField from "src/components/textField/TextField";interface IRenderCalculatorProps extends UseControllerReturn<any> {  label: string;}const RenderCalculator: React.FC<IRenderCalculatorProps> = ({  fieldState: {error},  field: { value, onChange },  label,}) => {  const [isCalculatorOpen, setCalculatorOpen] = useState(false);  return (    <>      <TextField        label={label}        value={`${value}`}        disabled={true}        message={error?.message}        error={!!error?.message}        onPress={() => setCalculatorOpen(true)}      />      <Modal visible={isCalculatorOpen} statusBarTranslucent onRequestClose={() => setCalculatorOpen(false)}>        <View style={{paddingTop: StatusBar.currentHeight}}><Calculator          initialValue={value}          onSubmit={(result) => {            onChange(result);            setCalculatorOpen(false);          }}          onClose={() => setCalculatorOpen(false)}        /></View>      </Modal>    </>  );};export default RenderCalculator;