import React from 'react';
import { useSelector } from 'react-redux';

import 'DataBox.scss';

import { RootState } from 'reducers';
import { countyName } from 'loadData';
import reds from 'reds';

const DataBox: React.FC = () => {
  const {visible, rect, point} = useSelector((state: RootState) => state.popover);

  const top = rect.top ? (rect.top + rect.bottom)/2 : 0;
  const left = rect.left ? (rect.left + rect.right)/2 : 0;
  const style: React.CSSProperties = {
    display: visible ? 'block' : 'none',
    position: 'fixed',
    top: top + 'px',
    left: left + 'px'
  };

  return (
    <div style={style} className="popover fade show">
      <h3 className="popover-header">
        { countyName(point) }, { point.state }
      </h3>
      <div className="popover-body" style={{backgroundColor: reds(point.cases)}}>
        { point.cases } case{ point.cases === 1 ? '' : 's'}
      </div>
    </div>
  );
};

export default DataBox;
