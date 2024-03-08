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
import { TeamService } from '../team.service';
import { teamActions } from './actions';
import { ITeam } from '../../../type/team.type';
import { TeamTournamentService } from '../../team-tournament/team-tournament.service';
import { Store } from '@ngrx/store';
import { selectCurrentTournamentId } from '../../tournament/store/reducers';
import { selectCurrentSportId } from '../../sport/store/reducers';
import { tournamentActions } from '../../tournament/store/actions';
import { getRouterSelectors, routerNavigatedAction } from '@ngrx/router-store';
import { getAllRouteParameters } from '../../../router/router.selector';
import { sportActions } from '../../sport/store/actions';

@Injectable()
export class TeamEffects {
  getTeamIdFromRouteEffect = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(routerNavigatedAction),
        switchMap(({ payload }) => {
          let params = getAllRouteParameters(payload.routerState);
          let teamId = params.get('team_id');
          return of(teamId).pipe(
            filter((id: string | undefined): id is string => !!id),
            switchMap((id: string) => [
              teamActions.getTeamIdSuccessfully({ teamId: Number(id) }),
            ]),
            catchError(() => of(teamActions.getTeamIdFailure())),
          );
        }),
      );
    },
    { functional: false },
  );

  // getTeamIdFromRouteEffect = createEffect(
  //   () => {
  //     return this.actions$.pipe(
  //       ofType(teamActions.getId),
  //       mergeMap(() =>
  //         this.store
  //           .select(getRouterSelectors().selectRouteParam('team_id'))
  //           .pipe(
  //             filter((id: string | undefined): id is string => !!id),
  //             switchMap((id: string) => [
  //               teamActions.get({ id: Number(id) }),
  //               teamActions.getTeamIdSuccessfully({
  //                 teamId: Number(id),
  //               }),
  //             ]),
  //             catchError(() => of(teamActions.getTeamIdFailure())),
  //           ),
  //       ),
  //     );
  //   },
  //   { functional: true },
  // );

  createTeamEffect = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(teamActions.create),
        switchMap(({ request }) => {
          return this.teamService.addItem(request).pipe(
            map((currentTeam: ITeam) => {
              return teamActions.createdSuccessfully({
                currentTeam,
              });
            }),
            catchError(() => {
              return of(teamActions.createFailure());
            }),
          );
        }),
      );
    },
    { functional: true },
  );

  createdSuccessfullyEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(teamActions.createdSuccessfully),
      withLatestFrom(this.store.select(selectCurrentSportId)),
      filter(([action, sportId]) => action.currentTeam.sport_id === sportId),
      map(([action]) =>
        teamActions.updateAllTeamsInSport({ newTeam: action.currentTeam }),
      ),
    ),
  );

  getAllTeamsEffect = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(teamActions.getAll),
        switchMap(() => {
          return this.teamService.findAll().pipe(
            map((teams: ITeam[]) => {
              return teamActions.getAllItemsSuccess({
                teams,
              });
            }),
            catchError(() => {
              return of(teamActions.getAllItemsFailure());
            }),
          );
        }),
      );
    },
    { functional: true },
  );

  getTeamsBySportIdEffect = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(teamActions.getTeamsBySportId),
        switchMap(() => this.store.select(selectCurrentSportId)),
        filter(
          (sportId): sportId is number =>
            sportId !== null && sportId !== undefined,
        ),
        switchMap((sportId: number) =>
          this.teamService.fetchTeamsBySportId(sportId).pipe(
            map((teams: ITeam[]) =>
              teamActions.getTeamsBySportIDSuccess({ teams }),
            ),
            catchError(() => of(teamActions.getTeamsBySportIDFailure())),
          ),
        ),
      );
    },
    { functional: true },
  );

  getTeamsByTournamentIdEffect = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(teamActions.getTeamsByTournamentId),
        switchMap(() => this.store.select(selectCurrentTournamentId)),
        filter(
          (tournamentId): tournamentId is number =>
            tournamentId !== null && tournamentId !== undefined,
        ),
        switchMap((tournamentId) => {
          return this.teamTournamentService
            .fetchTeamsByTournamentId(tournamentId)
            .pipe(
              map((teams: ITeam[]) => {
                return teamActions.getTeamsByTournamentIDSuccess({
                  teams,
                });
              }),
              catchError(() => {
                return of(teamActions.getTeamsByTournamentIDFailure);
              }),
            );
        }),
      );
    },
    { functional: true },
  );

  getTeamBySuccessIdEffect = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(teamActions.getTeamIdSuccessfully), // You will have to define this action
        switchMap(({ teamId }) => {
          return this.teamService.findById(teamId).pipe(
            // Assuming you have a getTournaments method in your service
            map((team: ITeam) => {
              return teamActions.getItemSuccess({
                team,
              });
            }),
            catchError(() => {
              return of(teamActions.getItemFailure());
            }),
          );
        }),
      );
    },
    { functional: true },
  );

  getTeamByIdEffect = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(teamActions.get), // You will have to define this action
        switchMap(({ id }) => {
          return this.teamService.findById(id).pipe(
            // Assuming you have a getTournaments method in your service
            map((team: ITeam) => {
              return teamActions.getItemSuccess({
                team,
              });
            }),
            catchError(() => {
              return of(teamActions.getItemFailure());
            }),
          );
        }),
      );
    },
    { functional: true },
  );

  deleteTeamEffect = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(teamActions.delete),
        switchMap(({ id }) => {
          // const _id = typeof id === 'string' ? Number(id) : id;
          return this.teamService.deleteItem(id).pipe(
            map(() => {
              return teamActions.deletedSuccessfully({ id: id });
            }),
            catchError(() => {
              return of(teamActions.deleteFailure());
            }),
          );
        }),
      );
    },
    { functional: true },
  );

  navigateOnTeamDeletion$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(teamActions.deletedSuccessfully),
        tap(() => this.router.navigateByUrl('/')),
      );
    },
    { dispatch: false },
  );

  constructor(
    private router: Router,
    private actions$: Actions,
    private teamService: TeamService,
    private teamTournamentService: TeamTournamentService,
    private store: Store,
  ) {}
}
