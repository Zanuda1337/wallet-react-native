import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Dimensions, Text, View } from "react-native";
import Item from "features/transactions/item/Item";
import {
  Categories,
  TItem,
  TItemCategories,
  TTransaction,
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
import Switch from "src/components/switch/Switch";
import { FormattedMessage, useIntl } from "react-intl";
import { capitalize, getBalance, getDynamics } from "src/utils";
import { useStyles, useTheme } from "src/hooks";
import { transactionStyles } from "features/transactions/style";
import { FlashList } from "@shopify/flash-list";
import SpeedDial from "src/components/speedDial/SpeedDial";
import { useNavigate } from "react-router-native";

const categories = [
  {
    name: Categories.income,
    label: "incomes",
    canAccept: [],
  },
  {
    name: Categories.wallet,
    label: "wallets",
    canAccept: [Categories.wallet, Categories.income],
  },
  {
    name: Categories.expense,
    label: "expenses",
    canAccept: [Categories.wallet],
  },
];

const Transactions: React.FC = () => {
  const style = useStyles(transactionStyles);
  const theme = useTheme();
  const navigate = useNavigate();
  const items: TItem[] = useAppSelector(
    (state) => state.transactionsReducer.items
  );
  const transactions: TTransaction[] = useAppSelector(
    (state) => state.transactionsReducer.transactions
  );
  const transactionsLayout = useAppSelector(
    (state) => state.settingsReducer.layout?.transactions
  ) || {
    income: { list: "horizontal" },
    wallet: { list: "horizontal" },
    expense: { list: "vertical" },
  };
  const [transferredItem, setTransferredItem] = useState<TItem>();
  const [acceptedItem, setAcceptedItem] = useState<TItem>();
  const [itemCreating, setItemCreating] = useState<
    TItemCategories | undefined
  >();
  const [itemEditing, setItemEditing] = useState<TItem | undefined>();
  const [itemDeleting, setItemDeleting] = useState<TItem | undefined>();
  const [editing, setEditing] = useState(false);
  const [deleteAllTransactions, setDeleteAllTransactions] = useState(false);
  const [speedDialOpen, setSpeedDialOpen] = useState(false);

  const boundActions = useBoundActions(transactionsActions);
  const intl = useIntl();

  const dynamics = useMemo(
    () => getDynamics(transactions, items, "months"),
    [transactions, items]
  );
  const monthTransactions = [];
  if (dynamics.length) monthTransactions.push(dynamics.at(-1));
  const { wallets } = getBalance(transactions, items);

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
  const handleAddItem = (
    item: Pick<TItem, "name" | "icon" | "initialBalance">
  ) => {
    boundActions.addItem({ ...item, type: itemCreating });
    handleCloseCreate();
  };
  const handleEditItem = (
    item: Pick<TItem, "name" | "icon" | "initialBalance">
  ) => {
    boundActions.editItem({ ...itemEditing, ...item });
    handleCloseEdit();
  };
  const handleCloseEdit = () => {
    setEditing(false);
    setItemEditing(undefined);
    setAcceptedItem(undefined);
    setTransferredItem(undefined);
  };
  const handleCloseCreate = () => {
    setItemCreating(undefined);
    setAcceptedItem(undefined);
    setTransferredItem(undefined);
  };
  const toggleDeleteAllTransactions = () =>
    setDeleteAllTransactions(!deleteAllTransactions);

  const handleCloseDeleteDialogue = () => {
    setItemDeleting(undefined);
    setDeleteAllTransactions(false);
  };
  const handleDeleteItem = () => {
    boundActions.deleteItem({
      itemId: itemDeleting.id,
      withTransactions: deleteAllTransactions,
    });
    handleCloseDeleteDialogue();
    setItemEditing(undefined);
  };

  const handleAddTransaction = (data: ITransactionFieldValues) => {
    if (!transferredItem || !acceptedItem) return;
    const { isRepeat, ...newData } = data;
    const transactionBase: TTransactionBase = {
      ...newData,
      date: newData.date.toString(),
      fromItemId: transferredItem.id,
      toItemId: acceptedItem.id,
    };
    boundActions.createTransaction({ transactionBase, isRepeat });
    handleCloseTransactionModal();
  };

  const getCashFlow = (item: TItem): number | undefined => {
    if (item?.type !== Categories.wallet) return;
    return wallets.find((i) => i.itemId === item.id)?.balance || 0;
  };

  const numColumns = Math.round(
    (Dimensions.get("screen").width -
      theme.styles.container.paddingHorizontal) /
      72
  );

  const keyExtractor = useCallback(
    (item) => (item ? item.id.toString() : "-1"),
    []
  );

  useEffect(() => {
    if (!speedDialOpen) return;
    setAcceptedItem(undefined);
    setTransferredItem(undefined);
  }, [speedDialOpen, acceptedItem, transferredItem]);

  return (
    <View style={[style.wrapper]}>
      {categories.map((category) => {
        // const isVertical = category.name === Categories.expense;
        const isVertical = transactionsLayout[category.name].list === 'vertical';
        const visibleItems = [
          ...items.filter(
            (item) => item?.type === category.name && item.visible
          ),
          undefined,
        ];
        return (
          <View
            key={category.name}
            style={[
              theme.styles.container,
              style.container,
              { flex: isVertical ? 1 : undefined },
            ]}
          >
            <View>
              <Text style={{ ...theme.styles.title, marginTop: -10 }}>
                <FormattedMessage id={category.label} />
              </Text>
            </View>
            <FlashList
              horizontal={!isVertical}
              estimatedItemSize={75}
              numColumns={isVertical ? numColumns : undefined}
              data={visibleItems}
              keyExtractor={keyExtractor}
              renderItem={({ item }) => {
                const isCurrentItemTransferring =
                  transferredItem?.id === item?.id;
                const canAcceptTransfer = canAccept(
                  transferredItem?.type,
                  category.canAccept
                );
                return (
                  <>
                    {item ? (
                      <Item
                        key={item.id}
                        type={item?.type}
                        name={item.name}
                        icon={item.icon}
                        cashFlow={getCashFlow(item)}
                        fullWidth={!isVertical}
                        isActive={isCurrentItemTransferring}
                        disabled={
                          transferredItem &&
                          !isCurrentItemTransferring &&
                          !canAcceptTransfer
                        }
                        onPress={() => {
                          if (!isCurrentItemTransferring && canAcceptTransfer)
                            handleTransfer(item);
                          else if (item?.type !== Categories.expense)
                            handleSelectItem(item);
                        }}
                        onLongPress={() => {
                          setSpeedDialOpen(true);
                          setItemEditing(item);
                        }}
                      />
                    ) : (
                      <View
                        style={{
                          width: 72,
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <IconButton
                          styles={{
                            root: {
                              borderStyle: "dashed",
                              borderColor: theme.colors.subtext,
                              borderWidth: 2,
                            },
                          }}
                          variant="ghost"
                          size="medium"
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
                    )}
                  </>
                );
              }}
            />
          </View>
        );
      })}
      <View style={{ marginBottom: 90 }} />
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
        onClose={handleCloseCreate}
      />
      <ItemModal
        id={itemEditing?.id}
        label={capitalize(
          `${intl.formatMessage({ id: "edit" })} ${
            !!itemEditing
              ? intl.formatMessage({
                  id: itemEditing?.type,
                })
              : ""
          }`
        )}
        initialValues={{
          icon: itemEditing?.icon,
          name: itemEditing?.name,
          initialBalance: itemEditing?.initialBalance,
        }}
        itemType={itemEditing?.type}
        visible={editing}
        onSubmit={handleEditItem}
        onClose={handleCloseEdit}
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
            <Switch
              checked={deleteAllTransactions}
              onChange={toggleDeleteAllTransactions}
            />
          </View>
        </>
      </Dialogue>
      <SpeedDial
        open={speedDialOpen}
        onClose={() => setSpeedDialOpen(false)}
        options={[
          { iconName: "receipt", onPress: () => navigate(`/feed?categoryId=${itemEditing.id}`) },
          { iconName: "edit", onPress: () => setEditing(true) },
          { iconName: "highPriority", onPress: () => boundActions.highPriority(itemEditing.id) },
          { iconName: "lowPriority", onPress: () => boundActions.lowPriority(itemEditing.id) },
          {
            iconName: "delete",
            onPress: () => setItemDeleting(itemEditing),
            iconProps: { fill: theme.colors.error },
          },
        ]}
      />
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
