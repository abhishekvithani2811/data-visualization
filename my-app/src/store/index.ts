import { configureStore } from "@reduxjs/toolkit";
import carsReducer from "./slices/carsSlice";
import filtersReducer from "./slices/filtersSlice";
import themeReducer from "./slices/themeSlice";

export const makeStore = () =>
  configureStore({
    reducer: {
      cars: carsReducer,
      filters: filtersReducer,
      theme: themeReducer,
    },
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
