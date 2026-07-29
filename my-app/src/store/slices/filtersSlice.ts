import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface FiltersState {
  search: string;
  makes: string[];
  states: string[];
  bodies: string[];
  priceRange: [number, number];
  dateRange: [string | null, string | null];
  chartFilter: string | null;
}

const initialState: FiltersState = {
  search: "",
  makes: [],
  states: [],
  bodies: [],
  priceRange: [0, 100000],
  dateRange: [null, null],
  chartFilter: null,
};

const filtersSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setSearch(state, action: PayloadAction<string>) {
      state.search = action.payload;
    },
    setMakes(state, action: PayloadAction<string[]>) {
      state.makes = action.payload;
    },
    setStates(state, action: PayloadAction<string[]>) {
      state.states = action.payload;
    },
    setBodies(state, action: PayloadAction<string[]>) {
      state.bodies = action.payload;
    },
    setPriceRange(state, action: PayloadAction<[number, number]>) {
      state.priceRange = action.payload;
    },
    setDateRange(state, action: PayloadAction<[string | null, string | null]>) {
      state.dateRange = action.payload;
    },
    setChartFilter(state, action: PayloadAction<string | null>) {
      state.chartFilter = action.payload;
    },
    resetFilters() {
      return initialState;
    },
  },
});

export const {
  setSearch,
  setMakes,
  setStates,
  setBodies,
  setPriceRange,
  setDateRange,
  setChartFilter,
  resetFilters,
} = filtersSlice.actions;

export default filtersSlice.reducer;
