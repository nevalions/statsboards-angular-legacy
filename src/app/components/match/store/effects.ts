import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  catchError,
  filter,
  map,
  mergeMap,
  of,
  switchMap,
  withLatestFrom,
} from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

import { Store } from '@ngrx/store';
import { selectCurrentTournamentId } from '../../tournament/store/reducers';

import { getRouterSelectors, routerNavigatedAction } from '@ngrx/router-store';
import { matchActions } from './actions';
import {
  getDefaultFullData,
  IMatch,
  IMatchWithFullData,
} from '../../../type/match.type';
import { MatchService } from '../match.service';

import { selectMatchTournamentSportSeasonId } from './selectors';
import { matchWithFullDataActions } from '../../match-with-full-data/store/actions';

import { selectAllTeamsInTournament } from '../../team/store/reducers';
import { selectCurrentMatchWithFullData } from '../../match-with-full-data/store/reducers';
import { IMatchData } from '../../../type/matchdata.type';
import { matchDataActions } from './match-data/actions';
import { MatchDataService } from '../matchData.service';
import { getAllRouteParameters } from '../../../router/router.selector';
import { sportActions } from '../../sport/store/actions';

@Injectable()
export class MatchEffects {
  getMatchIdFromRouteEffect = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(routerNavigatedAction),
        switchMap(({ payload }) => {
          let params = getAllRouteParameters(payload.routerState);
          let matchId = params.get('match_id');
          return of(matchId).pipe(
            filter((id: string | undefined): id is string => !!id),
            switchMap((id: string) => [
              matchActions.getMatchIdSuccessfully({ matchId: Number(id) }),
            ]),
            catchError(() => of(matchActions.getMatchIdFailure())),
          );
        }),
      );
    },
    { functional: false },
  );

  createMatchEffect = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(matchActions.create),
        switchMap(({ request }) => {
          return this.matchService.addItem(request).pipe(
            map((currentMatch: IMatch) => {
              return matchActions.createdSuccessfully({
                currentMatch,
              });
            }),
            catchError(() => {
              return of(matchActions.createFailure());
            }),
          );
        }),
      );
    },
    { functional: true },
  );

  createdSuccessfullyEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(matchActions.createdSuccessfully),
      withLatestFrom(this.store.select(selectCurrentTournamentId)),
      filter(
        ([action, tournamentId]) =>
          action.currentMatch.tournament_id === tournamentId,
      ),
      map(([action]) =>
        matchActions.updateAllMatchesInTournament({
          newMatch: action.currentMatch,
        }),
      ),
    ),
  );

  getAllMatchesEffect = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(matchActions.getAll),
        switchMap(() => {
          return this.matchService.findAll().pipe(
            map((matches: IMatch[]) => {
              return matchActions.getAllItemsSuccess({
                matches,
              });
            }),
            catchError(() => {
              return of(matchActions.getAllItemsFailure());
            }),
          );
        }),
      );
    },
    { functional: true },
  );

  updateMatchEffect = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(matchActions.update),
        switchMap(({ id, newMatchData }) => {
          return this.matchService.editMatch(id, newMatchData).pipe(
            map((updatedMatch: IMatch) => {
              return matchActions.updatedSuccessfully({
                updatedMatch,
              });
            }),
            catchError(() => {
              return of(matchActions.updateFailure());
            }),
          );
        }),
      );
    },
    { functional: true },
  );

  updateMatchWithFullDataEffect = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(matchActions.updatedSuccessfully),
        withLatestFrom(this.store.select(selectAllTeamsInTournament)),
        withLatestFrom(this.store.select(selectCurrentMatchWithFullData)),
        map(([[action, allTournamentTeams], currentFullMatch]) => {
          const teamA = allTournamentTeams.find(
            (team) => team.id === action.updatedMatch.team_a_id,
          );
          const teamB = allTournamentTeams.find(
            (team) => team.id === action.updatedMatch.team_b_id,
          );

          const updatedFullMatch: IMatchWithFullData = {
            ...currentFullMatch,
            match: action.updatedMatch,
            status_code: currentFullMatch?.status_code || 0,
            teams_data: {
              team_a: teamA!,
              team_b: teamB!,
            },
          };

          return matchWithFullDataActions.updateMatchWithFullData({
            newMatchWithFullData: updatedFullMatch,
          });
        }),
      );
    },
    { dispatch: true },
  );

  getMatchesByTournamentIdEffect = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(matchActions.getMatchesByTournamentId),
        switchMap(() => this.store.select(selectCurrentTournamentId)),
        filter(
          (tournamentId): tournamentId is number =>
            tournamentId !== null && tournamentId !== undefined,
        ),
        switchMap((tournamentId) => {
          return this.matchService
            .fetchMatchesByTournamentId(tournamentId)
            .pipe(
              map((matches: IMatch[]) => {
                return matchActions.getMatchesByTournamentIDSuccess({
                  matches,
                });
              }),
              catchError(() => {
                return of(matchActions.getMatchesByTournamentIDFailure);
              }),
            );
        }),
      );
    },
    { functional: true },
  );

  getMatchByIdSuccesEffect = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(matchActions.getMatchIdSuccessfully), // You will have to define this action
        switchMap(({ matchId }) => {
          return this.matchService.findById(matchId).pipe(
            // Assuming you have a getTournaments method in your service
            map((match: IMatch) => {
              return matchActions.getItemSuccess({
                match,
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

  getMatchByIdEffect = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(matchActions.get), // You will have to define this action
        switchMap(({ id }) => {
          return this.matchService.findById(id).pipe(
            // Assuming you have a getTournaments method in your service
            map((match: IMatch) => {
              return matchActions.getItemSuccess({
                match,
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

  deleteMatchEffect = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(matchActions.delete),
        withLatestFrom(this.store.select(selectMatchTournamentSportSeasonId)),
        switchMap(([action, { matchId, tournamentId, sportId, seasonId }]) => {
          return this.matchService.deleteItem(matchId!).pipe(
            map(() => {
              return matchActions.deletedSuccessfully({
                matchId: matchId!,
                tournamentId: tournamentId!,
                sportId: sportId!,
                seasonId: seasonId!,
              });
            }),
            catchError(() => {
              return of(matchActions.deleteFailure());
            }),
          );
        }),
      );
    },
    { functional: true },
  );

  deleteMatchSuccessEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(matchActions.deletedSuccessfully),
      switchMap((action) =>
        of(
          matchWithFullDataActions.removeMatchFromTournament({
            id: action.matchId,
          }),
        ),
      ),
    ),
  );

  navigateOnMatchDeletion$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(matchActions.deletedSuccessfully),
        tap(({ tournamentId, sportId, seasonId }) => {
          setTimeout(() => {
            this.router.navigateByUrl(
              `/sport/${sportId}/season/${seasonId}/tournament/${tournamentId}`,
            );
          }, 1500); // Use a small delay
        }),
      ),
    { dispatch: false },
  );

  updateMatchesInTournamentEffect = createEffect(() =>
    this.actions$.pipe(
      ofType(matchActions.createdSuccessfully),
      withLatestFrom(this.store.select(selectAllTeamsInTournament)),
      mergeMap(([action, teamsInTournament]) => {
        const newMatch = action.currentMatch;
        // Find the teams in the array of teams in tournament
        const teamA = teamsInTournament.find(
          (team) => team.id === newMatch.team_a_id,
        );
        const teamB = teamsInTournament.find(
          (team) => team.id === newMatch.team_b_id,
        );

        const newData = getDefaultFullData();
        const newMatchWithFullData = {
          ...newData,
          id: newMatch.id!,
          match_id: newMatch.id!,
          match: { ...newData.match, ...newMatch },
          // includes the found team titles
          teams_data: {
            team_a: { ...newData.teams_data!.team_a, title: teamA!.title! },
            team_b: { ...newData.teams_data!.team_b, title: teamB!.title! },
          },
        };

        return [
          matchActions.updateAllMatchesInTournament({ newMatch }),
          matchWithFullDataActions.updateAllMatchesWithFullDataInTournament({
            newMatchWithFullData,
          }),
        ];
      }),
    ),
  );

  constructor(
    private router: Router,
    private actions$: Actions,
    private matchService: MatchService,
    private store: Store,
  ) {}
}
