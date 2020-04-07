import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { DataPoints } from 'dataSlice';
import { fromISO } from 'dateUtils';

/*
  https://planttext.com

  @startuml
  [*] --> init

  init --> loading : reload

  loading --> running : ready
  loading --> error : error

  running --> running : next, reset
  running --> paused : pause

  paused --> running : run
  paused --> loading : reload
  paused --> paused : reset, next, prev, finish

  error --> loading : reload
  @enduml
*/

export type Machine = 'error' | 'init' | 'loading' | 'running' | 'paused';

interface FlowState {
  currentCommit: string,
  commitMessage: string,
  currentDataByFips: DataPoints,
  currentDate: string,
  endDate: string,
  errorMessage: string,
  latestCommit: string,
  message: string,
  startDate: string,
  step: Machine
}

const initialState: FlowState  = {
  currentCommit: '',
  commitMessage: '',
  currentDataByFips: {} as DataPoints,
  currentDate: '2020-01-01',
  endDate: '2020-12-31',
  errorMessage: '',
  latestCommit: '',
  message: 'Loading',
  startDate: '2020-01-01',
  step: 'init' as Machine
};

const flowSlice = createSlice({
  name: 'flow',
  initialState,
  reducers: {
    errorRaised(state: FlowState, action: PayloadAction<string>) {
      state.step = 'error' as Machine;
      state.errorMessage = action.payload;
    },
    finish(state: FlowState, action: PayloadAction<DataPoints>) {
      if (state.step === 'paused') {
        state.currentDataByFips = action.payload;
        state.currentDate = state.endDate;
      }
    },
    gitHubStatus(state: FlowState, action: PayloadAction<string>) {
      if (state.currentCommit) {
        state.latestCommit = action.payload;
        if (state.currentCommit !== action.payload) {
          state.commitMessage = 'Newer data is available';
        } else {
          state.commitMessage = 'This is the latest data available.';
        }
      } else {
        state.currentCommit = state.latestCommit = action.payload;
        state.commitMessage = 'This is the latest data available.';
      }
    },
    next(state: FlowState, action: PayloadAction<{date: string, fipsMap: DataPoints}>) {
      if (state.step === 'running' || state.step === 'paused') {
        const proposed = fromISO(action.payload.date);
        const finish = fromISO(state.endDate);

        if (proposed < finish) {
          state.currentDataByFips = action.payload.fipsMap;
          state.currentDate = action.payload.date;
        } else if (+proposed === +finish) {
          state.currentDataByFips = action.payload.fipsMap;
          state.currentDate = action.payload.date;
        }
      }
    },
    pause(state: FlowState, action: PayloadAction<string>) {
      if (state.step === 'running') {
        state.step = 'paused' as Machine;
        state.message = action.payload;
      }
    },
    prev(state: FlowState, action: PayloadAction<{date: string, fipsMap: DataPoints}>) {
      if (state.step === 'running' || state.step === 'paused') {
        const proposed = fromISO(action.payload.date);
        const start = fromISO(state.startDate);

        if (proposed > start) {
          state.currentDataByFips = action.payload.fipsMap;
          state.currentDate = action.payload.date;
        } else if (+proposed === +start) {
          state.currentDataByFips = action.payload.fipsMap;
          state.currentDate = action.payload.date;
        } else if (state.step === 'running') {
          state.step = 'paused' as Machine;
        }
      }
    },
    ready(
      state: FlowState,
      action: PayloadAction<{
        fipsMap: DataPoints,
        endDate: string,
        startDate: string
      }>) {
      if (state.step === 'loading') {
        state.step = 'running' as Machine;
        state.currentDate = action.payload.startDate;
        state.endDate = action.payload.endDate;
        state.startDate = action.payload.startDate;
        state.currentDataByFips = action.payload.fipsMap;
        state.message = 'Running';
        state.latestCommit = state.currentCommit = '';
        state.commitMessage = '';
      }
    },
    reload(state: FlowState) {
      if (state.step === 'paused' || state.step === 'init') {
        return {...initialState, step: 'loading'};
      }
    },
    reset(state: FlowState, action: PayloadAction<DataPoints>) {
      if (state.step === 'paused' || state.step === 'running') {
        state.currentDate = state.startDate;
        state.currentDataByFips = action.payload;
      }
    },
    run(state: FlowState) {
      if (state.step === 'paused') {
        state.step = 'running' as Machine;
        state.message = 'Running';
      }
    },
  }
});

export const {
  errorRaised,
  finish,
  gitHubStatus,
  next,
  pause,
  prev,
  ready,
  reload,
  reset,
  run
} = flowSlice.actions;

export default flowSlice.reducer;
