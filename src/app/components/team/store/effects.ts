import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { routerNavigatedAction } from '@ngrx/router-store';
import { Store } from '@ngrx/store';
import { catchError, filter, map, of, switchMap, withLatestFrom } from 'rxjs';
import { tap } from 'rxjs/operators';
import { getAllRouteParameters } from '../../../router/router.selector';
import { ITeam } from '../../../type/team.type';
import { selectCurrentMatchId } from '../../match/store/reducers';
import { selectCurrentSportId } from '../../sport/store/reducers';
import { TeamTournamentService } from '../../team-tournament/team-tournament.service';
import { selectCurrentTournamentId } from '../../tournament/store/reducers';
import { TeamService } from '../team.service';
import { teamActions } from './actions';
import { selectCurrentTeam } from './reducers';

@Injectable()
export class TeamEffects {
  getTeamIdFromRouteEffect = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(routerNavigatedAction),
        switchMap(({ payload }) => {
          let params = getAllRouteParameters(payload.routerState);
          let teamId = params.get('team_id');
          // console.log('IDIDIDIDIDDIDI', teamId);
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

  getTeamsByMatchIdEffect = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(teamActions.getMatchTeams),
        switchMap(() => this.store.select(selectCurrentMatchId)),
        filter(
          (matchId): matchId is number =>
            matchId !== null && matchId !== undefined,
        ),
        switchMap((matchId: number) =>
          this.teamService.fetchTeamsByMatchId(matchId).pipe(
            map(({ home_team: homeTeam, away_team: awayTeam }) =>
              teamActions.getMatchTeamsSuccess({
                homeTeam: homeTeam,
                awayTeam: awayTeam,
              }),
            ),
            catchError(() => of(teamActions.getMatchTeamsFailure())),
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

  updateTeamEffect = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(teamActions.update),
        switchMap(({ id, newTeamData }) => {
          return this.teamService.editItem(id, newTeamData).pipe(
            map((updatedTeam: ITeam) => {
              return teamActions.updatedSuccessfully({
                updatedTeam,
              });
            }),
            catchError(() => {
              return of(teamActions.updateFailure);
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
        withLatestFrom(this.store.select(selectCurrentTeam)),
        switchMap(([action, currentTeam]) => {
          if (!currentTeam || !currentTeam.id) {
            return of(teamActions.deleteFailure());
          }

          return this.teamService.deleteItem(currentTeam.id).pipe(
            map(() =>
              teamActions.deletedSuccessfully({
                teamId: currentTeam.id!,
                sportId: currentTeam.sport_id!,
              }),
            ),
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
        tap(({ sportId }) => {
          this.router.navigateByUrl(`/sport/${sportId}/teams`);
        }),
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
