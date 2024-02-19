import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { teamTournamentActions } from './actions';
import { TeamTournamentService } from '../team-tournament.service';
import { ITeamTournament } from '../../../type/team.type';

@Injectable()
export class TeamTournamentEffects {
  createTeamTournamentEffect = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(teamTournamentActions.create),
        switchMap(({ request }) => {
          return this.teamTournamentService.addItem(request).pipe(
            map((currentTeamTournament: ITeamTournament) => {
              return teamTournamentActions.createdSuccessfully({
                currentTeamTournament,
              });
            }),
            catchError(() => {
              return of(teamTournamentActions.createFailure());
            }),
          );
        }),
      );
    },
    { functional: true },
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

  deleteTeamTournamentEffect = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(teamTournamentActions.delete),
        switchMap(({ id }) => {
          // const _id = typeof id === 'string' ? Number(id) : id;
          return this.teamTournamentService.deleteItem(id).pipe(
            map(() => {
              return teamTournamentActions.deletedSuccessfully({ id: id });
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

  navigateOnTeamTournamentDeletion$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(teamTournamentActions.deletedSuccessfully),
        tap(() => this.router.navigateByUrl('/')),
      );
    },
    { dispatch: false },
  );

  constructor(
    private router: Router,
    private actions$: Actions,
    private teamTournamentService: TeamTournamentService,
  ) {}
}
