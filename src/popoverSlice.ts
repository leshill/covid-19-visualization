import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { DataPoint } from 'loadData';

export type PopoverState = {
  point: DataPoint,
  rect: ClientRect,
  visible: boolean
}

const initialState: PopoverState  = {
  point: {} as DataPoint,
  rect: {} as ClientRect,
  visible: false
};

const popoverSlice= createSlice({
  name: "popover",
  initialState,
  reducers: {
    show(_state: PopoverState, action: PayloadAction<{rect: ClientRect, point: DataPoint}>) {
      const {rect, point} = action.payload;
      return {visible: true, rect, point};
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
