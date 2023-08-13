import React from "react";
import {IntlProvider} from "react-intl";
import { Text } from "react-native";
import { en, ru } from "src/utils/languages";
import { useAppSelector } from "src/store/hooks";

type TConnectedIntlProviderProps = {
  children: JSX.Element;
};

const locales = [
  { locale: "ru", messages: ru },
  { locale: "en", messages: en },
];

const ConnectedIntlProvider: React.FC<TConnectedIntlProviderProps> = ({
  children,
}) => {
  const locale = useAppSelector((state) => state.settingsReducer.locale);
  const messages = locales.find((l) => l.locale === locale)?.messages || en;
  return (
    <IntlProvider textComponent={Text} messages={messages} locale={locale}>
      {children}
    </IntlProvider>
  );
};

export default ConnectedIntlProvider;
