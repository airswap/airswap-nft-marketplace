import getDifferenceBetweenDatesInTimeUnits from './getDifferenceBetweenDatesInTimeUnits';

export default function getTimeBetweenTwoDates(
  date1: Date,
  date2: Date,
): string {
  const formatter = new Intl.RelativeTimeFormat('en', {
    numeric: 'always',
    style: 'short',
  });

  // if date is past the current date;
  if (date1 < date2) {
    return formatter.format(0, 'seconds');
  }

  const {
    minutes,
    hours,
    days,
    months,
    years,
  } = getDifferenceBetweenDatesInTimeUnits(date1, date2);

  if (years) {
    return formatter.format(-years, 'years');
  }

  if (months) {
    return formatter.format(-months, 'months');
  }

  if (days) {
    return formatter.format(-days, 'days');
  }

  if (hours) {
    return formatter.format(-hours, 'hours');
  }

  return formatter.format(-minutes, 'minutes');
}
