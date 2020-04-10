import { Dispatch } from 'redux';

import { AppThunk } from 'reducers';
import { DataPoint } from 'loadData';
import { hide, show } from 'popoverSlice';

export function showPopover(fips: string, rect: ClientRect, point: DataPoint): AppThunk {
  return (dispatch: Dispatch) => dispatch(show({fips, rect, point}));
}

export function hidePopover(): AppThunk {
  return (dispatch: Dispatch) => dispatch(hide());
}
