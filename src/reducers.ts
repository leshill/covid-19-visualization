import { combineReducers, Action } from '@reduxjs/toolkit';
import { ThunkAction } from 'redux-thunk';

import dataReducer from 'dataSlice';
import flowReducer from 'flowSlice';

const reducer = combineReducers({
  data: dataReducer,
  flow: flowReducer
});

export type RootState = ReturnType<typeof reducer>;
export type AppThunk = ThunkAction<void, RootState, null, Action<string>>;

export default reducer;
