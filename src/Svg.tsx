import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import * as SvgTypes from './svgTypes';
import { RootState } from 'reducers';
import reds from 'reds';
import { DataPoint } from 'loadData';
import { hidePopover, showPopover } from 'popover';

type SvgCore = SvgTypes.CoreProps &
               SvgTypes.EventProps &
               SvgTypes.PresentationProps;

type GProps = SvgCore;

export const G: React.FC<GProps> = (props) => {
  return <g {...props} />;
}

export type SvgProps = SvgTypes.SvgProps & SvgCore;

export const Svg: React.FC<SvgProps> = (props) => {
  return <svg {...props} />;
}

type PathPropsType = SvgTypes.PathProps & SvgCore;

export const Path: React.FC<PathPropsType> = (props) => {
  const fips = props.id;

  const dispatch = useDispatch();
  const selector = useCallback((state: RootState) => {
    if (fips) {
      const data = state.flow.currentDataByFips[fips];
      if (data) {
        return data;
      }
    }

    return {} as DataPoint;
  }, [fips]);
  const data = useSelector(selector);
  const {children, ...rest} = props;

  if (fips && data.cases) {
    rest.style = {fill: reds(data.cases)};
  }

  rest.onMouseEnter = (event: React.MouseEvent) => {
    if (fips && data.cases) {
      const rect = (event.target as any).getBoundingClientRect();
      dispatch(showPopover(rect, data));
    }
  };
  rest.onMouseLeave = (_event: React.MouseEvent) => dispatch(hidePopover());

  return (
    <path {...rest}/>
  );
}

export default Svg;
