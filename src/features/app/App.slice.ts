import { createSlice } from "@reduxjs/toolkit";import { AppThunk, RootState } from "src/store/types";import { settingsActions } from "src/features/settings/Settings.slice";import { transactionsActions } from "../transactions/Transactions.slice";interface AppState {  status: "idle" | "loading" | "failed";}const initialState: AppState = {  status: "idle",};const appSlice = createSlice({  name: "appReducer",  initialState,  reducers: {},});export const importState =  (rootState: RootState): AppThunk =>  (dispatch, getState) => {    const { transactionsReducer, settingsReducer } = rootState;    dispatch(settingsActions.import(settingsReducer));    dispatch(transactionsActions.import(transactionsReducer));  };export const { actions: appActions, reducer: appReducer } = appSlice;