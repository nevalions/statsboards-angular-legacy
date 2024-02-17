import { Actions, createEffect, ofType } from '@ngrx/effects';
import { inject, Injectable } from '@angular/core';
import { TournamentService } from '../tournament.service';
import { tournamentActions } from './actions';
import { catchError, map, of, switchMap } from 'rxjs';
import { ITournament } from '../../../type/tournament.type';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class TournamentEffects {
  createTournamentEffect = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(tournamentActions.create),
        switchMap(({ request }) => {
          return this.tournamentService.addItem(request).pipe(
            map((currentTournament: ITournament) => {
              return tournamentActions.createdSuccessfully({
                currentTournament,
              });
            }),
            catchError(() => {
              return of(tournamentActions.createFailure());
            }),
          );
        }),
      );
    },
    { functional: true },
  );

  getTournamentByIdEffect = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(tournamentActions.get), // You will have to define this action
        switchMap(({ id }) => {
          return this.tournamentService.findById(id).pipe(
            // Assuming you have a getTournaments method in your service
            map((tournament: ITournament) => {
              return tournamentActions.getItemSuccess({
                tournament,
              });
            }),
            catchError(() => {
              return of(tournamentActions.getItemFailure());
            }),
          );
        }),
      );
    },
    { functional: true },
  );

  getTournamentsBySportAndSeasonEffect = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(tournamentActions.getTournamentsBySportAndSeason), // You will have to define this action
        switchMap(({ id, year }) => {
          return this.tournamentService
            .fetchTournamentsBySportAndSeason({ id, year })
            .pipe(
              // Assuming you have a getTournaments method in your service
              map((tournaments: ITournament[]) => {
                return tournamentActions.getTournamentsBySportAndSeasonSuccess({
                  tournaments,
                });
              }),
              catchError(() => {
                return of(
                  tournamentActions.getTournamentsBySportAndSeasonFailure(),
                );
              }),
            );
        }),
      );
    },
    { functional: true },
  );

  deleteTournamentEffect = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(tournamentActions.delete),
        switchMap(({ id }) => {
          // const _id = typeof id === 'string' ? Number(id) : id;
          return this.tournamentService.deleteItem(id).pipe(
            map(() => {
              return tournamentActions.deletedSuccessfully({ id: id });
            }),
            catchError(() => {
              return of(tournamentActions.deleteFailure());
            }),
          );
        }),
      );
    },
    { functional: true },
  );

  navigateOnTournamentDeletion$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(tournamentActions.deletedSuccessfully),
        tap(() => this.router.navigateByUrl('/')),
      );
    },
    { dispatch: false },
  );

  constructor(
    private router: Router,
    private actions$: Actions,
    private tournamentService: TournamentService,
  ) {}
}
