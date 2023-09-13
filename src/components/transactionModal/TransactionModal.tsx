import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  Dimensions,
} from "react-native";
import { transactionModalStyles } from "./style";
import SvgSelector from "src/components/svgSelector/SvgSelector";
import { useFormatMoney, useStyles, useTheme } from "src/hooks";
import Form from "src/components/form/Form";
import RenderCalculator from "src/components/form/renderCalculator/RenderCalculator";
import { TTransaction } from "features/transactions/Transactions.types";
import RenderDatePicker from "src/components/form/renderDatePicker/RenderDatePicker";
import { pureDate } from "src/utils";
import RenderSwitch from "src/components/form/renderSwitch/RenderSwitch";
import { TField } from "src/components/form/Form.types";
import Modal from "react-native-modal";

export interface ITransactionFieldValues
  extends Pick<TTransaction, "amount" | "note"> {
  date: Date;
  isRepeat?: boolean;
}

const navBarHeight =
  Dimensions.get("screen").height -
  (Dimensions.get("window").height);

type TModalProps = {
  visible: boolean;
  from: string;
  to: string;
  icon: string;
  onBackdropPress: () => void;
  onHide: () => void;
  onSubmit: (data: ITransactionFieldValues) => void;
  initialValues?: ITransactionFieldValues;
  edit?: boolean;
};

const TransactionModal: React.FC<TModalProps> = ({
  visible,
  from,
  icon,
  to,
  initialValues,
  onBackdropPress,
  onHide,
  onSubmit,
  edit,
}) => {
  const style = useStyles(transactionModalStyles);
  const theme = useTheme();
  const [show, setShow] = useState(visible);
  const [amount, setAmount] = useState(0);
  const [visibleData, setVisibleData] = useState({ from, to, icon });
  const formatMoney = useFormatMoney();

  useEffect(() => {
    if (visible) {
      setAmount(initialValues?.amount || 0);
      setShow(true);
      return;
    }

    onHide();
    setShow(false);
  }, [visible, initialValues]);

  useEffect(() => {
    if (!from || !to || !icon) return;
    setVisibleData({ from, to, icon });
  }, [from, to, icon]);

  const fields: TField[] = [
    {
      name: "amount",
      initialValue: initialValues?.amount || 0,
      component: RenderCalculator,
      rules: {
        validate: {
          moreThanMinimum: (value) => value >= 0.01 || "MIN_AMOUNT_VALIDATION",
          decimalPoint: (value) => {
            if (Number.isInteger(value)) return true;
            const decimalPointPart = value.toString().split(".")[1];
            if (decimalPointPart.length <= 2) return true;
            if (+value.toFixed(2) === value) return true;
            return "AMOUNT_VALIDATION";
          },
        },
      },
    },
    {
      name: "date",
      initialValue: initialValues?.date || pureDate(),
      component: RenderDatePicker,
      props: { disableFuture: true },
    },

    {
      name: "note",
      rules: { maxLength: { value: 270, message: "LIMIT_270_SYMBOLS" } },
      initialValue: initialValues?.note || "",
      props: { multiline: true },
    },
  ];

  if (!edit) {
    const note = { ...fields[2] };
    fields[2] = {
      name: "isRepeat",
      label: "repeat",
      initialValue: false,
      component: RenderSwitch,
    };
    fields[3] = note;
  }

  return (
    <>
      <Modal
        onBackButtonPress={onBackdropPress}
        onBackdropPress={onBackdropPress}
        isVisible={show}
        statusBarTranslucent
        backdropOpacity={0.3}
        hideModalContentWhileAnimating
        coverScreen
        useNativeDriverForBackdrop
        style={{ margin: 0 }}
        deviceHeight={Dimensions.get("screen").height}
      >
        <View style={style.backdrop} pointerEvents={"box-none"}>
          <KeyboardAvoidingView
            keyboardVerticalOffset={-navBarHeight}
            behavior="padding"
            style={{
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <View
              pointerEvents={visible ? "auto" : "none"}
              style={[theme.styles.container, style.container]}
            >
              <View style={style.header}>
                <View style={[theme.styles.circle, style.circle]}>
                  {visibleData.icon && (
                    <SvgSelector id={visibleData.icon} fill="black" size={25} />
                  )}
                </View>
                <View style={[style.transaction]}>
                  <View style={style.arrowContainer}>
                    <View style={style.arrowBody} />
                    <View style={[theme.styles.circle, style.arrowCap]} />
                  </View>
                  <View style={style.textContainer}>
                    <Text style={style.text}>{visibleData.from}</Text>
                    <Text style={style.subtext}>{visibleData.to}</Text>
                  </View>
                </View>
                <Text style={style.amount}>{formatMoney(amount)}</Text>
              </View>
              <Form
                fields={fields}
                onChange={(data) => setAmount(data.amount)}
                onSubmit={onSubmit}
              />
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </>
  );
};

export default TransactionModal;
