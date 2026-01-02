import { concatLatestFrom } from '@ngrx/operators';import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Injectable, inject } from '@angular/core';
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
import { routerNavigatedAction } from '@ngrx/router-store';
import { selectTournamentSportIdSeasonId } from './selectors';
import { getAllRouteParameters } from '../../../router/router.selector';
import { ISponsor, ISponsorLineFullData } from '../../../type/sponsor.type';
import { SponsorService } from '../../adv/sponsor.service';
import { sponsorActions } from '../../adv/sponsor/store/actions';
import { SponsorLineService } from '../../adv/sponsor-line.service';
import { sponsorLineActions } from '../../adv/sponsor-line/store/actions';
import { SponsorSponsorLineConnectionService } from '../../adv/sponsor-sponsor-line-connection.service';

@Injectable()
export class TournamentEffects {
  private router = inject(Router);
  private actions$ = inject(Actions);
  private tournamentService = inject(TournamentService);
  private sponsorSponsorLineConnectionService = inject(SponsorSponsorLineConnectionService);
  private sponsorLineService = inject(SponsorLineService);
  private sponsorService = inject(SponsorService);
  private store = inject(Store);

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

  getSponsorByTournamentEffect = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(tournamentActions.getItemSuccess),
        filter(
          ({ tournament }) =>
            tournament.main_sponsor_id !== null &&
            tournament.main_sponsor_id !== undefined,
        ),
        switchMap(({ tournament }) => {
          return this.sponsorService
            .findById(tournament.main_sponsor_id as number)
            .pipe(
              map((currentSponsor: ISponsor | null | undefined) => {
                return sponsorActions.getItemSuccess({
                  currentSponsor: currentSponsor,
                });
              }),
              catchError(() => {
                return of(sponsorActions.getItemFailure());
              }),
            );
        }),
      );
    },
    { functional: true },
  );

  getSponsorLineByTournamentEffect = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(tournamentActions.getItemSuccess),
        filter(
          ({ tournament }) =>
            tournament.sponsor_line_id !== null &&
            tournament.sponsor_line_id !== undefined,
        ),
        switchMap(({ tournament }) => {
          return this.sponsorSponsorLineConnectionService
            .fetchSponsorLineFullDataByLineId(
              tournament.sponsor_line_id as number,
            )
            .pipe(
              map((currentSponsorLineWithFullData: ISponsorLineFullData) => {
                return sponsorLineActions.getFullDataSponsorLineSuccess({
                  currentSponsorLineWithFullData,
                });
              }),
              catchError(() => {
                return of(sponsorLineActions.getFullDataSponsorLineFailure());
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

  updateTournamentEffect = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(tournamentActions.update),
        switchMap(({ id, newTournamentData }) => {
          return this.tournamentService.editItem(id, newTournamentData).pipe(
            map((updatedTournament: ITournament) => {
              return tournamentActions.updatedSuccessfully({
                updatedTournament,
              });
            }),
            catchError(() => {
              return of(tournamentActions.updateFailure());
            }),
          );
        }),
      );
    },
    { functional: true },
  );

  updateSportSeasonTournamentsEffect = createEffect(() =>
    { return this.actions$.pipe(
      ofType(tournamentActions.createdSuccessfully),
      concatLatestFrom(() => this.store.select(selectSportIdAndSeasonId)),
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
    ) },
  );

  deleteTournamentEffect = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(tournamentActions.delete),
        concatLatestFrom(() => this.store.select(selectTournamentSportIdSeasonId)),
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
}
