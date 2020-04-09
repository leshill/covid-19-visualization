import Papa from 'papaparse';
import flatMap from 'lodash/flatMap';
import keys from 'lodash/keys';
import mapValues from 'lodash/mapValues';
import reduce from 'lodash/reduce';
import uniq from 'lodash/uniq';

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
const KANSAS_CITY_TEXT = 'Kansas City';
const NEW_YORK_CITY = '99998';
const NEW_YORK_CITY_COUNTIES = ['36005', '36047', '36061', '36081', '36085'];
const NEW_YORK_CITY_TEXT = 'New York City';

function addEntry(map: DoubleIndexPoints, key1: string, key2: string, point: DataPoint) {
  if (map[key1]) {
    map[key1][key2] = point;
  } else {
    map[key1] = {[key2]: point};
  }
}

function adjustKC(
  maps: DataState,
  date: string,
  cases: number,
  deaths: number
) {
  const countiesOnDate = KANSAS_CITY_COUNTIES.map((fips) => (
      maps.byDate[date][fips] || {
        date,
        fips,
        cases: 0,
        deaths: 0,
        county: KANSAS_CITY_MAP[fips],
        state: 'Missouri'
      }
    )
  );

  const caseTotal = countiesOnDate
    .reduce((total, county) => (total + county.cases), cases);
  const deathTotal = countiesOnDate
    .reduce((total, county) => (total + county.deaths), deaths);

  countiesOnDate.forEach((county) => {
    county.cases = caseTotal;
    county.deaths = deathTotal;

    const county2 = {...county};

    addEntry(maps.byDate, date, county.fips, county);
    addEntry(maps.byFips, county.fips, date, county2);
  });
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

  const datesWithData = kcDates(maps.byFips);

  const kc = maps.byFips[KANSAS_CITY];

  datesWithData.forEach((date) => {
    const kcData = kc[date];
    const cases = kcData ? kcData.cases : 0;
    const deaths = kcData ? kcData.deaths : 0;

    adjustKC(maps, date, cases, deaths);
  })

  return maps;
}

const IGNORE_FIPS = [
  ...NEW_YORK_CITY_COUNTIES.slice(1),
  ...KANSAS_CITY_COUNTIES.slice(1),
  NEW_YORK_CITY,
  KANSAS_CITY
];

function calculateTotals(maps: DataState): DataState {
  maps.totalsByDate = mapValues(maps.byDate, (byFips) => {
    return reduce(byFips, (total: number, county: DataPoint) => {
      const cases = IGNORE_FIPS.includes(county.fips) ? 0 : county.cases;
      return total + cases;
    }, 0);
  });

  return maps;
}

export function countyName(point: DataPoint) {
  if (NEW_YORK_CITY_COUNTIES.includes(point.fips)) {
    return NEW_YORK_CITY_TEXT;
  } else if (KANSAS_CITY_COUNTIES.includes(point.fips)) {
    return KANSAS_CITY_TEXT;
  }

  return point.county;
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

function kcDates(fipsMap: DoubleIndexPoints) {
  const dates = flatMap([...KANSAS_CITY_COUNTIES, KANSAS_CITY], (fips) => {
    if (fipsMap[fips]) {
      return keys(fipsMap[fips]);
    } else {
      return [];
    }
  });

  return uniq(dates);
}

async function loadData(): Promise<DataState>  {
  return fetchCSV().then((data: DataPoint[]) => processData(data));
}
const unknownMap = {} as Record<string, string>;
var unknownId = 99000;

function markExceptions(point: DataPoint): DataPoint {
  if (!point.fips) {
    if (point.county === 'New York City') {
      point.fips = NEW_YORK_CITY;
    } else if (point.county === 'Kansas City') {
      point.fips = KANSAS_CITY;
    } else if (unknownMap[point.state]) {
      point.fips = unknownMap[point.state];
    } else {
      unknownMap[point.state] = unknownId + '';
      ++unknownId;
    }
  }

  return point;
}

function processData(points: DataPoint[]): DataState {
  const maps: DataState = {
    byDate: {},
    byFips: {},
    totalsByDate: {},
  };

  points.forEach((point: DataPoint) => {
    markExceptions(point);
    addEntry(maps.byDate, point.date, point.fips, point);
    addEntry(maps.byFips, point.fips, point.date, point);
  });

  const adjusted = adjustExceptions(maps);
  return calculateTotals(adjusted);
}

export default loadData;
