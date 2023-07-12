import { applyMiddleware, createStore } from "redux";
import ReduxThunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { cacheEnhancer } from "redux-cache";

import autoMergeLevel2 from "redux-persist/lib/stateReconciler/autoMergeLevel2";
import reducer from "./reducers";

const persistConfig = {
  key: "root",
  storage,
  stateReconciler: autoMergeLevel2 // see "Merge Process" section for details.
};

const pReducer = persistReducer(persistConfig, reducer);

const middleware = applyMiddleware(ReduxThunk);

export const store = createStore(
  pReducer,
  undefined,
  composeWithDevTools(middleware, cacheEnhancer())
);

export const persistor = persistStore(store);
