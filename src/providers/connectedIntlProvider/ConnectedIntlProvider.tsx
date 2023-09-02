import React from "react";
import { IntlProvider } from "react-intl";
import { Text } from "react-native";
import { en} from "src/utils/languages";
import { useAppSelector } from "src/store/hooks";
import { LOCALES } from "src/consts";

type TConnectedIntlProviderProps = {
  children: JSX.Element;
};

const ConnectedIntlProvider: React.FC<TConnectedIntlProviderProps> = ({
  children,
}) => {
  const locale = useAppSelector((state) => state.settingsReducer.locale);
  const messages = LOCALES.find((l) => l.locale === locale)?.messages || en;
  return (
    <IntlProvider textComponent={Text} messages={messages} locale={locale}>
      {children}
    </IntlProvider>
  );
};

export default ConnectedIntlProvider;
