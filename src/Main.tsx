import React from 'react';

import 'Main.scss';

import { FaGithub, FaHeart } from 'react-icons/fa';

import DataBox from 'DataBox';
import Map from 'Map';
import Timeline from 'Timeline';

function Main() {
  return (
    <div>
      <header className="w-100 p-3 mb-3 text-center">
        <h2>
          Visualizing Covid-19 case counts by county in the US
        </h2>
        <h4>
          Data from The New York Times, based on reports from state and local health agencies.
        </h4>
        <div className="made-with">
          <span>
            Made with
          </span>
          <FaHeart className="mx-1" color="red"/>
          <span>
            in Seattle by
          </span>
          <a className="ml-1 stretched-link" href="https://twitter.com/leshill">
            @leshill
          </a>
        </div>
      </header>
      <Timeline/>
      <div className="map-box">
        <Map
          preserveAspectRatio="xMidYMid meet"
        />
      </div>
      <div className="github-container w-100">
        <span className="mr-3">
          FAQ and Source code:
        </span>
        <a
          className="btn btn-sm github"
          href="https://github.com/leshill/covid-19-visualization">
          <FaGithub size="1.75em" />
          <span>
            @leshill/covid-19-data-visualization
          </span>
        </a>
        <span className="mx-3">
          Source data:
        </span>
        <a
          className="btn btn-sm github"
          href="https://github.com/nytimes/covid-19-data">
          <FaGithub size="1.75em" />
          <span>
            @nytimes/covid-19-data
          </span>
        </a>
      </div>
      <div className="w-100 d-flex justify-content-end">
        <small className="mr-5">
          Copyright &copy; 2020 Les Hill
        </small>
      </div>
      <DataBox/>
    </div>
  );
}

export default Main;
