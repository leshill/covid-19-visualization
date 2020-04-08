import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { DataPoint } from 'loadData';

export type CountRecord = Record<string, number>;
export type DataPoints = Record<string, DataPoint>;
export type DoubleIndexPoints = Record<string, DataPoints>;

export type DataState = {
  byDate: DoubleIndexPoints;
  byFips: DoubleIndexPoints;
  totalsByDate: CountRecord;
};

const initialState: DataState  = {
  byDate: {},
  byFips: {},
  totalsByDate: {}
};

const dataSlice = createSlice({
  name: "data",
  initialState,
  reducers: {
    loaded(_state: DataState, action: PayloadAction<DataState>) {
      return action.payload;
    },
  }
});

export const {
  loaded
} = dataSlice.actions;

export default dataSlice.reducer;
