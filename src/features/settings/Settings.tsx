import React, { useEffect } from "react";import { Text, View } from "react-native";import Form from "src/components/form/Form";import RenderSelect from "src/components/form/renderSelect/RenderSelect";import { useAppSelector, useBoundActions } from "src/store/hooks";import { settingsActions } from "src/features/settings/Settings.slice";import { CURRENCIES, LOCALES } from "src/consts";import { useTheme } from "src/hooks";import Button from "src/components/button/Button";import { capitalize } from "src/utils";import { FormattedMessage, useIntl } from "react-intl";import * as DocumentPicker from "expo-document-picker";import * as FileSystem from "expo-file-system";import { EncodingType } from "expo-file-system";import { exportJsonFile } from "./Settings.utils";import { importState } from "src/features/app/App.slice";import { useNotice } from "src/components/notice/Notice.hooks";type TSettingsProps = {};const Settings: React.FC<TSettingsProps> = ({}) => {  const appTheme = useAppSelector((state) => state.settingsReducer.theme);  const locale = useAppSelector((state) => state.settingsReducer.locale);  const currency = useAppSelector((state) => state.settingsReducer.currency);  const settingsReducer = useAppSelector((state) => state.settingsReducer);  const transactionsReducer = useAppSelector(    (state) => state.transactionsReducer  );  const rootState = { settingsReducer, transactionsReducer };  const { formatMessage } = useIntl();  const boundActions = useBoundActions({ ...settingsActions, importState });  const theme = useTheme();  const { enqueueNotice } = useNotice();  const handleImport = async () => {    try {      const document = await DocumentPicker.getDocumentAsync({        copyToCacheDirectory: false,      });      if (document.type !== "success") throw new Error("cancel");      if (document.mimeType !== "application/json") {        enqueueNotice("JSON_FILE_EXT_ERROR", { type: "error" });        throw new Error("JSON_FILE_EXT_ERROR");      }      const data = await FileSystem.readAsStringAsync(document.uri, {        encoding: EncodingType.UTF8,      });      try {        const parsedData = JSON.parse(data);        if (          JSON.stringify(Object.keys(parsedData)) !==          JSON.stringify(Object.keys(rootState))        )          throw new Error();        boundActions.importState(parsedData);        enqueueNotice("DATA_SUCCESSFULLY_IMPORTED", { type: "success" });      } catch (e) {        enqueueNotice("INCORRECT_DATA", { type: "error" });      }    } catch (e) {      console.error(e);    }  };  const handleExport = async () => {    try {      await exportJsonFile("wallet_app_data", rootState);    } catch (e) {      enqueueNotice(e.message, { type: "error" });    }  };  return (    <View style={theme.styles.container}>      <Text style={theme.styles.title}>        <FormattedMessage id="common" />      </Text>      <Form        fields={[          {            name: "theme",            initialValue: appTheme,            props: {              options: [                { value: "system", label: "system" },                { value: "light", label: "light" },                { value: "dark", label: "dark" },              ],            },            component: RenderSelect,          },          {            name: "locale",            label: "language",            initialValue: locale,            props: {              options: LOCALES.map(({ locale, label }) => ({                value: locale,                label,              })),            },            component: RenderSelect,          },          {            name: "currency",            initialValue: currency,            props: {              options: CURRENCIES,              renderValue: (value) => value,            },            component: RenderSelect,          },        ]}        onSubmit={(data) => {          boundActions.setSettings({ ...data });        }}        submitOnChange      />      <Text        style={{ ...theme.styles.title, textTransform: "none", marginTop: 20 }}      >        {capitalize(formatMessage({ id: "IMPORT_AND_EXPORT" }))}      </Text>      <View style={{ display: "flex", flexDirection: "row", gap: 20 }}>        <Button          text={capitalize(formatMessage({ id: "CHOOSE_FILE" }))}          styles={{            root: { flex: 1 },            text: { textTransform: "none", color: theme.colors.foreground },          }}          translate={false}          variant="outlined"          onPress={handleImport}        />        <Button          text={capitalize(formatMessage({ id: "EXPORT_DATA" }))}          styles={{ root: { flex: 1 }, text: { textTransform: "none" } }}          translate={false}          onPress={handleExport}        />      </View>    </View>  );};export default Settings;