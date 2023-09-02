import React from "react";import { Provider } from "react-redux";import { PersistGate } from "redux-persist/integration/react";import { persistor, store } from "src/store";import ConnectedIntlProvider from "src/providers/connectedIntlProvider/ConnectedIntlProvider";import MomentProvider from "src/providers/momentProvider/MomentProvider";import ThemeProvider from "src/providers/themeProvider/ThemeProvider";import Main from "./Main";const App = () => {  return (    <Provider store={store}>      <PersistGate loading={null} persistor={persistor}>        <ConnectedIntlProvider>          <MomentProvider>            <ThemeProvider>                <Main />            </ThemeProvider>          </MomentProvider>        </ConnectedIntlProvider>      </PersistGate>    </Provider>  );};export default App;