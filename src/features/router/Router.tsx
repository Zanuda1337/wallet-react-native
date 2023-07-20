import React from "react";

import { NativeRouter, Route, Routes } from "react-router-native";


import PrimaryLayout from "src/layouts/PrimaryLayout/PrimaryLayout";
import Feed from "features/feed/Feed";
import Transactions from "features/transactions/Transactions";

type TRouterProps = {};

const Router: React.FC<TRouterProps> = ({}) => {
  return (
    <NativeRouter>
      <Routes>
        <Route Component={PrimaryLayout}>r
          <Route path="/" Component={Transactions} />
          <Route path="/feed" Component={Feed} />
        </Route>
      </Routes>
    </NativeRouter>
  );
};

export default Router;
