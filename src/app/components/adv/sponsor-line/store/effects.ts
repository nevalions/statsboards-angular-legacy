import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, filter, map, of, switchMap } from 'rxjs';

import { Router } from '@angular/router';

import { Store } from '@ngrx/store';

import { routerNavigatedAction } from '@ngrx/router-store';
import { getAllRouteParameters } from '../../../../router/router.selector';
import {
  ISponsorLine,
  ISponsorLineFullData,
} from '../../../../type/sponsor.type';
import { selectCurrentMatchId } from '../../../match/store/reducers';
import { SponsorLineService } from '../../sponsor-line.service';
import { SponsorSponsorLineConnectionService } from '../../sponsor-sponsor-line-connection.service';
import { sponsorLineActions } from './actions';

@Injectable()
export class SponsorLineEffects {
  getSponsorLineIdFromRouteEffect = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(routerNavigatedAction),
        switchMap(({ payload }) => {
          let params = getAllRouteParameters(payload.routerState);
          let sponsorLineId = params.get('sponsor_line_id');
          return of(sponsorLineId).pipe(
            filter((id: string | undefined): id is string => !!id),
            switchMap((id: string) => [
              sponsorLineActions.getSponsorLineIdSuccessfully({
                sponsorLineId: Number(id),
              }),
            ]),
            catchError(() => of(sponsorLineActions.getSponsorLineIdFailure())),
          );
        }),
      );
    },
    { functional: false },
  );

  createSponsorLineEffect = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(sponsorLineActions.create),
        switchMap(({ request }) => {
          return this.sponsorLineService.addItem(request).pipe(
            map((currentSponsorLine: ISponsorLine) => {
              return sponsorLineActions.createdSuccessfully({
                currentSponsorLine,
              });
            }),
            catchError(() => {
              return of(sponsorLineActions.createFailure());
            }),
          );
        }),
      );
    },
    { functional: true },
  );

  // createdSuccessfullyEffect$ = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(sponsorLineActions.createdSuccessfully),
  //     withLatestFrom(this.store.select(selectCurrentSportId)),
  //     filter(([action, sportId]) => action.currentSponsorLine.sport_id === sportId),
  //     map(([action]) =>
  //       sponsorLineActions.updateAllSponsorLinesInSport({ newSponsorLine: action.currentSponsorLine }),
  //     ),
  //   ),
  // );

  getAllSponsorLinesEffect = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(sponsorLineActions.getAll),
        switchMap(() => {
          return this.sponsorLineService.findAll().pipe(
            map((allSponsorLines: ISponsorLine[]) => {
              return sponsorLineActions.getAllSuccess({
                allSponsorLines,
              });
            }),
            catchError(() => {
              return of(sponsorLineActions.getAllFailure());
            }),
          );
        }),
      );
    },
    { functional: true },
  );

  // getSponsorLinesBySportIdEffect = createEffect(
  //   () => {
  //     return this.actions$.pipe(
  //       ofType(sponsorLineActions.getSponsorLinesBySportId),
  //       switchMap(() => this.store.select(selectCurrentSportId)),
  //       filter(
  //         (sportId): sportId is number =>
  //           sportId !== null && sportId !== undefined,
  //       ),
  //       switchMap((sportId: number) =>
  //         this.sponsorLineService.fetchSponsorLinesBySportId(sportId).pipe(
  //           map((sponsorLines: ISponsorLine[]) =>
  //             sponsorLineActions.getSponsorLinesBySportIDSuccess({ sponsorLines }),
  //           ),
  //           catchError(() => of(sponsorLineActions.getSponsorLinesBySportIDFailure())),
  //         ),
  //       ),
  //     );
  //   },
  //   { functional: true },
  // );

  // getSponsorLinesByTournamentIdEffect = createEffect(
  //   () => {
  //     return this.actions$.pipe(
  //       ofType(sponsorLineActions.getSponsorLinesByTournamentId),
  //       switchMap(() => this.store.select(selectCurrentTournamentId)),
  //       filter(
  //         (tournamentId): tournamentId is number =>
  //           tournamentId !== null && tournamentId !== undefined,
  //       ),
  //       switchMap((tournamentId) => {
  //         return this.sponsorLineTournamentService
  //           .fetchSponsorLinesByTournamentId(tournamentId)
  //           .pipe(
  //             map((sponsorLines: ISponsorLine[]) => {
  //               return sponsorLineActions.getSponsorLinesByTournamentIDSuccess({
  //                 sponsorLines,
  //               });
  //             }),
  //             catchError(() => {
  //               return of(sponsorLineActions.getSponsorLinesByTournamentIDFailure);
  //             }),
  //           );
  //       }),
  //     );
  //   },
  //   { functional: true },
  // );

  getSponsorLineWithFullDataByIdEffect = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(sponsorLineActions.getFullDataSponsorLine),
        switchMap(({ sponsorLineId }) => {
          return this.sponsorSponsorLineConnectionService
            .fetchSponsorLineFullDataByLineId(sponsorLineId)
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

  getMatchSponsorLineWithFullDataEffect = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(sponsorLineActions.getFullDataMatchSponsorLine),
        switchMap(() => this.store.select(selectCurrentMatchId)),
        filter(
          (matchId): matchId is number =>
            matchId !== null && matchId !== undefined,
        ),
        switchMap((matchId) => {
          return this.sponsorSponsorLineConnectionService
            .findMatchSponsorMatchFullData(matchId)
            .pipe(
              map(
                (currentMatchSponsorLineWithFullData: ISponsorLineFullData) => {
                  return sponsorLineActions.getFullDataMatchSponsorLineSuccess({
                    currentMatchSponsorLineWithFullData,
                  });
                },
              ),
              catchError(() => {
                return of(
                  sponsorLineActions.getFullDataMatchSponsorLineFailure(),
                );
              }),
            );
        }),
      );
    },
    { functional: true },
  );

  // getSponsorLineWithFullDataByTournamentEffect = createEffect(
  //   () => {
  //     return this.actions$.pipe(
  //       ofType(sponsorLineActions.getFullDataSponsorLine),
  //       withLatestFrom(this.store.select(selectCurrentTournamentSponsorLineId)),
  //       filter(
  //         ([action, sponsorLineId]) =>
  //           sponsorLineId !== null &&
  //           sponsorLineId !== undefined &&
  //           typeof sponsorLineId === 'number',
  //       ),
  //       switchMap(([action, sponsorLineId]) => {
  //         return this.sponsorSponsorLineConnectionService
  //           .fetchSponsorLineFullDataByLineId(sponsorLineId!)
  //           .pipe(
  //             map((currentSponsorLineWithFullData: ISponsorLineFullData) => {
  //               return sponsorLineActions.getFullDataSponsorLineSuccess({
  //                 currentSponsorLineWithFullData,
  //               });
  //             }),
  //             catchError(() => {
  //               return of(sponsorLineActions.getFullDataSponsorLineFailure());
  //             }),
  //           );
  //       }),
  //     );
  //   },
  //   { functional: true },
  // );

  getSponsorLineBySuccessIdEffect = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(sponsorLineActions.getSponsorLineIdSuccessfully), // You will have to define this action
        switchMap(({ sponsorLineId }) => {
          return this.sponsorSponsorLineConnectionService
            .fetchSponsorLineFullDataByLineId(sponsorLineId)
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

  // getSponsorLineBySuccessIdEffect = createEffect(
  //   () => {
  //     return this.actions$.pipe(
  //       ofType(sponsorLineActions.getSponsorLineIdSuccessfully), // You will have to define this action
  //       switchMap(({ sponsorLineId }) => {
  //         return this.sponsorLineService.findById(sponsorLineId).pipe(
  //           // Assuming you have a getTournaments method in your service
  //           map((currentSponsorLine: ISponsorLine) => {
  //             return sponsorLineActions.getItemSuccess({
  //               currentSponsorLine,
  //             });
  //           }),
  //           catchError(() => {
  //             return of(sponsorLineActions.getItemFailure());
  //           }),
  //         );
  //       }),
  //     );
  //   },
  //   { functional: true },
  // );

  // getSponsorLineByIdEffect = createEffect(
  //   () => {
  //     return this.actions$.pipe(
  //       ofType(sponsorLineActions.get), // You will have to define this action
  //       switchMap(({ id }) => {
  //         return this.sponsorLineService.findById(id).pipe(
  //           // Assuming you have a getTournaments method in your service
  //           map((store: ISponsorLine) => {
  //             return sponsorLineActions.getItemSuccess({
  //               store,
  //             });
  //           }),
  //           catchError(() => {
  //             return of(sponsorLineActions.getItemFailure());
  //           }),
  //         );
  //       }),
  //     );
  //   },
  //   { functional: true },
  // );
  //
  // deleteSponsorLineEffect = createEffect(
  //   () => {
  //     return this.actions$.pipe(
  //       ofType(sponsorLineActions.delete),
  //       switchMap(({ id }) => {
  //         // const _id = typeof id === 'string' ? Number(id) : id;
  //         return this.sponsorLineService.deleteItem(id).pipe(
  //           map(() => {
  //             return sponsorLineActions.deletedSuccessfully({ id: id });
  //           }),
  //           catchError(() => {
  //             return of(sponsorLineActions.deleteFailure());
  //           }),
  //         );
  //       }),
  //     );
  //   },
  //   { functional: true },
  // );
  //
  // navigateOnSponsorLineDeletion$ = createEffect(
  //   () => {
  //     return this.actions$.pipe(
  //       ofType(sponsorLineActions.deletedSuccessfully),
  //       tap(() => this.router.navigateByUrl('/')),
  //     );
  //   },
  //   { dispatch: false },
  // );

  constructor(
    private router: Router,
    private actions$: Actions,
    private sponsorLineService: SponsorLineService,
    private sponsorSponsorLineConnectionService: SponsorSponsorLineConnectionService,
    private store: Store,
  ) {}
}
