import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  catchError,
  debounceTime,
  forkJoin,
  map,
  mergeMap,
  of,
  switchMap,
} from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { teamTournamentActions } from './actions';
import { TeamTournamentService } from '../team-tournament.service';
import { ITeamTournament } from '../../../type/team.type';
import { teamActions } from '../../team/store/actions';
import { tournamentActions } from '../../tournament/store/actions';

@Injectable()
export class TeamTournamentEffects {
  createTeamTournamentEffect = createEffect(() =>
    this.actions$.pipe(
      ofType(teamTournamentActions.create),
      switchMap(({ request }) =>
        this.teamTournamentService.addTeamTournamentState(request).pipe(
          map((currentTeamTournament) =>
            teamTournamentActions.createdSuccessfully({
              currentTeamTournament,
            }),
          ),
          catchError(() => of(teamTournamentActions.createFailure())),
        ),
      ),
    ),
  );

  getAllTeamTournaments = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(teamTournamentActions.getAll),
        switchMap(() => {
          return this.teamTournamentService.findAll().pipe(
            map((teamTournaments: ITeamTournament[]) => {
              return teamTournamentActions.getAllItemsSuccess({
                teamTournaments,
              });
            }),
            catchError(() => {
              return of(teamTournamentActions.getAllItemsFailure());
            }),
          );
        }),
      );
    },
    { functional: true },
  );

  getTeamTournamentByIdEffect = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(teamTournamentActions.get), // You will have to define this action
        switchMap(({ id }) => {
          return this.teamTournamentService.findById(id).pipe(
            // Assuming you have a getTournaments method in your service
            map((teamTournament: ITeamTournament) => {
              return teamTournamentActions.getItemSuccess({
                teamTournament,
              });
            }),
            catchError(() => {
              return of(teamTournamentActions.getItemFailure());
            }),
          );
        }),
      );
    },
    { functional: true },
  );

  getConnectionByTeamIdTournamentIdEffect = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(teamTournamentActions.getConnectionByTeamIdTournamentId), // You will have to define this action
        switchMap(({ teamId, tournamentId }) => {
          return this.teamTournamentService
            .fetchTeamTournament(teamId, tournamentId)
            .pipe(
              // Assuming you have a getTournaments method in your service
              map((teamTournament: ITeamTournament) => {
                return teamTournamentActions.getConnectionByTeamIdAndTournamentIdSuccess(
                  {
                    teamTournament,
                  },
                );
              }),
              catchError(() => {
                return of(
                  teamTournamentActions.getConnectionByTeamIdAndTournamentIdFailure(),
                );
              }),
            );
        }),
      );
    },
    { functional: true },
  );

  deleteTeamTournamentEffect = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(teamTournamentActions.delete),
        switchMap(({ id, team_id }) => {
          // const _id = typeof id === 'string' ? Number(id) : id;
          return this.teamTournamentService.deleteItem(id).pipe(
            map(() => {
              return teamTournamentActions.deletedSuccessfully({
                id: id,
                team_id: team_id,
              });
            }),
            catchError(() => {
              return of(teamTournamentActions.deleteFailure());
            }),
          );
        }),
      );
    },
    { functional: true },
  );

  createTeamTournamentSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(teamTournamentActions.createdSuccessfully),
      switchMap((action) =>
        of(
          teamActions.addTeamToTournament({
            team_id: action.currentTeamTournament.team_id,
          }),
        ),
      ),
    ),
  );

  deleteTeamTournamentSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(teamTournamentActions.deletedSuccessfully),
      switchMap((action) =>
        of(teamActions.removeTeamFromTournament({ id: action.team_id })),
      ),
    ),
  );

  // navigateOnTeamTournamentDeletion$ = createEffect(
  //   () => {
  //     return this.actions$.pipe(
  //       ofType(teamTournamentActions.deletedSuccessfully),
  //       tap(() => this.router.navigateByUrl('/')),
  //     );
  //   },
  //   { dispatch: false },
  // );

  constructor(
    private router: Router,
    private actions$: Actions,
    private teamTournamentService: TeamTournamentService,
  ) {}
}
