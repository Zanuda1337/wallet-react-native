import React from "react";import { Modal, View } from "react-native";import {  Categories,  TItem,  TItemCategories,} from "features/transactions/Transactions.types";import { itemModalstyles } from "./style";import Header from "src/components/header/Header";import Form from "src/components/form/Form";import RenderIconSelector from "src/components/form/renderIconSelector/RenderIconSelector";import SvgSelector from "src/components/svgSelector/SvgSelector";import { useStyles, useTheme } from "src/hooks";import { getItemColors } from "features/transactions/Tansactions.utils";import { useAppSelector } from "src/store/hooks";import RenderCalculator from "src/components/form/renderCalculator/RenderCalculator";import {TField} from "src/components/form/Form.types";import {useIntl} from "react-intl";type TItemModalProps = {  id?: number;  initialValues: Pick<TItem, "name" | "icon" | "initialBalance">;  visible: boolean;  label: string;  itemType: TItemCategories;  onClose: () => void;  onSubmit: (item: Pick<TItem, "name" | "icon" | "initialBalance">) => void;  onDelete?: () => void;};const ItemModal: React.FC<TItemModalProps> = ({  id,  visible,  initialValues,  label,  itemType,  onClose,  onDelete,  onSubmit,}) => {  const style = useStyles(itemModalstyles);  const theme = useTheme();  const itemColors = getItemColors(theme);  const items = useAppSelector((state) => state.transactionsReducer.items);  const {formatMessage} = useIntl()  const fields: TField[] = [    {      name: "name",      rules: {        required: "REQUIRED_FIELD",        validate: {          unique: (value) => {            const item: TItem = items?.find(              (item) =>                item.type === itemType &&                item.name.toLowerCase() === value.toLowerCase()            );            if (!item) return true;            if (item.id === id) return true;            return "NAME_MUST_BE_UNIQUE";          },        },      },      initialValue: initialValues.name,    },    {      name: "icon",      component: RenderIconSelector,      initialValue: initialValues.icon,      props: { backgroundColor: itemColors[itemType] },    },  ];  if (itemType === Categories.wallet)    fields.push({      name: "initialBalance",      label: 'INITIAL_BALANCE',      rules: {        validate: {          moreThanMinimum: (value) =>            value >= 0 || "MIN_BALANCE_VALIDATION",          decimalPoint: (value) => {            if (Number.isInteger(value)) return true;            const decimalPointPart = value              .toString()              .split(".")[1];            if (decimalPointPart.length <= 2) return true;            if (+value.toFixed(2) === value) return true;            return "AMOUNT_VALIDATION";          },        }      },      component: RenderCalculator,      initialValue: initialValues.initialBalance || 0,    });  return (    <Modal visible={visible}>      {visible && (        <>          <View            style={{              paddingBottom: 15,              backgroundColor: theme.colors.background,            }}          >            <Header              label={label}              leftButtonProps={{ onPress: onClose, visible: true }}              rightButtonProps={                onDelete                  ? {                      onPress: onDelete,                      icon: (                        <SvgSelector                          id="delete"                          size={25}                          fill={theme.colors.foreground}                        />                      ),                    }                  : { visible: false }              }            />          </View>          <View style={[style.container, theme.styles.container]}>            <Form fields={fields} onSubmit={onSubmit} />          </View>        </>      )}    </Modal>  );};export default ItemModal;