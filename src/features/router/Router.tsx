import React from "react";
import { NativeRouter, Route, Routes } from "react-router-native";
import { layouts } from "./Router.consts";
import { getRoutesList } from "features/router/Router.utils";

type TRouterProps = {};

const Router: React.FC<TRouterProps> = ({}) => {
  return (
    <NativeRouter>
      <Routes>
        {layouts.map((layout) => (
          <Route key={layout.id} Component={layout.component}>
            {getRoutesList(layout.id).map((route) => (
              <Route
                key={route.path}
                path={route.path}
                Component={route.component}
              />
            ))}
          </Route>
        ))}
      </Routes>
    </NativeRouter>
  );
};

export default Router;
