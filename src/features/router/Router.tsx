import React from "react";

import { NativeRouter, Route, Routes } from "react-router-native";

import PrimaryLayout from "src/layouts/PrimaryLayout/PrimaryLayout";
import { routes } from "./Router.consts";

type TRouterProps = {};

const Router: React.FC<TRouterProps> = ({}) => {
  return (
    <NativeRouter>
      <Routes>
        <Route Component={PrimaryLayout}>
          r
          {routes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              Component={route.component}
            />
          ))}
        </Route>
      </Routes>
    </NativeRouter>
  );
};

export default Router;
