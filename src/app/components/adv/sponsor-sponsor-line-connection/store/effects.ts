import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, filter, map, of, switchMap } from 'rxjs';
import { Store } from '@ngrx/store';
import { sponsorSponsorLineConnectionActions } from './actions';
import { SponsorSponsorLineConnectionService } from '../../sponsor-sponsor-line-connection.service';
import { ISponsorLineConnection } from '../../../../type/sponsor.type';

@Injectable()
export class SponsorSponsorLineConnectionEffects {
  createSponsorSponsorLineConnectionEffect = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(sponsorSponsorLineConnectionActions.create),
        switchMap(({ request }) => {
          return this.sponsorSponsorLineConnectionService.addItem(request).pipe(
            map(
              (currentSponsorSponsorLineConnection: ISponsorLineConnection) => {
                return sponsorSponsorLineConnectionActions.createdSuccessfully({
                  currentSponsorSponsorLineConnection,
                });
              },
            ),
            catchError(() => {
              return of(sponsorSponsorLineConnectionActions.createFailure());
            }),
          );
        }),
      );
    },
    { functional: true },
  );

  getAllSponsorSponsorLineConnectionsEffect = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(sponsorSponsorLineConnectionActions.getAll),
        switchMap(() => {
          return this.sponsorSponsorLineConnectionService.findAll().pipe(
            map(
              (allSponsorSponsorLineConnections: ISponsorLineConnection[]) => {
                return sponsorSponsorLineConnectionActions.getAllSuccess({
                  allSponsorSponsorLineConnections,
                });
              },
            ),
            catchError(() => {
              return of(sponsorSponsorLineConnectionActions.getAllFailure());
            }),
          );
        }),
      );
    },
    { functional: true },
  );

  getSponsorSponsorLineConnectionBySuccessIdEffect = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(
          sponsorSponsorLineConnectionActions.getSponsorSponsorLineConnectionIdSuccessfully,
        ), // You will have to define this action
        switchMap(({ sponsorSponsorLineConnectionId }) => {
          return this.sponsorSponsorLineConnectionService
            .findById(sponsorSponsorLineConnectionId)
            .pipe(
              // Assuming you have a getTournaments method in your service
              map(
                (
                  currentSponsorSponsorLineConnection: ISponsorLineConnection,
                ) => {
                  return sponsorSponsorLineConnectionActions.getItemSuccess({
                    currentSponsorSponsorLineConnection,
                  });
                },
              ),
              catchError(() => {
                return of(sponsorSponsorLineConnectionActions.getItemFailure());
              }),
            );
        }),
      );
    },
    { functional: true },
  );

  constructor(
    private actions$: Actions,
    private sponsorSponsorLineConnectionService: SponsorSponsorLineConnectionService,
    private store: Store,
  ) {}
}
