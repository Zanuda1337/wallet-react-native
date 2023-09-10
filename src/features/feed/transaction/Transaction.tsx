import React, { useMemo, useRef, useState } from "react";import { View, Text, Animated, PanResponder, Dimensions } from "react-native";import { useFormatMoney, useStyles, useTheme } from "src/hooks";import SvgSelector from "src/components/svgSelector/SvgSelector";import {  getDenomination,  getItemColors,  getTransactionColors,  TRANSACTION_SIGNS,} from "features/transactions/Tansactions.utils";import { feedStyles } from "features/feed/style";import { TItem } from "features/transactions/Transactions.types";import CircularProgress from "src/components/circularProgress/CircularProgress";import { clamp } from "src/utils";type TTransactionProps = {  fromItem: TItem;  toItem: TItem;  amount: number;  disabled?: boolean;  onDelete: () => void;  onEdit: () => void;};const Transaction: React.FC<TTransactionProps> = ({  fromItem,  toItem,  amount,  disabled,  onDelete,  onEdit,}) => {  const theme = useTheme();  const style = useStyles(feedStyles);  const iconColors = getItemColors(theme);  const formatMoney = useFormatMoney();  const denomination = getDenomination(fromItem.type, toItem.type);  const transactionColors = getTransactionColors(theme);  const pan = useRef(new Animated.ValueXY()).current;  const [isDeletePoint, setDeletePoint] = useState(false);  const [isEditPoint, setEditPoint] = useState(false);  const breakPoint = -(Dimensions.get("screen").width / 2) + 30;  const [progress, setProgress] = useState(0);  let colorBrightness = clamp(Math.round(progress * 2), 0, 99).toString();  if (colorBrightness.length === 1) colorBrightness = "0" + colorBrightness;  if (isDeletePoint) colorBrightness = "";  const animatePan = (x: number) => {    Animated.spring(pan, {      toValue: { x, y: 0 },      useNativeDriver: false,    }).start();  };  const panResponder = useMemo(    () =>      PanResponder.create({        onMoveShouldSetPanResponderCapture: (e, gestureState) => {            if(Math.abs(gestureState.dx) < 1) return false            return Math.abs(gestureState.dy) <= 1;        },        onPanResponderMove: (e, gestureState) => {          if (disabled) return;          const isSlidedToLeft = gestureState.dx <= breakPoint;          const isSlidedToRight = gestureState.dx > -breakPoint;          if (isDeletePoint) {            animatePan(-Dimensions.get("screen").width);            return;          }          if (isEditPoint) {            animatePan(0);            return;          }          if (isSlidedToLeft) {            setDeletePoint(true);            setProgress(100);            setTimeout(onDelete, 300);          }          if (isSlidedToRight) {            setEditPoint(true);            setProgress(100);            setTimeout(() => {              onEdit();              setEditPoint(false);            }, 300);          }          pan.x.setValue(gestureState.dx);          const nextProgress =            (Math.abs(gestureState.dx) / (Math.abs(breakPoint) * 0.01)) * 1.1 -            10;          setProgress(clamp(nextProgress, 0, 100));        },        onPanResponderRelease: () => {          if (isDeletePoint) {            animatePan(-Dimensions.get("screen").width);            return;          }          animatePan(0);        },      }),    [isDeletePoint, isEditPoint, disabled]  );  return (    <View>      <View style={style.back}>        <CircularProgress          progress={progress}          stroke={theme.colors.foreground}          size={50}          strokeWidth={1}          opacity={isDeletePoint ? 0 : (progress * 0.01) / 2}        />        <CircularProgress          progress={progress}          stroke={theme.colors.foreground}          size={50}          strokeWidth={1}          opacity={(progress * 0.01) / 2}        />        <View style={[style.hiddenIcon, { right: 0, paddingRight: 20 }]}>          <SvgSelector            id="delete"            fill={`${theme.colors.error}${colorBrightness}`}            size={26}          />        </View>        <View style={[style.hiddenIcon, { left: 0, paddingLeft: 20 }]}>          <SvgSelector            id="edit"            fill={`${theme.colors.foreground}${              isDeletePoint ? "00" : colorBrightness            }`}            size={26}          />        </View>      </View>      <Animated.View        style={[style.container, { transform: pan.getTranslateTransform() }]}        {...panResponder.panHandlers}      >        <View          style={[            theme.styles.circle,            style.circle,            { backgroundColor: iconColors[toItem.type] },          ]}        >          <SvgSelector            id={toItem.icon}            stroke={theme.colors.independentForeground}            fill={theme.colors.independentForeground}            size={22}          />        </View>        <View style={style.textContainer}>          <View style={[style.row]}>            <Text style={style.from}>{fromItem.name}</Text>            <Text              style={[style.price, { color: transactionColors[denomination] }]}            >              {TRANSACTION_SIGNS[denomination] + formatMoney(amount)}            </Text>          </View>          <Text style={style.to}>{toItem.name}</Text>        </View>      </Animated.View>    </View>  );};export default Transaction;