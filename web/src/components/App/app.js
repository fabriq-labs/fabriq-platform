// App
import React from "react";

// redux
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/lib/integration/react";

import GlobalStyle from "../Common/global_style";
import Client from "../../client";
import Layout from "../../containers/layout";
import { Skeleton } from "../Skeleton";
import { persistor, store } from "../../store";
import "../../utils/i18n";

import "antd/dist/antd.css";
import "../../styles/font-awesome.css";

// Initialize
Client.initialize();

// App
const App = ({ activeTab, updateActiveTab, refreshActiveMenu }) => (
  <Provider store={store}>
    <PersistGate loading={<Skeleton />} persistor={persistor}>
      <Layout
        activeTab={activeTab}
        updateActiveTab={updateActiveTab}
        refreshActiveMenu={refreshActiveMenu}
      />
      <GlobalStyle />
    </PersistGate>
  </Provider>
);

export default App;
