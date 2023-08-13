import { createSlice, PayloadAction } from "@reduxjs/toolkit";import { TItem} from "features/transactions/Transactions.types";import { uniqueId } from "src/utils";interface TransactionsState {  items: TItem[];}const fakeItems: TItem[] = [  {    id: 1,    icon: "work",    type: "income",    name: "Main Job",    cashFlow: 10,  },  {    id: 2,    icon: "wallet",    type: "wallet",    name: "Tinkoff Bank",    cashFlow: 56,  },  {    id: 3,    icon: "work",    type: "income",    name: "Investments",    cashFlow: 90,  },  {    id: 4,    icon: "wallet",    type: "wallet",    name: "Alpha Bank",    cashFlow: 13,  },  {    id: 5,    icon: "fastFood",    type: "expense",    name: "Fast Food",    cashFlow: 23,  },  {    id: 6,    icon: "work",    type: "expense",    name: "Transport",    cashFlow: 11,  },];const initialState: TransactionsState = {  items: [],};const transactionsSlice = createSlice({  name: "transactions",  initialState,  reducers: {    addItem: (      state,      action: PayloadAction<Pick<TItem, "name" | "icon" | "type">>    ) => {      const item: TItem = {        ...action.payload,        id: uniqueId(state.items),        cashFlow: 0,      };      state.items.push(item);    },    editItem: (state, action: PayloadAction<TItem>) => {    	const item = state.items.find(i => i.id === action.payload.id)	    if(!item) return      const itemIndex = state.items.indexOf(item);      state.items[itemIndex] = action.payload;    },  },});export const { actions: transactionsActions, reducer: transactionsReducer } =  transactionsSlice;