import { Injectable } from '@angular/core';
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
import {
  selectAllPlayersWithOffenseStatsTeamA,
  selectAllPlayersWithOffenseStatsTeamB,
  selectAllQuarterbacksWithStatsTeamA,
  selectAllQuarterbacksWithStatsTeamB,
  selectFootballEventsWithPlayers,
  selectOverallFlagYardsForTeamA,
  selectOverallFlagYardsForTeamB,
  selectOverallOffenceDistanceForTeamA,
  selectOverallOffenceDistanceForTeamB,
  selectOverallPassDistanceForTeamA,
  selectOverallPassDistanceForTeamB,
  selectOverallRunDistanceForTeamA,
  selectOverallRunDistanceForTeamB,
} from './store/selectors';
import {
  IPlayerInMatchFullDataWithOffenceStats,
  IPlayerInMatchFullDataWithQbStats,
} from '../../../type/player.type';

@Injectable({
  providedIn: 'root',
})
export class FootballEvent {
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

  // qb
  allQuarterbacksTeamA$: Observable<IPlayerInMatchFullDataWithQbStats[]>;
  allQuarterbacksTeamB$: Observable<IPlayerInMatchFullDataWithQbStats[]>;

  //offence
  allOffenceTeamA$: Observable<IPlayerInMatchFullDataWithOffenceStats[]>;
  allOffenceTeamB$: Observable<IPlayerInMatchFullDataWithOffenceStats[]>;

  constructor(private store: Store<AppState>) {
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
    this.flagYardsTeamA$ = this.store.select(selectOverallFlagYardsForTeamA);
    this.flagYardsTeamB$ = this.store.select(selectOverallFlagYardsForTeamB);
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
