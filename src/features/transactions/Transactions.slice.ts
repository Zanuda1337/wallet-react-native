import { createSlice, PayloadAction } from "@reduxjs/toolkit";import {  TItem,  TTransaction,  TTransactionBase,} from "features/transactions/Transactions.types";import { pureDate, uniqueId } from "src/utils";import moment from "moment";import { IntlShape } from "react-intl";import { defaultItems } from "features/transactions/Transactions.mocks";interface TransactionsState {  items: TItem[];  transactions: TTransaction[];  repeatTemplates: TTransaction[];}const initialState: TransactionsState = {  items: [],  transactions: [],  repeatTemplates: [],};const transactionsSlice = createSlice({  name: "transactions",  initialState,  reducers: {    addItem: (      state,      action: PayloadAction<        Pick<TItem, "name" | "icon" | "type" | "initialBalance">      >    ) => {      const identicalItem = state.items.find(        (item) =>          item.name.toLowerCase() === action.payload.name.toLowerCase() &&          !item.visible      );      if (identicalItem) {        state.items = state.items.map((item) =>          item.id === identicalItem.id            ? { ...identicalItem, ...action.payload, visible: true }            : item        );        return;      }      const item: TItem = {        ...action.payload,        id: uniqueId(state.items),        visible: true,        initialBalance:          action.payload.initialBalance === undefined            ? undefined            : action.payload.initialBalance,      };      state.items.push(item);    },    editItem: (state, action: PayloadAction<TItem>) => {      const item = state.items.find((i) => i.id === action.payload.id);      if (!item) return;      const itemIndex = state.items.indexOf(item);      state.items[itemIndex] = action.payload;    },    createTransaction: (      state,      action: PayloadAction<{        transactionBase: TTransactionBase;        isRepeat: boolean;      }>    ) => {      const transaction: TTransaction = {        ...action.payload.transactionBase,        id: uniqueId(state.transactions),      };      if (action.payload.isRepeat) {        const repeatId = uniqueId(state.repeatTemplates);        state.repeatTemplates.push({          ...action.payload.transactionBase,          id: repeatId,        });        transaction.repeatId = repeatId;      }      state.transactions.push(transaction);    },    deleteRepeatTemplate: (state, action: PayloadAction<number>) => {      const { fromItemId, toItemId }: TTransaction = state.repeatTemplates.find(        (transaction) => transaction.id === action.payload      );      if (fromItemId === undefined) return;      const filteredTemplates = state.repeatTemplates.filter(        (transaction) => transaction.id !== action.payload      );      const filtered: TTransaction[] = [        ...state.transactions,        ...filteredTemplates,      ];      const transactionWithFromItem = filtered.find(        (t) => fromItemId === t.fromItemId || fromItemId === t.toItemId      );      const transactionWithToItem = filtered.find(        (t) => toItemId === t.fromItemId || toItemId === t.toItemId      );      if (!transactionWithFromItem) {        state.items = state.items.filter(          (item) => item.id !== fromItemId || item.visible        );      }      if (!transactionWithToItem) {        state.items = state.items.filter(          (item) => item.id !== toItemId || item.visible        );      }      state.repeatTemplates = filteredTemplates;    },    editRepeatTemplate: (state, action: PayloadAction<TTransaction>) => {      const transaction = state.repeatTemplates.find(        (t) => t.id === action.payload.id      );      if (!transaction) return;      const index = state.repeatTemplates.indexOf(transaction);      state.repeatTemplates[index] = action.payload;    },    deleteTransaction: (state, action: PayloadAction<number>) => {      const { fromItemId, toItemId }: TTransaction = state.transactions.find(        (transaction) => transaction.id === action.payload      );      if (fromItemId === undefined) return;      const filteredTransactions: TTransaction[] = state.transactions.filter(        (transaction) => transaction.id !== action.payload      );      const filtered = [...state.repeatTemplates, ...filteredTransactions];      const transactionWithFromItem = filtered.find(        (t) => fromItemId === t.fromItemId || fromItemId === t.toItemId      );      const transactionWithToItem = filtered.find(        (t) => toItemId === t.fromItemId || toItemId === t.toItemId      );      if (!transactionWithFromItem) {        state.items = state.items.filter(          (item) => item.id !== fromItemId || item.visible        );      }      if (!transactionWithToItem) {        state.items = state.items.filter(          (item) => item.id !== toItemId || item.visible        );      }      state.transactions = filteredTransactions;    },    editTransaction: (state, action: PayloadAction<TTransaction>) => {      const transaction = state.transactions.find(        (t) => t.id === action.payload.id      );      if (!transaction) return;      const index = state.transactions.indexOf(transaction);      state.transactions[index] = action.payload;    },    deleteItem: (      state,      action: PayloadAction<{ itemId: number; withTransactions: boolean }>    ) => {      const { itemId, withTransactions } = action.payload;      if (withTransactions) {        state.transactions = state.transactions.filter(          (transaction: TTransaction) =>            transaction.toItemId !== itemId && transaction.fromItemId !== itemId        );        state.repeatTemplates = state.repeatTemplates.filter(          (transaction: TTransaction) =>            transaction.toItemId !== itemId && transaction.fromItemId !== itemId        );        state.items = state.items.filter((item: TItem) => item.id !== itemId);        return;      }      const transactions = state.transactions.find(        (t) => t.fromItemId === itemId || t.toItemId === itemId      );      if (!transactions) {        state.items = state.items.filter((item: TItem) => item.id !== itemId);        return;      }      state.items = state.items.map((item: TItem) =>        item.id === itemId ? { ...item, visible: false } : item      );    },    highPriority: (state, { payload }: PayloadAction<number>) => {      const orderedItem = state.items.find((item) => item.id === payload);      if (!orderedItem) return;      const otherItems = state.items.filter((item) => item.id !== payload);      state.items = [orderedItem, ...otherItems];    },    lowPriority: (state, { payload }: PayloadAction<number>) => {      const orderedItem = state.items.find((item) => item.id === payload);      if (!orderedItem) return;      const otherItems = state.items.filter((item) => item.id !== payload);      state.items = [...otherItems, orderedItem];    },    repeatTransactions: (state) => {      const repeatTransactions = [];      state.repeatTemplates.forEach((rT) => {        const recentTransaction =          state.transactions            .filter((t) => rT.id === t?.repeatId)            .sort(              (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()            )[0] || rT;        for (let i = 0; true; i++) {          const nextDate = moment(new Date(recentTransaction.date)).add(            i,            "month"          );          if (nextDate.isAfter(pureDate())) break;          const transaction = state.transactions.find(            (t) => t?.repeatId === rT.id && nextDate.isSame(new Date(t.date))          );          if (transaction) {            //already repeated            continue;          }          repeatTransactions.push({            ...rT,            repeatId: rT.id,            id: uniqueId([...state.transactions, ...repeatTransactions]),            date: nextDate.toString(),          });        }      });      state.transactions.push(...repeatTransactions);    },    addDefaultItems: (      state,      { payload: { formatMessage } }: PayloadAction<IntlShape>    ) => {      state.items = defaultItems.map((item) => ({        ...item,        name: formatMessage({ id: item.name }),      }));    },    import: (state, action: PayloadAction<TransactionsState>) => {      state.transactions = action.payload.transactions;      state.items = action.payload.items;    },  },});export const { actions: transactionsActions, reducer: transactionsReducer } =  transactionsSlice;