import { compareAsc, formatDuration } from 'date-fns';

import getDifferenceBetweenDatesInTimeUnits from './getDifferenceBetweenDatesInTimeUnits';

type formatDistanceLocaleKey = 'xMinutes' | 'xHours' | 'xDays' | 'xWeeks';

// Get expiry time in short formats, ie:
// 20MIN
// 1H 59MIN
// 23H
// 4D 23H
// 3W 6D

export const getExpiryTranslation = (
  expiry: Date,
  now: Date,
): string | undefined => {
  if (compareAsc(expiry, now) === -1) {
    return undefined;
  }

  const {
    minutes,
    hours,
    days,
    weeks,
  } = getDifferenceBetweenDatesInTimeUnits(
    expiry,
    now,
  );

  const formatDistanceLocale: Record<formatDistanceLocaleKey, string> = {
    xMinutes: '{{count}} MIN',
    xHours: '{{count}}H',
    xDays: '{{count}}D',
    xWeeks: '{{count}}W',
  };
  const locale: Locale = {
    formatDistance: (token: formatDistanceLocaleKey, count: number): string => formatDistanceLocale[token].replace('{{count}}', count.toString()),
  };

  const format: string[] = [
    ...(weeks ? ['weeks'] : []),
    ...(days ? ['days'] : []),
    ...(hours ? ['hours'] : []),
    ...(minutes ? ['minutes'] : []),
    // We only need max two time units
  ].slice(0, 2);

  if (format.length) {
    const daysRemainder = days - weeks * 7;
    const hoursRemainder = hours - days * 24;
    const minutesRemainder = minutes - hours * 60;
    return formatDuration(
      {
        weeks,
        days: daysRemainder,
        hours: hoursRemainder,
        minutes: minutesRemainder,
      },
      { format, locale },
    );
  }

  // If all is 0 then it probably means less than one minute is left.
  return formatDuration({ minutes: 1 }, { locale });
};
