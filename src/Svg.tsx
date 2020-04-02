import React, { useState } from 'react';
import * as SvgTypes from './svgTypes';

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
  const {children, ...rest} = props;

  const [clicked, setClicked] = useState(false);

  const fill = (event: React.MouseEvent) => {
    setClicked(!clicked);
    event.preventDefault();
  }

  if (clicked) {
    rest.style = {fill: 'red'} as any;
  }

  return <path onClick={fill} {...rest}>
    { children }
  </path>;
}

export default Svg;
