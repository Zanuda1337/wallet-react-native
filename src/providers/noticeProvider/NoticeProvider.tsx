import React, { createContext, useEffect, useState } from "react";
import {
  View,
  LayoutAnimation,
  FlatList,
  LayoutAnimationConfig,
} from "react-native";
import Notice from "src/components/notice/Notice";
import { TNotice } from "src/components/notice/Notice.types";

type TNoticeProviderProps = {
  children: JSX.Element;
};

export const NoticeContext = createContext<{
  notices: TNotice[];
  changeNotices: (notices: TNotice[]) => void;
}>({ notices: [], changeNotices: undefined });

const layoutAnimConfig: LayoutAnimationConfig = {
  duration: 300,
  update: {
    type: LayoutAnimation.Types.easeInEaseOut,
  },
  delete: {
    duration: 300,
    delay: 10000,
    type: LayoutAnimation.Types.easeInEaseOut,
    property: LayoutAnimation.Properties.opacity,
  },
};

const NoticeProvider: React.FC<TNoticeProviderProps> = ({ children }) => {
  const [notices, setNotices] = useState<TNotice[]>([]);

  useEffect(() => {
    if (!notices.length) return;
    const timeoutId = setInterval(() => {
      const newNotices = [...notices];
      const deletedNotice = newNotices.shift();
      setNotices(
        notices.map((n) =>
          n.id === deletedNotice.id ? { ...n, animating: true } : n
        )
      );
      setTimeout(() => {
        LayoutAnimation.configureNext(layoutAnimConfig);
        setNotices(newNotices);
      }, 250);
    }, 3000);
    return () => clearInterval(timeoutId);
  }, [notices]);

  return (
    <NoticeContext.Provider
      value={{
        notices,
        changeNotices: (newNotices) => {
          const notice = notices.find(n =>
            n.message === newNotices.at(-1).message
          )
          if(notice) return
          setNotices(newNotices);
        },
      }}
    >
      {children}
      <View
        pointerEvents="none"
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
        }}
      >
        <FlatList
          pointerEvents="box-none"
          data={notices}
          contentContainerStyle={{
            position: "absolute",
            flexDirection: "column-reverse",
            width: "100%",
            height: "100%",
            gap: 10,
            padding: 18,
            paddingBottom: 70,
          }}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item: notice }) => (
            <Notice
              message={notice.message}
              type={notice.type}
              animating={notice.animating}
            />
          )}
        />
      </View>
    </NoticeContext.Provider>
  );
};

export default NoticeProvider;
