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

import { Router } from '@angular/router';

import { Store } from '@ngrx/store';

import { routerNavigatedAction } from '@ngrx/router-store';
import { getAllRouteParameters } from '../../../../router/router.selector';
import { sponsorActions } from './actions';
import { ISponsor } from '../../../../type/sponsor.type';
import { SponsorService } from '../../sponsor.service';

@Injectable()
export class SponsorEffects {
  getSponsorIdFromRouteEffect = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(routerNavigatedAction),
        switchMap(({ payload }) => {
          let params = getAllRouteParameters(payload.routerState);
          let sponsorId = params.get('sponsor_id');
          return of(sponsorId).pipe(
            filter((id: string | undefined): id is string => !!id),
            switchMap((id: string) => [
              sponsorActions.getSponsorIdSuccessfully({
                sponsorId: Number(id),
              }),
            ]),
            catchError(() => of(sponsorActions.getSponsorIdFailure())),
          );
        }),
      );
    },
    { functional: false },
  );

  createSponsorEffect = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(sponsorActions.create),
        switchMap(({ request }) => {
          return this.sponsorService.addItem(request).pipe(
            map((currentSponsor: ISponsor) => {
              return sponsorActions.createdSuccessfully({
                currentSponsor,
              });
            }),
            catchError(() => {
              return of(sponsorActions.createFailure());
            }),
          );
        }),
      );
    },
    { functional: true },
  );

  // createdSuccessfullyEffect$ = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(sponsorActions.createdSuccessfully),
  //     withLatestFrom(this.store.select(selectCurrentSportId)),
  //     filter(([action, sportId]) => action.currentSponsor.sport_id === sportId),
  //     map(([action]) =>
  //       sponsorActions.updateAllSponsorsInSport({ newSponsor: action.currentSponsor }),
  //     ),
  //   ),
  // );

  getAllSponsorsEffect = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(sponsorActions.getAll),
        switchMap(() => {
          return this.sponsorService.findAll().pipe(
            map((allSponsors: ISponsor[]) => {
              return sponsorActions.getAllSuccess({
                allSponsors,
              });
            }),
            catchError(() => {
              return of(sponsorActions.getAllFailure());
            }),
          );
        }),
      );
    },
    { functional: true },
  );

  // getSponsorsBySportIdEffect = createEffect(
  //   () => {
  //     return this.actions$.pipe(
  //       ofType(sponsorActions.getSponsorsBySportId),
  //       switchMap(() => this.store.select(selectCurrentSportId)),
  //       filter(
  //         (sportId): sportId is number =>
  //           sportId !== null && sportId !== undefined,
  //       ),
  //       switchMap((sportId: number) =>
  //         this.sponsorService.fetchSponsorsBySportId(sportId).pipe(
  //           map((sponsors: ISponsor[]) =>
  //             sponsorActions.getSponsorsBySportIDSuccess({ sponsors }),
  //           ),
  //           catchError(() => of(sponsorActions.getSponsorsBySportIDFailure())),
  //         ),
  //       ),
  //     );
  //   },
  //   { functional: true },
  // );

  // getSponsorsByTournamentIdEffect = createEffect(
  //   () => {
  //     return this.actions$.pipe(
  //       ofType(sponsorActions.getSponsorsByTournamentId),
  //       switchMap(() => this.store.select(selectCurrentTournamentId)),
  //       filter(
  //         (tournamentId): tournamentId is number =>
  //           tournamentId !== null && tournamentId !== undefined,
  //       ),
  //       switchMap((tournamentId) => {
  //         return this.sponsorTournamentService
  //           .fetchSponsorsByTournamentId(tournamentId)
  //           .pipe(
  //             map((sponsors: ISponsor[]) => {
  //               return sponsorActions.getSponsorsByTournamentIDSuccess({
  //                 sponsors,
  //               });
  //             }),
  //             catchError(() => {
  //               return of(sponsorActions.getSponsorsByTournamentIDFailure);
  //             }),
  //           );
  //       }),
  //     );
  //   },
  //   { functional: true },
  // );

  getSponsorBySuccessIdEffect = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(sponsorActions.getSponsorIdSuccessfully), // You will have to define this action
        switchMap(({ sponsorId }) => {
          return this.sponsorService.findById(sponsorId).pipe(
            // Assuming you have a getTournaments method in your service
            map((currentSponsor: ISponsor) => {
              return sponsorActions.getItemSuccess({
                currentSponsor,
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

  // getSponsorByIdEffect = createEffect(
  //   () => {
  //     return this.actions$.pipe(
  //       ofType(sponsorActions.get), // You will have to define this action
  //       switchMap(({ id }) => {
  //         return this.sponsorService.findById(id).pipe(
  //           // Assuming you have a getTournaments method in your service
  //           map((store: ISponsor) => {
  //             return sponsorActions.getItemSuccess({
  //               store,
  //             });
  //           }),
  //           catchError(() => {
  //             return of(sponsorActions.getItemFailure());
  //           }),
  //         );
  //       }),
  //     );
  //   },
  //   { functional: true },
  // );
  //
  // deleteSponsorEffect = createEffect(
  //   () => {
  //     return this.actions$.pipe(
  //       ofType(sponsorActions.delete),
  //       switchMap(({ id }) => {
  //         // const _id = typeof id === 'string' ? Number(id) : id;
  //         return this.sponsorService.deleteItem(id).pipe(
  //           map(() => {
  //             return sponsorActions.deletedSuccessfully({ id: id });
  //           }),
  //           catchError(() => {
  //             return of(sponsorActions.deleteFailure());
  //           }),
  //         );
  //       }),
  //     );
  //   },
  //   { functional: true },
  // );
  //
  // navigateOnSponsorDeletion$ = createEffect(
  //   () => {
  //     return this.actions$.pipe(
  //       ofType(sponsorActions.deletedSuccessfully),
  //       tap(() => this.router.navigateByUrl('/')),
  //     );
  //   },
  //   { dispatch: false },
  // );

  constructor(
    private router: Router,
    private actions$: Actions,
    private sponsorService: SponsorService,
    // private sponsorTournamentService: SponsorTournamentService,
    private store: Store,
  ) {}
}
