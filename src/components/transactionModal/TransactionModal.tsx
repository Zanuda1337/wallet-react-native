import React, { useEffect, useState } from "react";
import { Modal, View, Text, Animated } from "react-native";
import { style } from "./style";
import { theme } from "src/assets/styles/theme";
import SvgSelector from "src/components/svgSelector/SvgSelector";
import {useFormatMoney, useTransition} from "src/hooks";
import Form from "src/components/form/Form";
import RenderCheckbox from "src/components/form/renderCheckbox/RenderCheckbox";
import RenderCalculator from "src/components/form/renderCalculator/RenderCalculator";
import { TTransaction } from "features/transactions/Transactions.types";
import RenderDatePicker from "src/components/form/renderDatePicker/RenderDatePicker";
import moment from "moment";

export type TTransactionFieldValues = Pick<
  TTransaction,
  "amount" | "date" | "isRepeat" | "note"
>;

type TModalProps = {
  visible: boolean;
  from: string;
  to: string;
  icon: string;
  onBackdropPress: () => void;
  onHide: () => void;
  onSubmit: (data: TTransactionFieldValues) => void;
};

const TransactionModal: React.FC<TModalProps> = ({
  visible,
  from,
  icon,
  to,
  onBackdropPress,
  onHide,
  onSubmit,
}) => {
  const top = useTransition(100, 0, visible, { duration: 400 });
  const [show, setShow] = useState(visible);
  const [amount, setAmount] = useState(0);
  const formatMoney = useFormatMoney();

  useEffect(() => {
    if (visible) {
      setAmount(0);
      setShow(true);
      return () => clearTimeout(id);
    }
    const id = setTimeout(() => {
      onHide();
      setShow(false);
    }, 370);
    return () => clearTimeout(id);
  }, [visible]);

  return (
    <>
      <Modal transparent={true} visible={show} animationType="fade">
        {show && (
          <>
            <View
              style={{ flexGrow: 1, backgroundColor: "rgba(0,0,0,0.5)" }}
              onTouchStart={onBackdropPress}
            />
            <View style={style.backdrop}>
              <Animated.View
                style={[
                  theme.styles.container,
                  style.container,
                  {
                    top: top.interpolate({
                      inputRange: [0, 100],
                      outputRange: ["0%", "150%"],
                    }),
                  },
                ]}
              >
                <View style={style.header}>
                  <View style={[theme.styles.circle, style.circle]}>
                    {icon && <SvgSelector id={icon} fill="black" size={25} />}
                  </View>
                  <View style={style.transaction}>
                    <View style={style.arrowContainer}>
                      <View style={style.arrowBody} />
                      <View style={[theme.styles.circle, style.arrowCap]} />
                    </View>
                    <View style={style.textContainer}>
                      <Text style={style.text}>{from}</Text>
                      <Text style={style.subtext}>{to}</Text>
                    </View>
                  </View>
                  <Text style={style.amount}>{formatMoney(amount)}</Text>
                </View>
                <Form
                  fields={[
                    {
                      name: "amount",
                      initialValue: 0,
                      component: RenderCalculator,
                      rules: {
                        validate: {
                          moreThanMinimum: (value) =>
                            value >= 0.01 || "MIN_AMOUNT_VALIDATION",
                          decimalPoint: (value) => {
                            if (Number.isInteger(value)) return true;
                            const decimalPointPart = value
                              .toString()
                              .split(".")[1];
                            if (decimalPointPart.length <= 2) return true;
                            if (+value.toFixed(2) === value) return true;
                            return "AMOUNT_VALIDATION";
                          },
                        },
                      },
                    },
                    {
                      name: "date",
                      initialValue: moment({
                        date: new Date().getDate(),
                        month: new Date().getMonth(),
                        year: new Date().getFullYear(),
                      }).toDate(),
                      component: RenderDatePicker,
                      props: { disableFuture: true },
                    },
                    {
                      name: "isRepeat",
                      label: "repeat",
                      initialValue: false,
                      component: RenderCheckbox,
                    },
                    {
                      name: "note",
                      initialValue: "",
                      props: { multiline: true },
                    },
                  ]}
                  onChange={(data) => setAmount(data.amount)}
                  onSubmit={onSubmit}
                />
              </Animated.View>
            </View>
          </>
        )}
      </Modal>
    </>
  );
};

export default TransactionModal;
