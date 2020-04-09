import { combineReducers, Action } from '@reduxjs/toolkit';
import { ThunkAction } from 'redux-thunk';

import dataReducer from 'dataSlice';
import flowReducer from 'flowSlice';
import popoverReducer from 'popoverSlice';

const reducer = combineReducers({
  data: dataReducer,
  flow: flowReducer,
  popover: popoverReducer
});

export type RootState = ReturnType<typeof reducer>;
export type AppThunk = ThunkAction<void, RootState, null, Action<string>>;

export default reducer;
