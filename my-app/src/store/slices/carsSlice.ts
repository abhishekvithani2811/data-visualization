import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchCarSales } from "@/lib/firestore";
import type { CarSale } from "@/types/car";

interface CarsState {
  data: CarSale[];
  loading: boolean;
  error: string | null;
}

const initialState: CarsState = {
  data: [],
  loading: false,
  error: null,
};

function isAbortError(error: unknown) {
  return (
    (error instanceof DOMException && error.name === "AbortError") ||
    (error instanceof Error && error.name === "AbortError")
  );
}

export const loadCars = createAsyncThunk("cars/loadCars", async () => {
  return await fetchCarSales();
});

const carsSlice = createSlice({
  name: "cars",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadCars.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadCars.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(loadCars.rejected, (state, action) => {
        if (action.meta.aborted || isAbortError(action.error)) {
          state.loading = false;
          return;
        }
        state.loading = false;
        state.error = action.error.message ?? "Failed to load cars";
      });
  },
});

export default carsSlice.reducer;
