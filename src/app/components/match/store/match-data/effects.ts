import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  catchError,
  concatMap,
  filter,
  map,
  of,
  switchMap,
  withLatestFrom,
} from 'rxjs';
import { Router } from '@angular/router';

import { Store } from '@ngrx/store';
import { matchDataActions } from './actions';
import { MatchDataService } from '../../matchData.service';
import { IMatchData } from '../../../../type/matchdata.type';
import { matchActions } from '../actions';
import { selectCurrentMatch, selectCurrentMatchId } from '../reducers';
import { selectMatchAndMatchDataLoaded } from './selectors';

@Injectable()
export class MatchDataEffects {
  updateMatchDataEffect = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(matchDataActions.update),
        switchMap(({ id, newMatchData }) => {
          return this.matchDataService.editMatchData(id, newMatchData).pipe(
            map((updatedMatchData: IMatchData) => {
              return matchDataActions.updatedSuccessfully({
                updatedMatchData,
              });
            }),
            catchError(() => {
              return of(matchDataActions.updateFailure());
            }),
          );
        }),
      );
    },
    { functional: true },
  );

  // updateMatchWithFullDataEffect = createEffect(
  //   () => {
  //     return this.actions$.pipe(
  //       ofType(matchActions.updatedSuccessfully),
  //       withLatestFrom(this.store.select(selectAllTeamsInTournament)),
  //       withLatestFrom(this.store.select(selectCurrentMatchWithFullData)),
  //       map(([[action, allTournamentTeams], currentFullMatch]) => {
  //         const teamA = allTournamentTeams.find(
  //           (team) => team.id === action.updatedMatch.team_a_id,
  //         );
  //         const teamB = allTournamentTeams.find(
  //           (team) => team.id === action.updatedMatch.team_b_id,
  //         );
  //
  //         const updatedFullMatch: IMatchWithFullData = {
  //           ...currentFullMatch,
  //           match: action.updatedMatch,
  //           status_code: currentFullMatch?.status_code || 0,
  //           teams_data: {
  //             team_a: teamA!,
  //             team_b: teamB!,
  //           },
  //         };
  //
  //         return matchWithFullDataActions.updateMatchWithFullData({
  //           newMatchWithFullData: updatedFullMatch,
  //         });
  //       }),
  //     );
  //   },
  //   { dispatch: true },
  // );

  // getMatchesBySportIdEffect = createEffect(
  //   () => {
  //     return this.actions$.pipe(
  //       ofType(matchActions.getMatchesBySportId),
  //       switchMap(() => this.store.select(selectCurrentSportId)),
  //       filter(
  //         (sportId): sportId is number =>
  //           sportId !== null && sportId !== undefined,
  //       ),
  //       switchMap((sportId: number) =>
  //         this.matchService.fetchMatchesBySportId(sportId).pipe(
  //           map((teams: IMatch[]) =>
  //             matchActions.getMatchesBySportIDSuccess({ teams }),
  //           ),
  //           catchError(() => of(matchActions.getMatchesBySportIDFailure())),
  //         ),
  //       ),
  //     );
  //   },
  //   { functional: true },
  // );

  getMatchDataByIdEffect = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(matchDataActions.get),
        switchMap(({ id }) => {
          return this.matchDataService.findById(id).pipe(
            map((matchdata: IMatchData) => {
              return matchDataActions.getItemSuccess({
                matchdata,
              });
            }),
            catchError(() => {
              return of(matchActions.getItemFailure());
            }),
          );
        }),
      );
    },
    { functional: true },
  );

  getMatchDataByMatchIdMainEffect = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(matchDataActions.getMatchDataByMatchId),
        switchMap(() => this.store.select(selectCurrentMatchId)),
        map((matchId) => matchId),
        switchMap((matchId) => {
          return this.matchDataService.getMatchDataByMatchId(matchId!).pipe(
            map((matchdata: IMatchData) => {
              return matchDataActions.getMatchdataByMatchIDSuccess({
                matchdata,
              });
            }),
            catchError(() => {
              return of(matchDataActions.getMatchdataIdFailure());
            }),
          );
        }),
      );
    },
    { functional: true },
  );

  getMatchDataByMatchIdSideEffect = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(matchActions.getMatchIdSuccessfully),
        switchMap((action) =>
          this.matchDataService.getMatchDataByMatchId(action.matchId).pipe(
            map((matchdata: IMatchData) =>
              matchDataActions.getMatchdataByMatchIDSuccess({ matchdata }),
            ),
            catchError((error) =>
              of(matchDataActions.getMatchdataByMatchIDFailure()),
            ),
          ),
        ),
      );
    },
    { functional: false },
  );

  // getMatchDataByMatchIdEffect = createEffect(
  //   () => {
  //     return this.actions$.pipe(
  //       ofType(matchActions.getItemSuccess),
  //       switchMap((action) =>
  //         this.matchDataService.getMatchDataByMatchId(action.match.id!).pipe(
  //           map((matchdata: IMatchData) =>
  //             matchDataActions.getMatchdataByMatchIDSuccess({ matchdata }),
  //           ),
  //           catchError((error) =>
  //             of(matchDataActions.getMatchdataByMatchIDFailure()),
  //           ),
  //         ),
  //       ),
  //     );
  //   },
  //   { functional: true },
  // );

  // updateMatchesOnDeletionEffect = createEffect(
  //   () =>
  //     this.actions$.pipe(
  //       ofType(matchActions.deletedSuccessfully),
  //       withLatestFrom(
  //         this.store.select(selectAllMatchesWithFullDataInTournament),
  //       ),
  //       concatMap(([action, matchesWithFullDataInTournament]) => {
  //         const updatedMatches = matchesWithFullDataInTournament.filter(
  //           (match) => match.match_id !== action.matchId,
  //         );
  //
  //         return [
  //           matchWithFullDataActions.updateAllMatchesWithFullDataOnDelete({
  //             newMatchesWithFullData: updatedMatches,
  //           }),
  //         ];
  //       }),
  //     ),
  //   { functional: true },
  // );

  // updateMatchesInTournamentEffect = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(matchActions.createdSuccessfully),
  //     withLatestFrom(this.store.select(selectAllTeamsInTournament)),
  //     mergeMap(([action, teamsInTournament]) => {
  //       const newMatch = action.currentMatch;
  //       // Find the teams in the array of teams in tournament
  //       const teamA = teamsInTournament.find(
  //         (team) => team.id === newMatch.team_a_id,
  //       );
  //       const teamB = teamsInTournament.find(
  //         (team) => team.id === newMatch.team_b_id,
  //       );
  //
  //       const newData = getDefaultFullData();
  //       const newMatchWithFullData = {
  //         ...newData,
  //         id: newMatch.id!,
  //         match_id: newMatch.id!,
  //         match: { ...newData.match, ...newMatch },
  //         // includes the found team titles
  //         teams_data: {
  //           team_a: { ...newData.teams_data!.team_a, title: teamA!.title! },
  //           team_b: { ...newData.teams_data!.team_b, title: teamB!.title! },
  //         },
  //       };
  //
  //       return [
  //         matchActions.updateAllMatchesInTournament({ newMatch }),
  //         matchWithFullDataActions.updateAllMatchesWithFullDataInTournament({
  //           newMatchWithFullData,
  //         }),
  //       ];
  //     }),
  //   ),
  // );

  constructor(
    private router: Router,
    private actions$: Actions,
    private matchDataService: MatchDataService,
    private store: Store,
  ) {}
}
