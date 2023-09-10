import React from "react";
import { NativeRouter, Route, Routes } from "react-router-native";
import { getRoutesList } from "features/router/Router.utils";
import PrimaryLayout from "src/layouts/primaryLayout/PrimaryLayout";
import EmptyLayout from "src/layouts/emptyLayout/EmptyLayout";

type TRouterProps = {};

const layouts = [
  { id: 1, component: PrimaryLayout },
  {id: 2, component: EmptyLayout}
]

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
