import { FilterType } from '../const';

export const filter = {
  [FilterType.EVERYTHING]: (points) => points.slice(),
  [FilterType.FUTURE]: (points) => points.filter(({ dateFrom }) => dateFrom >= new Date()),
  [FilterType.PAST]: (points) => points.filter(({ dateTo }) => dateTo < new Date()),
};
