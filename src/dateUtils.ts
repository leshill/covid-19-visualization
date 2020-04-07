import { DateTime, Interval } from 'luxon';

export function days(start: DateTime, finish: DateTime) {
  return Interval.fromDateTimes(start, finish).length('days');
}

export function fromISO(text: string) {
  return DateTime.fromISO(text);
}

export function nextDay(text: string) {
  return fromISO(text).plus({days: 1});
}

export function prevDay(text: string) {
  return fromISO(text).minus({days: 1});
}
