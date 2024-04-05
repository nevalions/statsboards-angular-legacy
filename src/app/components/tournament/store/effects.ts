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
import { getRouterSelectors, routerNavigatedAction } from '@ngrx/router-store';
import { ISeason } from '../../../type/season.type';
import { selectTournamentSportIdSeasonId } from './selectors';
import { getAllRouteParameters } from '../../../router/router.selector';
import { ISponsor } from '../../../type/sponsor.type';

@Injectable()
export class TournamentEffects {
  getTournamentIdFromRouteEffect = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(routerNavigatedAction),
        switchMap(({ payload }) => {
          let params = getAllRouteParameters(payload.routerState);
          let tournamentId = params.get('tournament_id');
          return of(tournamentId).pipe(
            filter((id: string | undefined): id is string => !!id),
            switchMap((id: string) => [
              tournamentActions.getTournamentIdSuccessfully({
                tournamentId: Number(id),
              }),
            ]),
            catchError(() => of(tournamentActions.getTournamentIdFailure())),
          );
        }),
      );
    },
    { functional: false },
  );
  // getTournamentIdFromRouteEffect = createEffect(
  //   () => {
  //     return this.actions$.pipe(
  //       ofType(tournamentActions.getId),
  //       mergeMap(() =>
  //         this.store
  //           .select(getRouterSelectors().selectRouteParam('tournament_id'))
  //           .pipe(
  //             filter((id: string | undefined): id is string => !!id),
  //             switchMap((id: string) => [
  //               tournamentActions.get({ id: Number(id) }),
  //               tournamentActions.getTournamentIdSuccessfully({
  //                 tournamentId: Number(id),
  //               }),
  //             ]),
  //             catchError(() => of(tournamentActions.getTournamentIdFailure())),
  //           ),
  //       ),
  //     );
  //   },
  //   { functional: true },
  // );

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

  getTournamentByIdSuccessEffect = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(tournamentActions.getTournamentIdSuccessfully),
        switchMap(({ tournamentId }) =>
          this.tournamentService.findById(tournamentId).pipe(
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

  getMainSponsorByTournamentIdEffect = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(tournamentActions.getTournamentIdSuccessfully),
        switchMap(({ tournamentId }) =>
          this.tournamentService
            .fetchMainSponsorByTournamentId(tournamentId)
            .pipe(
              map((mainSponsor: ISponsor) =>
                tournamentActions.getMainSponsorSuccess({ mainSponsor }),
              ),
              catchError(() => of(tournamentActions.getMainSponsorFailure())),
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
        withLatestFrom(this.store.select(selectTournamentSportIdSeasonId)),
        switchMap(([action, { tournamentId, sportId, seasonId }]) => {
          return this.tournamentService.deleteItem(tournamentId!).pipe(
            map(() =>
              tournamentActions.deletedSuccessfully({
                tournamentId: tournamentId!,
                sportId: sportId!,
                seasonId: seasonId!,
              }),
            ),
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
