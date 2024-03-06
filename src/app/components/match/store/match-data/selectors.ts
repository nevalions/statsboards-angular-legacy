import { selectMatchDataLoading } from './reducers';
import { selectMatchIsLoading } from '../reducers';
import { createSelector } from '@ngrx/store';

export const selectMatchAndMatchDataLoaded = createSelector(
  selectMatchIsLoading,
  selectMatchDataLoading,
  (matchLoading, matchDataLoading) => !matchLoading && !matchDataLoading,
);
