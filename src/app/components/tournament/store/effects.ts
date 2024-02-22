import { Actions, createEffect, ofType } from '@ngrx/effects';
import { inject, Injectable } from '@angular/core';
import { TournamentService } from '../tournament.service';
import { tournamentActions } from './actions';
import {
  catchError,
  filter,
  map,
  mergeMap,
  of,
  switchMap,
  withLatestFrom,
} from 'rxjs';
import { ITournament } from '../../../type/tournament.type';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectSportIdAndSeasonId } from '../../sport/store/selectors';
import { seasonActions } from '../../season/store/actions';
import { getRouterSelectors } from '@ngrx/router-store';
import { ISeason } from '../../../type/season.type';

@Injectable()
export class TournamentEffects {
  getTournamentIdFromRouteEffect = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(tournamentActions.getId),
        mergeMap(() =>
          this.store
            .select(getRouterSelectors().selectRouteParam('tournament_id'))
            .pipe(
              filter((id: string | undefined): id is string => !!id),
              switchMap((id: string) => [
                tournamentActions.get({ id: Number(id) }),
                tournamentActions.getSeasonIdSuccessfully({
                  tournamentId: Number(id),
                }),
              ]),
              catchError(() => of(tournamentActions.getSeasonIdFailure())),
            ),
        ),
      );
    },
    { functional: true },
  );

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
        ofType(tournamentActions.get),
        switchMap(({ id }) =>
          this.tournamentService.findById(id).pipe(
            map((tournament: ITournament) =>
              tournamentActions.getItemSuccess({ tournament }),
            ),
            catchError(() => of(tournamentActions.getItemFailure())),
          ),
        ),
      );
    },
    { functional: true },
  );

  getSportSeasonTournamentsEffect = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(tournamentActions.getTournamentsBySportAndSeason),
        switchMap(() => this.store.select(selectSportIdAndSeasonId)),
        filter(
          ({ sportId, seasonId }) =>
            sportId !== null &&
            sportId !== undefined &&
            seasonId !== null &&
            seasonId !== undefined,
        ),
        switchMap(({ sportId, seasonId }) =>
          this.tournamentService
            .fetchTournamentsBySportAndSeasonId({
              sport_id: sportId!,
              season_id: seasonId!,
            })
            .pipe(
              map((tournaments: ITournament[]) =>
                tournamentActions.getTournamentsBySportAndSeasonSuccess({
                  tournaments,
                }),
              ),
              catchError(() =>
                of(tournamentActions.getTournamentsBySportAndSeasonFailure()),
              ),
            ),
        ),
      );
    },
    { functional: true },
  );

  updateSportSeasonTournamentsEffect = createEffect(() =>
    this.actions$.pipe(
      ofType(tournamentActions.createdSuccessfully),
      withLatestFrom(this.store.select(selectSportIdAndSeasonId)),
      filter(
        ([action, { sportId, seasonId }]) =>
          action.currentTournament.sport_id === sportId &&
          action.currentTournament.season_id === seasonId,
      ),
      map(([action]) =>
        tournamentActions.updateSportSeasonTournaments({
          newTournament: action.currentTournament,
        }),
      ),
    ),
  );

  deleteTournamentEffect = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(tournamentActions.delete),
        switchMap(({ id, sportId, seasonId }) => {
          return this.tournamentService.deleteItem(id).pipe(
            map(() => {
              return tournamentActions.deletedSuccessfully({
                id: id,
                sportId: sportId,
                seasonId: seasonId,
              });
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
        tap(({ sportId, seasonId }) => {
          this.router.navigateByUrl(
            `/sport/${sportId}/season/${seasonId}/tournaments`,
          );
        }),
      );
    },
    { dispatch: false },
  );

  constructor(
    private router: Router,
    private actions$: Actions,
    private tournamentService: TournamentService,
    private store: Store,
  ) {}
}
