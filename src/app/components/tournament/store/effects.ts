import { Actions, createEffect, ofType } from '@ngrx/effects';
import { inject } from '@angular/core';
import { TournamentService } from '../tournament.service';
import { tournamentActions } from './actions';
import { catchError, map, of, switchMap } from 'rxjs';
import { ITournament } from '../../../type/tournament.type';

export const createTournamentEffect = createEffect(
  (
    actions$ = inject(Actions),
    tournamentService = inject(TournamentService),
  ) => {
    return actions$.pipe(
      ofType(tournamentActions.create),
      switchMap(({ request }) => {
        return tournamentService.addTournamentStore(request).pipe(
          map((currentTournament: ITournament) => {
            return tournamentActions.createdSuccessfully({ currentTournament });
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
