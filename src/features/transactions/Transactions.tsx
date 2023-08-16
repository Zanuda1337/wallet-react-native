import React, { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import Item from "features/transactions/item/Item";
import {
  Categories,
  TItem,
  TItemCategories,
  TTransactionBase,
} from "features/transactions/Transactions.types";
import { canAccept } from "features/transactions/Tansactions.utils";
import TransactionModal, {
  ITransactionFieldValues,
} from "src/components/transactionModal/TransactionModal";
import IconButton from "src/components/iconButton/IconButton";
import SvgSelector from "src/components/svgSelector/SvgSelector";
import ItemModal from "src/components/itemModal/ItemModal";
import { useAppSelector, useBoundActions } from "src/store/hooks";
import { transactionsActions } from "./Transactions.slice";
import Dialogue from "src/components/dialogue/Dialogue";
import Checkbox from "src/components/checkbox/Checkbox";
import { FormattedMessage, useIntl } from "react-intl";
import { capitalize } from "src/utils";
import { useStyles, useTheme } from "src/hooks";
import { transactionStyles } from "features/transactions/style";

const categories = [
  {
    name: Categories.income,
    label: "income",
    canAccept: [],
  },
  {
    name: Categories.wallet,
    label: "wallet",
    canAccept: [Categories.wallet, Categories.income],
  },
  {
    name: Categories.expense,
    label: "expense",
    canAccept: [Categories.wallet],
  },
];

type TTransactionsProps = {};

const Transactions: React.FC<TTransactionsProps> = ({}) => {
  const style = useStyles(transactionStyles);
  const theme = useTheme();
  const items = useAppSelector((state) => state.transactionsReducer.items);
  const [transferredItem, setTransferredItem] = useState<TItem>();
  const [acceptedItem, setAcceptedItem] = useState<TItem>();
  const [itemCreating, setItemCreating] = useState<
    TItemCategories | undefined
  >();
  const [itemEditing, setItemEditing] = useState<TItem | undefined>();
  const [itemDeleting, setItemDeleting] = useState<TItem | undefined>();
  const [deleteAllTransactions, setDeleteAllTransactions] = useState(false);

  const boundActions = useBoundActions(transactionsActions);
  const intl = useIntl();

  const handleSelectItem = (item: TItem) => {
    setTransferredItem(transferredItem?.id === item.id ? undefined : item);
  };
  const handleTransfer = (item: TItem) => {
    setAcceptedItem(item);
  };
  const handleCloseTransactionModal = () => {
    setTransferredItem(undefined);
    setAcceptedItem(undefined);
  };
  const handleAddItem = (item: Pick<TItem, "name" | "icon">) => {
    boundActions.addItem({ ...item, type: itemCreating });
    setItemCreating(undefined);
  };
  const handleEditItem = (item: Pick<TItem, "name" | "icon">) => {
    boundActions.editItem({ ...itemEditing, ...item });
    setItemEditing(undefined);
  };
  const toggleDeleteAllTransactions = () =>
    setDeleteAllTransactions(!deleteAllTransactions);

  const handleCloseDeleteDialogue = () => {
    setItemDeleting(undefined);
    setDeleteAllTransactions(false);
  };

  const handleDeleteItem = () => {
    //deleteAllTransactions
    //dispatch
    console.log(
      `delete ${itemDeleting.name} ${
        deleteAllTransactions ? "with" : "and leave"
      } transactions`
    );
    handleCloseDeleteDialogue();
    setItemEditing(undefined);
  };

  const handleAddTransaction = (data: ITransactionFieldValues) => {
    const transaction: TTransactionBase = {
      ...data,
      date: data.date.toString(),
      fromItemId: transferredItem?.id,
      toItemId: acceptedItem?.id,
    };
    boundActions.createTransaction(transaction);
    handleCloseTransactionModal();
  };

  return (
    <View style={[style.wrapper]}>
      {categories.map((category) => (
        <View
          key={category.name}
          style={[theme.styles.container, style.container]}
        >
          <View>
            <Text style={theme.styles.title}>
              <FormattedMessage id={category.label} />
            </Text>
          </View>
          <ScrollView horizontal>
            <View style={style.list}>
              {items
                .filter((item) => item.type === category.name)
                .map((item) => {
                  const isCurrentItemTransferring =
                    transferredItem?.id === item.id;
                  const canAcceptTransfer = canAccept(
                    transferredItem?.type,
                    category.canAccept
                  );
                  return (
                    <Item
                      key={item.id}
                      type={item.type}
                      name={item.name}
                      icon={item.icon}
                      cashFlow={item.cashFlow}
                      isActive={isCurrentItemTransferring}
                      disabled={
                        transferredItem &&
                        !isCurrentItemTransferring &&
                        !canAcceptTransfer
                      }
                      onPress={() => {
                        if (!isCurrentItemTransferring && canAcceptTransfer)
                          handleTransfer(item);
                        else if (item.type !== Categories.expense)
                          handleSelectItem(item);
                      }}
                      onLongPress={() => setItemEditing(item)}
                    />
                  );
                })}
              <IconButton
                styles={{
                  root: {
                    borderStyle: "dashed",
                    borderColor: theme.colors.subtext,
                    borderWidth: 2,
                  },
                }}
                size="large"
                icon={
                  <SvgSelector
                    id="plus"
                    stroke={theme.colors.subtext}
                    size={20}
                  />
                }
                onPress={() => setItemCreating(category.name)}
              />
            </View>
          </ScrollView>
        </View>
      ))}
      <ItemModal
        label={capitalize(
          `${intl.formatMessage({ id: "create" })} ${
            itemCreating
              ? intl.formatMessage({
                  id: itemCreating,
                })
              : ""
          }`
        )}
        initialValues={{
          icon: "placeholder",
          name: "",
        }}
        itemType={itemCreating}
        visible={!!itemCreating}
        onSubmit={handleAddItem}
        onClose={() => setItemCreating(undefined)}
      />
      <ItemModal
        label={capitalize(
          `${intl.formatMessage({ id: "edit" })} ${
            !!itemEditing
              ? intl.formatMessage({
                  id: itemEditing?.type,
                })
              : ""
          }`
        )}
        initialValues={{ icon: itemEditing?.icon, name: itemEditing?.name }}
        itemType={itemEditing?.type}
        visible={!!itemEditing}
        onSubmit={handleEditItem}
        onDelete={() => setItemDeleting(itemEditing)}
        onClose={() => setItemEditing(undefined)}
      />
      <Dialogue
        visible={!!itemDeleting}
        onBackdropPress={handleCloseDeleteDialogue}
        onClose={handleCloseDeleteDialogue}
        cancelButtonProps={{ onPress: handleCloseDeleteDialogue }}
        submitButtonProps={{
          color: theme.colors.error,
          onPress: handleDeleteItem,
        }}
      >
        <>
          <Text style={[theme.styles.dialogueText]}>
            <FormattedMessage id="UNDONE_ACTION_WARN" />
          </Text>

          <View
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 10,
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text
              style={{
                ...theme.styles.dialogueText,
                fontFamily: "Inter-SemiBold",
              }}
            >
              <FormattedMessage id="DELETE_ALL_TRANSACTIONS" />
            </Text>
            <Checkbox
              checked={deleteAllTransactions}
              onChange={toggleDeleteAllTransactions}
            />
          </View>
        </>
      </Dialogue>
      <TransactionModal
        visible={!!transferredItem && !!acceptedItem}
        onBackdropPress={handleCloseTransactionModal}
        onHide={() => setAcceptedItem(undefined)}
        from={transferredItem?.name}
        to={acceptedItem?.name}
        icon={acceptedItem?.icon}
        onSubmit={handleAddTransaction}
      />
    </View>
  );
};

export default Transactions;
