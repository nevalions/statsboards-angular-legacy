import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import {
  IFootballEvent,
  IFootballEventWithPlayers,
} from '../../../type/football-event.type';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/appstate';
import {
  selectAllMatchFootballEvents,
  selectCurrentFootballEvent,
  selectFootballEventIsLoading,
  selectFootballEventIsSubmitting,
} from './store/reducers';
import { footballEventActions } from './store/actions';
import { selectFootballEventsWithPlayers } from './store/selectors';
import {
  IPlayerInMatchFullDataWithOffenceStats,
  IPlayerInMatchFullDataWithQbStats,
} from '../../../type/player.type';
import {
  selectFootballTeamAWithStats,
  selectFootballTeamBWithStats,
  selectOverallFlagOffenceYardsForTeamA,
  selectOverallFlagOffenceYardsForTeamB,
  selectOverallOffenceDistanceForTeamA,
  selectOverallOffenceDistanceForTeamB,
  selectOverallPassDistanceForTeamA,
  selectOverallPassDistanceForTeamB,
  selectOverallRunDistanceForTeamA,
  selectOverallRunDistanceForTeamB,
} from './store/football-stats-team-match-selector';
import {
  selectAllQuarterbacksWithStatsTeamA,
  selectAllQuarterbacksWithStatsTeamB,
} from './store/football-stats-qb-match-selector';
import {
  selectAllPlayersWithOffenseStatsTeamA,
  selectAllPlayersWithOffenseStatsTeamB,
} from './store/football-stats-offence-match-selector';
import { IFootballTeamWithStats } from '../../../type/team.type';

@Injectable({
  providedIn: 'root',
})
export class FootballEvent {
  private store = inject<Store<AppState>>(Store);

  footballEvent$: Observable<IFootballEvent | null | undefined>;
  allMatchFootballEvents$: Observable<IFootballEvent[]>;
  allMatchFootballEventsWithPlayers$: Observable<IFootballEventWithPlayers[]>;
  footballEventIsSubmitting$: Observable<boolean>;
  footballEventIsLoading$: Observable<boolean>;

  // football match stats
  runDistanceForTeamA$: Observable<number>;
  runDistanceForTeamB$: Observable<number>;
  passDistanceForTeamA$: Observable<number>;
  passDistanceForTeamB$: Observable<number>;
  overallOffenceDistanceForTeamA$: Observable<number>;
  overallOffenceDistanceForTeamB$: Observable<number>;

  // flag
  flagYardsTeamA$: Observable<number>;
  flagYardsTeamB$: Observable<number>;

  // teams with stats
  footballTeamAWithStats$: Observable<IFootballTeamWithStats | null>;
  footballTeamBWithStats$: Observable<IFootballTeamWithStats | null>;

  // qb
  allQuarterbacksTeamA$: Observable<IPlayerInMatchFullDataWithQbStats[]>;
  allQuarterbacksTeamB$: Observable<IPlayerInMatchFullDataWithQbStats[]>;

  //offence
  allOffenceTeamA$: Observable<IPlayerInMatchFullDataWithOffenceStats[]>;
  allOffenceTeamB$: Observable<IPlayerInMatchFullDataWithOffenceStats[]>;

  constructor() {
    this.footballEvent$ = this.store.select(selectCurrentFootballEvent);
    this.footballEventIsSubmitting$ = this.store.select(
      selectFootballEventIsSubmitting,
    );
    this.footballEventIsLoading$ = this.store.select(
      selectFootballEventIsLoading,
    );
    this.allMatchFootballEvents$ = this.store.select(
      selectAllMatchFootballEvents,
    );
    this.allMatchFootballEventsWithPlayers$ = this.store.select(
      selectFootballEventsWithPlayers,
    );

    // stats
    // offence
    this.runDistanceForTeamA$ = this.store.select(
      selectOverallRunDistanceForTeamA,
    );
    this.runDistanceForTeamB$ = this.store.select(
      selectOverallRunDistanceForTeamB,
    );
    this.passDistanceForTeamA$ = this.store.select(
      selectOverallPassDistanceForTeamA,
    );
    this.passDistanceForTeamB$ = this.store.select(
      selectOverallPassDistanceForTeamB,
    );
    this.overallOffenceDistanceForTeamA$ = this.store.select(
      selectOverallOffenceDistanceForTeamA,
    );
    this.overallOffenceDistanceForTeamB$ = this.store.select(
      selectOverallOffenceDistanceForTeamB,
    );
    // flag
    this.flagYardsTeamA$ = this.store.select(
      selectOverallFlagOffenceYardsForTeamA,
    );
    this.flagYardsTeamB$ = this.store.select(
      selectOverallFlagOffenceYardsForTeamB,
    );
    // teams with stats
    this.footballTeamAWithStats$ = this.store.select(
      selectFootballTeamAWithStats,
    );
    this.footballTeamBWithStats$ = this.store.select(
      selectFootballTeamBWithStats,
    );

    // qb
    this.allQuarterbacksTeamA$ = this.store.select(
      selectAllQuarterbacksWithStatsTeamA,
    );
    this.allQuarterbacksTeamB$ = this.store.select(
      selectAllQuarterbacksWithStatsTeamB,
    );
    //offence
    this.allOffenceTeamA$ = this.store.select(
      selectAllPlayersWithOffenseStatsTeamA,
    );
    this.allOffenceTeamB$ = this.store.select(
      selectAllPlayersWithOffenseStatsTeamB,
    );
  }

  createFootballEvent(event: IFootballEvent) {
    this.store.dispatch(footballEventActions.create({ request: event }));
  }

  updateFootballEventKeyValue(id: number, data: Partial<IFootballEvent>) {
    this.store.dispatch(
      footballEventActions.updateFootballEventByKeyValue({
        id: id,
        data: data,
      }),
    );
  }

  deleteEventInMatchById(id: number) {
    this.store.dispatch(footballEventActions.deleteById({ id: id }));
  }
}
