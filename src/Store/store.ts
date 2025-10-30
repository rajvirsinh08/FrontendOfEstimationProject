// // src/store/store.ts
// import { configureStore } from "@reduxjs/toolkit";
// import userReducer from "./userSlice";

// export const store = configureStore({
//   reducer: {
//     user: userReducer,
//   },
// });

// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;
// src/store/store.ts
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import { persistReducer, persistStore } from "redux-persist";

// 🔹 Combine all reducers
const rootReducer = combineReducers({
  user: userReducer,
});

// 🔹 Redux Persist configuration
const persistConfig = {
  key: "root", // key in localStorage
  storage,
};

// 🔹 Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// 🔹 Configure store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // required by redux-persist
    }),
});

// 🔹 Create persistor
export const persistor = persistStore(store);

// 🔹 Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
