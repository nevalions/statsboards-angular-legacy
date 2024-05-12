import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  catchError,
  combineLatest,
  filter,
  map,
  of,
  switchMap,
  take,
  withLatestFrom,
} from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { routerNavigatedAction } from '@ngrx/router-store';
import { getAllRouteParameters } from '../../../router/router.selector';
import { playerInTeamTournamentActions } from './actions';
import {
  selectCurrentPlayerInTeamTournament,
  selectCurrentPlayerInTeamTournamentId,
} from './reducers';
import { selectCurrentSportId } from '../../sport/store/reducers';
import { IPlayerInTeamTournament } from '../../../type/player.type';
import { PlayerTeamTournamentService } from '../player-team-tournament.service';
import { selectCurrentTeamId } from '../../team/store/reducers';
import {
  selectCurrentTournament,
  selectCurrentTournamentId,
} from '../../tournament/store/reducers';
import { tournamentActions } from '../../tournament/store/actions';
import { selectSportIdAndSeasonId } from '../../sport/store/selectors';
import { ITournament } from '../../../type/tournament.type';
import { selectTeamTournamentId } from '../../team/store/selectors';

@Injectable()
export class PlayerInTeamTournamentEffects {
  getPlayerInTeamTournamentIdFromRouteEffect = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(routerNavigatedAction),
        switchMap(({ payload }) => {
          let params = getAllRouteParameters(payload.routerState);
          let playerInTeamTournamentId = params.get(
            'playerInTeamTournament_id',
          );
          return of(playerInTeamTournamentId).pipe(
            filter((id: string | undefined): id is string => !!id),
            switchMap((id: string) => [
              playerInTeamTournamentActions.getPlayerInTeamTournamentIdSuccessfully(
                {
                  playerInTeamTournamentId: Number(id),
                },
              ),
            ]),
            catchError(() =>
              of(
                playerInTeamTournamentActions.getPlayerInTeamTournamentIdFailure(),
              ),
            ),
          );
        }),
      );
    },
    { functional: false },
  );

  createPlayerInTeamTournamentEffect = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(playerInTeamTournamentActions.create),
        switchMap(({ request }) => {
          return this.playerInTeamTournamentService.addItem(request).pipe(
            map((currentPlayerInTeamTournament: IPlayerInTeamTournament) => {
              return playerInTeamTournamentActions.createdSuccessfully({
                currentPlayerInTeamTournament,
              });
            }),
            catchError(() => {
              return of(playerInTeamTournamentActions.createFailure());
            }),
          );
        }),
      );
    },
    { functional: true },
  );

  updatePlayerInTeamTournamentEffect = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(playerInTeamTournamentActions.update),
        switchMap(({ id, newPlayerInTeamTournamentData }) => {
          return this.playerInTeamTournamentService
            .editItem(id, newPlayerInTeamTournamentData)
            .pipe(
              map((updatedPlayerInTeamTournament: IPlayerInTeamTournament) => {
                return playerInTeamTournamentActions.updatedSuccessfully({
                  updatedPlayerInTeamTournament,
                });
              }),
            );
        }),
        catchError(() => {
          return of(playerInTeamTournamentActions.updateFailure);
        }),
      );
    },
    { functional: true },
  );

  addPlayerInTeamEffect = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(playerInTeamTournamentActions.addPlayerToTeam),
        switchMap(({ playerId, teamId }) => {
          return this.playerInTeamTournamentService
            .editItem(playerId, { team_id: teamId })
            .pipe(
              map((updatedPlayerInTeamTournament: IPlayerInTeamTournament) => {
                return playerInTeamTournamentActions.playerAddedToTeamSuccessfully(
                  {
                    updatedPlayerInTeamTournament,
                  },
                );
              }),
            );
        }),
        catchError(() => {
          return of(playerInTeamTournamentActions.playerAddToTeamFailure);
        }),
      );
    },
    { functional: true },
  );

  removePlayerFromTeamEffect = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(playerInTeamTournamentActions.removePlayerFromTeam),
        switchMap(({ playerId }) => {
          return this.playerInTeamTournamentService
            .editItem(playerId, { team_id: null })
            .pipe(
              map((updatedPlayerInTeamTournament: IPlayerInTeamTournament) => {
                return playerInTeamTournamentActions.removePlayerFromTeamSuccessfully(
                  {
                    updatedPlayerInTeamTournament,
                  },
                );
              }),
            );
        }),
        catchError(() => {
          return of(playerInTeamTournamentActions.removePlayerFromTeamFailure);
        }),
      );
    },
    { functional: true },
  );

  getAllPlayersInTeamTournamentEffect = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(playerInTeamTournamentActions.getAll),
        switchMap(() => {
          return this.playerInTeamTournamentService.findAll().pipe(
            map((playerInTeamTournaments: IPlayerInTeamTournament[]) => {
              return playerInTeamTournamentActions.getAllItemsSuccess({
                playerInTeamTournaments,
              });
            }),
            catchError(() => {
              return of(playerInTeamTournamentActions.getAllItemsFailure());
            }),
          );
        }),
      );
    },
    { functional: true },
  );

  getAllPlayersInTournamentEffect = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(
          playerInTeamTournamentActions.getAllPlayersInTournamentByTournamentId,
        ),
        switchMap(() => this.store.select(selectCurrentTournamentId)),
        filter(
          (tournamentId): tournamentId is number =>
            tournamentId !== null && tournamentId !== undefined,
        ),
        switchMap((tournamentId: number) => {
          return this.playerInTeamTournamentService
            .findPlayersInTournamentByTournamentId(tournamentId)
            .pipe(
              map((playersInTeamTournament: IPlayerInTeamTournament[]) => {
                return playerInTeamTournamentActions.getAllPlayersInTournamentByTournamentIdSuccess(
                  { playersInTeamTournament },
                );
              }),
              catchError(() => {
                return of(
                  playerInTeamTournamentActions.getAllPlayersInTournamentByTournamentIdFailure,
                );
              }),
            );
        }),
      );
    },
    { functional: true },
  );

  getPlayerInTeamTournamentByIdSuccessEffect = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(
          playerInTeamTournamentActions.getPlayerInTeamTournamentIdSuccessfully,
        ),
        switchMap(({ playerInTeamTournamentId }) =>
          this.playerInTeamTournamentService
            .findById(playerInTeamTournamentId)
            .pipe(
              map((playerInTeamTournament: IPlayerInTeamTournament) =>
                playerInTeamTournamentActions.getItemSuccess({
                  playerInTeamTournament,
                }),
              ),
              catchError(() =>
                of(playerInTeamTournamentActions.getItemFailure()),
              ),
            ),
        ),
      );
    },
    { functional: true },
  );

  getPlayerInTeamTournamentByIdEffect = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(playerInTeamTournamentActions.get),
        switchMap(({ id }) =>
          this.playerInTeamTournamentService.findById(id).pipe(
            map((playerInTeamTournament: IPlayerInTeamTournament) =>
              playerInTeamTournamentActions.getItemSuccess({
                playerInTeamTournament,
              }),
            ),
            catchError(() =>
              of(playerInTeamTournamentActions.getItemFailure()),
            ),
          ),
        ),
      );
    },
    { functional: true },
  );

  getPlayersInTeamTournamentEffect = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(
          playerInTeamTournamentActions.getAllPlayerInTeamTournamentsByTeamIdTournamentId,
        ),
        switchMap(() => this.store.select(selectTeamTournamentId)),
        filter(
          ({ teamId, tournamentId }) =>
            teamId !== null &&
            teamId !== undefined &&
            tournamentId !== null &&
            tournamentId !== undefined,
        ),
        switchMap(({ teamId, tournamentId }) =>
          this.playerInTeamTournamentService
            .findPlayersInTeamTournamentByTeamIdTournament(
              teamId!,
              tournamentId!,
            )
            .pipe(
              map((playersInTeamTournament: IPlayerInTeamTournament[]) =>
                playerInTeamTournamentActions.getAllPlayersInTeamTournamentByTeamIdAndTournamentIdSuccess(
                  {
                    playersInTeamTournament,
                  },
                ),
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

  deletePlayerInTeamTournamentEffect = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(playerInTeamTournamentActions.delete),
        withLatestFrom(this.store.select(selectCurrentPlayerInTeamTournament)),
        switchMap(([action, currentPlayerInTeamTournament]) => {
          if (
            !currentPlayerInTeamTournament ||
            !currentPlayerInTeamTournament.id
          ) {
            return of(playerInTeamTournamentActions.deleteFailure());
          }

          return this.playerInTeamTournamentService
            .deleteItem(currentPlayerInTeamTournament.id)
            .pipe(
              map(() =>
                playerInTeamTournamentActions.deletedSuccessfully({
                  playerInTeamTournamentId: currentPlayerInTeamTournament.id!,
                  tournament_id: currentPlayerInTeamTournament.tournament_id!,
                }),
              ),
              catchError(() => {
                return of(playerInTeamTournamentActions.deleteFailure());
              }),
            );
        }),
      );
    },
    { functional: true },
  );

  deletePlayerInTeamTournamentByIdEffect = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(playerInTeamTournamentActions.deleteById),
        switchMap(({ id }) => {
          return this.playerInTeamTournamentService.deleteItem(id).pipe(
            map(() => {
              return playerInTeamTournamentActions.deletedByIdSuccessfully({
                playerInTeamTournamentId: id,
              });
            }),
            catchError(() => {
              return of(playerInTeamTournamentActions.deleteByIdFailure());
            }),
          );
        }),
      );
    },
    { functional: true },
  );

  navigateOnPlayerInTeamTournamentDeletion$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(playerInTeamTournamentActions.deletedSuccessfully),
        tap(({ tournament_id }) =>
          this.router.navigateByUrl(`/sport/1/tournament/${tournament_id}`),
        ),
      );
    },
    { dispatch: false },
  );

  constructor(
    private router: Router,
    private actions$: Actions,
    private playerInTeamTournamentService: PlayerTeamTournamentService,
    private store: Store,
  ) {}
}
