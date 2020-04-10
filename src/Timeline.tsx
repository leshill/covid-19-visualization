import React, { useEffect } from 'react';
import { Dispatch } from 'redux';
import { useDispatch, useSelector } from 'react-redux';

import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';

import { FaFastForward } from 'react-icons/fa';
import { FaFastBackward } from 'react-icons/fa';
import { FaPauseCircle } from 'react-icons/fa';
import { FaPlayCircle } from 'react-icons/fa';
import { FaStepBackward } from 'react-icons/fa';
import { FaStepForward } from 'react-icons/fa';

import "Timeline.scss";

import { AppThunk, RootState } from 'reducers';
import { getNextState, getPrevState, getStateForDate } from 'sagas';
import { finish, next, pause, prev, reload, reset, run } from 'flowSlice';
import { days, fromISO, nextDay } from 'dateUtils';
import reds from 'reds';

function percentPosition(start: string, current: string, last: string) {
  const cDate = nextDay(current);
  const sDate = fromISO(start);
  const eDate = nextDay(last);

  return days(sDate, cDate)/days(sDate, eDate) * 100;
}

function goToEnd(): AppThunk {
  return (dispatch: Dispatch, getState: () => RootState) => {
    const { fipsMap, currentTotal } =
      getStateForDate(getState(), (state) => state.flow.endDate);
    dispatch(finish({fipsMap, currentTotal}));
  }
}

function goToStart(): AppThunk {
  return (dispatch: Dispatch, getState: () => RootState) => {
    const { fipsMap, currentTotal } =
      getStateForDate(getState(), (state) => state.flow.startDate);
    dispatch(reset({fipsMap, currentTotal}));
  }
}

function stepBackward(): AppThunk {
  return (dispatch: Dispatch, getState: () => RootState) => {
    const { date, fipsMap, currentTotal } = getPrevState(getState());
    dispatch(prev({date, fipsMap, currentTotal}));
  }
}

function stepForward(): AppThunk {
  return (dispatch: Dispatch, getState: () => RootState) => {
    const { date, fipsMap, currentTotal } = getNextState(getState());
    dispatch(next({date, fipsMap, currentTotal}));
  }
}

const Timeline: React.FC = () => {
  const {
    commitMessage,
    currentDate,
    currentTotal,
    endDate,
    startDate,
    step
  } = useSelector((state: RootState) => state.flow);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(reload())
  }, [dispatch]);

  var percent: number;
  const notPaused = step !== 'paused';
  const notRunning = step !== 'running';
  const notRunningOrPaused = notPaused && notRunning;

  if (currentDate === startDate) {
    percent = 0;
  } else if (currentDate === endDate) {
    percent = 100;
  } else {
    percent = percentPosition(startDate, currentDate, endDate);
  }

  const onGotoEnd = (event: React.MouseEvent) => {
    dispatch(goToEnd());
    event.preventDefault();
  }

  const onGotoStart = (event: React.MouseEvent) => {
    dispatch(goToStart());
    event.preventDefault();
  }

  const onNext = (event: React.MouseEvent) => {
    dispatch(stepForward());
    event.preventDefault();
  }

  const onPausePlay = (event: React.MouseEvent) => {
    if (step === 'running') {
      dispatch(pause('Paused'))
    } else if (step === 'paused') {
      dispatch(run());
    }
    event.preventDefault();
  }

  const onPrev = (event: React.MouseEvent) => {
    dispatch(stepBackward());
    event.preventDefault();
  }

  const onReload = (event: React.MouseEvent) => {
    dispatch(reload());
    event.preventDefault();
  }

  return (
    <div className="timeline-container">
      <div className="timeline-head row mb-2 w-100">
        <div className="col-md timeline-head-left">
          <small>
            Data is usually updated once a day.
          </small>
        </div>
        <div className="col-md timeline-head">
          <ButtonToolbar>
            <ButtonGroup size="sm" className="mr-1">
              <Button variant="dark" onClick={onGotoStart} disabled={notRunningOrPaused}>
                Reset
              </Button>
            </ButtonGroup>
            <ButtonGroup size="sm">
              <Button variant="dark" onClick={onReload} disabled={notPaused}>
                Get New Data
              </Button>
            </ButtonGroup>
          </ButtonToolbar>
        </div>
        <div className="col-md timeline-head-right">
          <small>
            {commitMessage || 'Loading...'}
          </small>
        </div>
      </div>
      <div className="timeline">
        <div className="timeline-line">
          <div className="timeline-start"/>
          <div className="timeline-circle" style={{left: `${percent}%`}}/>
          <div className="timeline-end"/>
          <span className="timeline-label-start badge badge-dark">
            { startDate }
          </span>
          <span className="timeline-label-end badge badge-dark">
            { endDate }
          </span>
          <span
            className="timeline-label badge"
            style={{left: `${percent}%`, backgroundColor: reds(currentTotal)}}
          >
            { currentDate }
          </span>
          <span
            className="timeline-label-total badge"
            style={{backgroundColor: reds(currentTotal)}}
          >
            total: {currentTotal}
          </span>
        </div>
      </div>
      <ButtonToolbar>
        <ButtonGroup size="sm" className="controls">
          <Button variant="dark" onClick={onGotoStart} disabled={notPaused}>
            <FaFastBackward/>
          </Button>
          <Button variant="dark" onClick={onPrev} disabled={notPaused}>
            <FaStepBackward/>
          </Button>
          <Button variant="dark" onClick={onPausePlay} disabled={notRunningOrPaused}>
            { step === 'running' ?
              <FaPauseCircle/>
              :
              <FaPlayCircle/>
            }
          </Button>
          <Button variant="dark" onClick={onNext} disabled={notPaused}>
            <FaStepForward/>
          </Button>
          <Button variant="dark" onClick={onGotoEnd} disabled={notPaused}>
            <FaFastForward/>
          </Button>
        </ButtonGroup>
      </ButtonToolbar>
    </div>
  );
};

export default Timeline;
