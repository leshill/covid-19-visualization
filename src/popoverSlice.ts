import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { DataPoint } from 'loadData';

export type PopoverState = {
  fips: string,
  point: DataPoint,
  rect: ClientRect,
  visible: boolean
}

const initialState: PopoverState  = {
  fips: '',
  point: {} as DataPoint,
  rect: {} as ClientRect,
  visible: false
};

const popoverSlice= createSlice({
  name: "popover",
  initialState,
  reducers: {
    show(_state: PopoverState, action: PayloadAction<{
      fips: string,
      rect: ClientRect,
      point: DataPoint
    }>) {
      const {fips, rect, point} = action.payload;
      return {visible: true, fips, rect, point};
    },
    hide(_state: PopoverState, _action: PayloadAction) {
      return initialState;
    }
  }
});

export const {
  hide,
  show
} = popoverSlice.actions;

export default popoverSlice.reducer;
