import { eventChannel, EventChannel, END } from 'redux-saga';
import { all, call, put, select, take, takeEvery } from 'redux-saga/effects';

import { RootState } from 'reducers';
import { loaded, DataPoints } from 'dataSlice';
import {
  errorRaised,
  gitHubStatus,
  next,
  pause,
  ready,
  reload,
  run
} from 'flowSlice';
import loadData, { DataPoint } from 'loadData';
import { fromISO, nextDay, prevDay } from 'dateUtils';
import commitSHA from 'gitHubAPI';

function* fetchCommit() {
  try {
    const sha = yield commitSHA();
    yield put(gitHubStatus(sha));
  }
  catch(error) {
    console.log('GitHub error', error.message);
  }
}

function* fetchData() {
  try {
    const maps = yield loadData()
    yield put(loaded(maps));

    const dates = Object.keys(maps.byDate).sort();
    const fipsMap = maps.byDate[dates[0]] || {} as DataPoints;
    yield put(ready({fipsMap, startDate: dates[0], endDate: dates[dates.length -1]}));
    yield fetchCommit();
  }
  catch(error) {
    yield put(errorRaised(error.message));
  }
}

export function getStateForDate(state: RootState,
                                dateFn: (state: RootState) => string) {
  const {data: {byDate}} = state;
  const date = dateFn(state);
  const fipsMap = byDate[date] || {} as DataPoint;
  return {date, fipsMap};
}

export function getPrevState(state: RootState) {
  return getStateForDate(
    state,
    (state) => prevDay(state.flow.currentDate).toISODate()
  );
}

export function getNextState(state: RootState) {
  return getStateForDate(
    state,
    (state) => nextDay(state.flow.currentDate).toISODate()
  );
}

function interval(delay: number) {
  return eventChannel<'next'>((emitter: (input: 'next' | END) => void) => {
    const iv = window.setInterval(() => {
      emitter('next');
    }, delay);

    return () => {
      clearInterval(iv);
    }
  });
}

function* load() {
  yield takeEvery(reload.type, fetchData);
}

const gitHubChannel = interval(3600 * 1000);

function* monitorGitHub() {
  while (true) {
    yield take(gitHubChannel);
    yield call(fetchCommit);
  }
}

var stepChannel: EventChannel<"next">;

function* runSteps() {
  stepChannel = interval(750);

  while (true) {
    yield take(stepChannel);

    const state = yield select((state: RootState) => state);
    const {date, fipsMap} = getNextState(state);

    const proposed = fromISO(date);
    const finish = fromISO(state.flow.endDate);

    if (proposed <= finish) {
      yield put(next({date, fipsMap}));
    } else {
      yield put(pause('Done'));
    }
  }
}

function* runTimer() {
  yield takeEvery([ready.type, run.type], runSteps);
}

function closeChannel() {
  stepChannel.close();
}

function* stopTimer() {
  yield takeEvery(pause.type, function* () { yield call(closeChannel); });
}

function* rootSaga() {
  yield all([
    load(),
    monitorGitHub(),
    runTimer(),
    stopTimer()
  ]);
}

export default rootSaga;
