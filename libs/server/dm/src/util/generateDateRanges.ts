import {
  format,
  addDays,
  isAfter,
  isBefore,
  startOfDay,
  toDate,
  endOfToday,
  endOfDay,
  parse,
  isEqual,
} from 'date-fns';

type DateRange = {
  from: string;
  to: string;
};

export function generateDateRanges(
  from: string,
  to: string = format(endOfToday(), 'dd.MM.yyyy'),
  step: number = 7,
): DateRange[] {
  const startDate = parse(from, 'dd.MM.yyyy', new Date());
  const endDate = parse(to, 'dd.MM.yyyy', new Date());

  const chunks: DateRange[] = [];
  let currentStart = startDate;

  while (isAfter(endDate, currentStart) || isEqual(currentStart, endDate)) {
    let chunkEnd = addDays(currentStart, step - 1);

    if (isAfter(chunkEnd, endDate)) {
      chunkEnd = endDate;
    }

    chunks.push({
      from: format(currentStart, 'dd.MM.yyyy'),
      to: format(chunkEnd, 'dd.MM.yyyy'),
    });

    currentStart = addDays(chunkEnd, 1);

    // If we've reached or passed the end date, break the loop
    if (isAfter(currentStart, endDate)) {
      break;
    }
  }

  return chunks;
}
