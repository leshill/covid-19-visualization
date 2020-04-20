import React from 'react';

import 'Main.scss';

import { FaFacebookF, FaGithub, FaHeart, FaTwitter } from 'react-icons/fa';

import DataBox from 'DataBox';
import Map from 'Map';
import Timeline from 'Timeline';

const SITE_URL = encodeURI('https://covid-19-map.leshill.app/');
const TWITTER_LINK = 'https://twitter.com/intent/tweet?' +
                     'text=' + encodeURI('Awesome Covid-19 timeline in the US by county\n') +
                     '&url=' + SITE_URL +
                     '&hashtags=covid_19,visualization' +
                     '&via=leshill';

const FACEBOOK_LINK = 'http://www.facebook.com/sharer.php?' +
                      'u=' + SITE_URL;


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
        <div className="sharing">
          <div className="share facebook">
            <a className="stretched-link" href={FACEBOOK_LINK} target="_blank" rel="noopener noreferrer">
              Share on Facebook
            </a>
            <FaFacebookF className="ml-1" color="rgb(45,69,134)"/>
          </div>
          <div className="share made-with">
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
          <div className="share twitter">
            <a className="stretched-link" href={TWITTER_LINK} target="_blank" rel="noopener noreferrer">
              Share on Twitter
            </a>
            <FaTwitter className="ml-1" color="rgb(29,141,238)"/>
          </div>
        </div>
      </header>
      <Timeline/>
      <div className="map-box">
        <Map
          preserveAspectRatio="xMidYMid meet"
        />
      </div>
      <div className="github-container w-100">
        <div className="github-link row">
          <div className="github-label col-sm">
            <span>
              FAQ and Source code:
            </span>
          </div>
          <div className="col-sm github-repo">
            <a
              className="github btn btn-sm stretched-link"
              href="https://github.com/leshill/covid-19-visualization">
              <FaGithub size="1.75em" />
              <span>
                @leshill/covid-19-visualization
              </span>
            </a>
          </div>
        </div>
        <div className="github-link row">
          <div className="github-label col-sm">
            <span>
              Source data:
            </span>
          </div>
          <div className="github-repo col-sm">
            <a
              className="github btn btn-sm stretched-link"
              href="https://github.com/nytimes/covid-19-data">
              <FaGithub size="1.75em" />
              <span>
                @nytimes/covid-19-data
              </span>
            </a>
          </div>
        </div>
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
