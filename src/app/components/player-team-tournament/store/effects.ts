import { concatLatestFrom } from '@ngrx/operators';import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { routerNavigatedAction } from '@ngrx/router-store';
import { Store } from '@ngrx/store';
import {
  catchError,
  combineLatest,
  filter,
  map,
  of,
  switchMap,
  withLatestFrom,
} from 'rxjs';
import { tap } from 'rxjs/operators';
import { getAllRouteParameters } from '../../../router/router.selector';
import {
  IPlayerInTeamTournament,
  IPlayerInTeamTournamentFullData,
} from '../../../type/player.type';
import { selectCurrentMatch } from '../../match/store/reducers';
import {
  selectCurrentTeamAndTournament,
  selectTeamTournamentId,
} from '../../team/store/selectors';
import { selectCurrentTournamentId } from '../../tournament/store/reducers';
import { PlayerFullDataService } from '../player-full-data.service';
import { PlayerTeamTournamentService } from '../player-team-tournament.service';
import { playerInTeamTournamentActions } from './actions';
import { selectCurrentPlayerInTeamTournament } from './reducers';

@Injectable()
export class PlayerInTeamTournamentEffects {
  private router = inject(Router);
  private actions$ = inject(Actions);
  private playerInTeamTournamentService = inject(PlayerTeamTournamentService);
  private playerFullDataService = inject(PlayerFullDataService);
  private store = inject(Store);

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
        switchMap(({ playerId, player }) => {
          return this.playerInTeamTournamentService
            .editItem(playerId, player)
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
                of(
                  playerInTeamTournamentActions.getAllPlayersInTeamTournamentByTeamIdAndTournamentIdFailure(),
                ),
              ),
            ),
        ),
      );
    },
    { functional: true },
  );

  // effect to home and team players add selector, action and effect
  getPlayersForMatchWithPersonEffect = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(
          playerInTeamTournamentActions.getAllPlayersInTeamTournamentsForMatch,
        ),
        switchMap((action) =>
          this.store.select(selectCurrentMatch).pipe(
            switchMap((currentMatch) => {
              if (
                currentMatch &&
                currentMatch.team_a_id &&
                currentMatch.team_b_id &&
                currentMatch.tournament_id
              ) {
                const home$ =
                  this.playerFullDataService.findPlayersInTeamTournamentByTeamIdTournamentWithPerson(
                    currentMatch.team_a_id,
                    currentMatch.tournament_id,
                  );
                const away$ =
                  this.playerFullDataService.findPlayersInTeamTournamentByTeamIdTournamentWithPerson(
                    currentMatch.team_b_id,
                    currentMatch.tournament_id,
                  );

                return combineLatest([home$, away$]).pipe(
                  map(([homePlayers, awayPlayers]) =>
                    playerInTeamTournamentActions.getAllPlayersInTeamTournamentForMatchSuccess(
                      {
                        availablePlayers: {
                          home: homePlayers,
                          away: awayPlayers,
                        },
                      },
                    ),
                  ),
                  catchError(() =>
                    of(
                      playerInTeamTournamentActions.getAllPlayersInTeamTournamentForMatchFailure(),
                    ),
                  ),
                );
              } else {
                return of(
                  playerInTeamTournamentActions.getAllPlayersInTeamTournamentForMatchFailure(),
                );
              }
            }),
          ),
        ),
      );
    },
    { functional: true },
  );

  // // effect to home and team players add selector, action and effect
  // getPlayersForMatchWithPersonEffect = createEffect(
  //   () => {
  //     return this.actions$.pipe(
  //       ofType(
  //         playerInTeamTournamentActions.getAllPlayersInTeamTournamentsForMatch,
  //       ),
  //       switchMap((action) =>
  //         this.store.select(selectCurrentMatch).pipe(
  //           switchMap((currentMatch) => {
  //             if (
  //               currentMatch &&
  //               currentMatch.team_a_id &&
  //               currentMatch.team_b_id &&
  //               currentMatch.tournament_id
  //             ) {
  //               const home$ =
  //                 this.playerFullDataService.findPlayersInTeamTournamentByTeamIdTournamentWithPerson(
  //                   currentMatch.team_a_id,
  //                   currentMatch.tournament_id,
  //                 );
  //               const away$ =
  //                 this.playerFullDataService.findPlayersInTeamTournamentByTeamIdTournamentWithPerson(
  //                   currentMatch.team_b_id,
  //                   currentMatch.tournament_id,
  //                 );

  //               return combineLatest([home$, away$]).pipe(
  //                 map(([homePlayers, awayPlayers]) =>
  //                   playerInTeamTournamentActions.getAllPlayersInTeamTournamentForMatchSuccess(
  //                     {
  //                       side: action.side,
  //                       playersInTeamTournamentWithPerson:
  //                         action.side === 'home' ? homePlayers : awayPlayers,
  //                     },
  //                   ),
  //                 ),
  //                 catchError(() =>
  //                   of(
  //                     playerInTeamTournamentActions.getAllPlayersInTeamTournamentForMatchFailure(),
  //                   ),
  //                 ),
  //               );
  //             } else {
  //               return of(
  //                 playerInTeamTournamentActions.getAllPlayersInTeamTournamentForMatchFailure(),
  //               );
  //             }
  //           }),
  //         ),
  //       ),
  //     );
  //   },
  //   { functional: true },
  // );

  getPlayersInTeamTournamentWithPersonEffect = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(
          playerInTeamTournamentActions.getAllPlayerInTeamTournamentsWithPersonProps,
        ),
        switchMap(({ teamId, tournamentId }) =>
          this.playerFullDataService
            .findPlayersInTeamTournamentByTeamIdTournamentWithPerson(
              teamId!,
              tournamentId!,
            )
            .pipe(
              map(
                (
                  playersInTeamTournamentWithPerson: IPlayerInTeamTournamentFullData[],
                ) =>
                  playerInTeamTournamentActions.getAllPlayersInTeamTournamentWithPersonPropsSuccess(
                    {
                      playersInTeamTournamentWithPerson,
                    },
                  ),
              ),
              catchError(() =>
                of(
                  playerInTeamTournamentActions.getAllPlayersInTeamTournamentWithPersonPropsFailure(),
                ),
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
        concatLatestFrom(() => this.store.select(selectCurrentPlayerInTeamTournament)),
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

  parsPlayersInTeamFromEESLEffect = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(playerInTeamTournamentActions.parsPlayersFromTeamEESL),
        switchMap(() => this.store.select(selectCurrentTeamAndTournament)),
        filter(
          ({ team, tournament }) =>
            team !== null &&
            team !== undefined &&
            tournament !== null &&
            tournament !== undefined,
        ),
        switchMap(({ team, tournament }) =>
          this.playerInTeamTournamentService
            .parsPlayersFromTeamEESL(
              team!.team_eesl_id!,
              tournament!.tournament_eesl_id!,
            )
            .pipe(
              map((parseList: any[] | IPlayerInTeamTournament[]) =>
                playerInTeamTournamentActions.parsedPlayerFromTeamEESLSuccessfully(
                  {
                    parseList,
                  },
                ),
              ),
              catchError(() =>
                of(
                  playerInTeamTournamentActions.parsedPlayerFromTeamEESLFailure(),
                ),
              ),
            ),
        ),
      );
    },
    { functional: true },
  );
}
