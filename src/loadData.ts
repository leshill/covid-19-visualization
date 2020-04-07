import Papa from 'papaparse';

import { DataState, DoubleIndexPoints } from 'dataSlice';

// SRC data row
// date,county,state,fips,cases,deaths
export interface DataPoint {
  date: string,
  county: string,
  state: string,
  fips: string,
  cases: number,
  deaths: number
}

const SRC = 'https://raw.githubusercontent.com/'
  + 'nytimes/covid-19-data/master/us-counties.csv';

const KANSAS_CITY = '99999';
const KANSAS_CITY_COUNTIES = ['29037', '29047', '29095', '29165'];
const KANSAS_CITY_MAP: {[key: string]: string} = {
  '29037': 'Cass',
  '29047': 'Clay',
  '29095': 'Jackson',
  '29165': 'Platte'
};
const NEW_YORK_CITY = '99998';
const NEW_YORK_CITY_COUNTIES = ['36005', '36047', '36061', '36081', '36085'];

function addEntry(map: DoubleIndexPoints, key1: string, key2: string, point: DataPoint) {
  if (map[key1]) {
    map[key1][key2] = point;
  } else {
    map[key1] = {[key2]: point};
  }
}

function adjustEntry(map: DoubleIndexPoints, key1: string, key2: string, blank: DataPoint) {
  if (map[key1]) {
    if (map[key1][key2]) {
      const point = map[key1][key2];
      point.cases = point.cases + blank.cases;
      point.deaths = point.cases + blank.deaths;
    } else {
      map[key1][key2] = blank;
    }
  } else {
    map[key1] = {[key2]: blank};
  }
}

function adjustKC(maps: DataState, date: string, fips: string, cases: number, deaths: number) {
  const blank1: DataPoint = {
    date,
    fips,
    cases,
    deaths,
    county: KANSAS_CITY_MAP[fips],
    state: 'Missouri'
  };
  const blank2 = {...blank1}

  adjustEntry(maps.byDate, date, fips, blank1);
  adjustEntry(maps.byFips, fips, date, blank2);
}

function adjustExceptions(maps: DataState): DataState {
  const nyc = maps.byFips[NEW_YORK_CITY];

  Object.values(nyc).forEach((point) => {
    const { date } = point;
    NEW_YORK_CITY_COUNTIES.forEach((fips) => {
      const newPoint = {...point, fips};
      addEntry(maps.byDate, date, fips, newPoint);
      addEntry(maps.byFips, fips, date, newPoint);
    });
  });

  const kc = maps.byFips[KANSAS_CITY];

  Object.values(kc).forEach((point) => {
    const { date, cases, deaths } = point;
    KANSAS_CITY_COUNTIES.forEach((fips) => {
      adjustKC(maps, date, fips, cases, deaths);
    });
  });

  return maps;
}

function transformer(value: string, header: string) {
  if (header === 'cases' || header === 'deaths') {
    return parseInt(value);
  }

  return value;
}

function fetchCSV() {
  return new Promise((resolve: (data: DataPoint[]) => void, reject: (error: Error) => void) => {
    Papa.parse(SRC, {
      download: true,
      header: true,
      fastMode: true,
      dynamicTyping: false,
      transform: transformer,
      complete: (results: Papa.ParseResult) => {
        resolve(results.data as DataPoint[]);
      },
      error: (error: Papa.ParseError) => {
        reject(new Error(error.message));
      }
    });
  });
}

async function loadData(): Promise<DataState>  {
  return fetchCSV().then((data: DataPoint[]) => processData(data));
}

function markExceptions(point: DataPoint): DataPoint {
  if (!point.fips) {
    if (point.county === 'New York City') {
      point.fips = NEW_YORK_CITY;
    } else if (point.county === 'Kansas City') {
      point.fips = KANSAS_CITY;
    }
  }
  return point;
}

function processData(points: DataPoint[]): DataState {
  const maps: DataState = {
    byDate: {},
    byFips: {},
  };

  points.forEach((point: DataPoint) => {
    markExceptions(point);
    addEntry(maps.byDate, point.date, point.fips, point);
    addEntry(maps.byFips, point.fips, point.date, point);
  });

  return adjustExceptions(maps);
}

export default loadData;
