import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { PlayerInTeamTournament } from '../player-team-tournament';
import { DialogService } from '../../../services/dialog.service';
import { NgIf, UpperCasePipe } from '@angular/common';
import { DeleteDialogComponent } from '../../../shared/ui/dialogs/delete-dialog/delete-dialog.component';
import { TuiTextfieldControllerModule } from '@taiga-ui/core';
import { TuiTableModule } from '@taiga-ui/addon-table';
import {
  IPlayerInSport,
  IPlayerInTeamTournament,
  IPlayerInTeamTournamentWithPersonWithSportWithPosition,
} from '../../../type/player.type';
import { IPosition } from '../../../type/position.type';
import { SelectPlayerNumberComponent } from '../../../shared/ui/select/select-player-number/select-player-number.component';
import { SelectPlayerPositionComponent } from '../../../shared/ui/select/select-player-position/select-player-position.component';
import { SelectPlayerToTeamTournamentComponent } from '../../../shared/ui/select/select-player-to-team-tournament/select-player-to-team-tournament.component';
import {
  getArrayFormDataByIndexAndKey,
  getFormControl,
  getFormDataByIndexAndKey,
} from '../../../base/formHelpers';
import { ActionsButtonsComponent } from '../../../shared/ui/buttons/actions-buttons/actions-buttons.component';
import { AddButtonOnFinalTrComponent } from '../../../shared/ui/buttons/add-button-on-final-tr/add-button-on-final-tr.component';

@Component({
  selector: 'app-add-edit-player-to-team-tournament-table',
  standalone: true,
  imports: [
    TuiTextfieldControllerModule,
    ReactiveFormsModule,
    TuiTableModule,
    SelectPlayerToTeamTournamentComponent,
    UpperCasePipe,
    SelectPlayerNumberComponent,
    SelectPlayerPositionComponent,
    ActionsButtonsComponent,
    DeleteDialogComponent,
    AddButtonOnFinalTrComponent,
    NgIf,
  ],
  templateUrl: './add-edit-player-to-team-tournament-table.component.html',
  styleUrl: './add-edit-player-to-team-tournament-table.component.less',
})
export class AddEditPlayerToTeamTournamentTableComponent implements OnChanges {
  @Input() teamId: number | null = null;
  @Input() tournamentId!: number;
  @Input() sportId!: number;
  @Input() playersInSport: IPlayerInSport[] = [];
  @Input() availablePlayersInSport: IPlayerInSport[] = [];
  @Input() players: IPlayerInTeamTournamentWithPersonWithSportWithPosition[] =
    [];
  @Input() positions: IPosition[] | null = [];

  newPlayerCount = 0;
  playerForm!: FormGroup;

  get playersArray(): FormArray {
    return this.playerForm.get('players') as FormArray;
  }

  constructor(
    private playerInTeamTournament: PlayerInTeamTournament,
    private dialogService: DialogService,
    private fb: FormBuilder,
  ) {
    this.initializeForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['players']) {
      this.initializeForm();
    }
  }

  private initializeForm(): void {
    const playersFormArray = this.players.map((player, index) => {
      const controlNamePlayerInTournamentId = `playerInTeamId${index}`;
      const controlNamePlayerId = `playerId${index}`;
      const controlNameSportId = `sportId${index}`;
      const controlNameFullName = `fullName${index}`;
      const controlNamePosition = `position${index}`;
      const controlNameNumber = `number${index}`;
      const controlNameTeam = `team${index}`;

      const controlNamePlayerInSport = `playerInSport${index}`;

      // Create form group for each player containing all controls
      return this.fb.group({
        [controlNamePlayerInTournamentId]: new FormControl(
          player.playerInTeamTournament.id,
        ),
        [controlNamePlayerId]: new FormControl(
          player.playerInTeamTournament.player_id,
        ),
        [controlNameSportId]: new FormControl(this.sportId),
        [controlNameFullName]: new FormControl(
          `${player.playerInSport?.person?.first_name} ${player.playerInSport?.person?.second_name}` ||
            '',
        ),
        [controlNamePosition]: new FormControl(player.position),
        [controlNameNumber]: new FormControl(
          player.playerInTeamTournament.player_number,
        ),
        [controlNameTeam]: new FormControl(player.team?.title),

        [controlNamePlayerInSport]: new FormControl(player.playerInSport),
      });
    });

    this.playerForm = this.fb.group({
      players: this.fb.array(playersFormArray),
    });
  }

  //
  // private initializeForm(): void {
  //   this.playerForm = new FormGroup({});
  //   this.players.forEach((player, index) => {
  //     const controlNameFullName = this.getControlNameByIndexAndData(
  //       'player',
  //       index,
  //       'name',
  //     );
  //     const controlPlayerFullName = new FormControl<string>(
  //       player.person.first_name + ' ' + player.person.second_name,
  //     );
  //     const controlNamePosition = this.getControlNameByIndexAndData(
  //       'player',
  //       index,
  //       'position',
  //     );
  //     const controlPlayerPosition = new FormControl<
  //       IPosition | null | undefined
  //     >(player.position);
  //     const controlNameNumber = this.getControlNameByIndexAndData(
  //       'player',
  //       index,
  //       'number',
  //     );
  //     const controlPlayerNumber = new FormControl<string | null>(
  //       player.playerInTeamTournament.player_number,
  //     );
  //
  //     this.playerForm.addControl(controlNameFullName, controlPlayerFullName);
  //     this.playerForm.addControl(controlNamePosition, controlPlayerPosition);
  //     this.playerForm.addControl(controlNameNumber, controlPlayerNumber);
  //   });
  //
  //   const newControlName = `newPlayer${this.newPlayerCount}`;
  //   if (this.isNewPlayer()) {
  //     this.playerForm.get(newControlName)!.enable();
  //   }
  // }

  onSubmit(
    // event: Event,
    action: 'add' | 'edit',
    index: number,
    playerId: number | null,
  ): void {
    // event.preventDefault();
    if (this.playerForm.valid) {
      const array = this.playerForm.get('players') as FormArray;

      if (array && playerId && action == 'edit') {
        const playerData = {
          playerInTeamId: getArrayFormDataByIndexAndKey<number>(
            array,
            index,
            'playerInTeamId',
          ),
          playerId: getArrayFormDataByIndexAndKey<number>(
            array,
            index,
            'playerId',
          ),
          sportId: getArrayFormDataByIndexAndKey<number>(
            array,
            index,
            'sportId',
          ),
          fullName: getArrayFormDataByIndexAndKey(array, index, 'fullName'),

          position: getArrayFormDataByIndexAndKey<IPosition>(
            array,
            index,
            'position',
          ),
          number: getArrayFormDataByIndexAndKey<number>(array, index, 'number'),
        };
        if (playerData.number == 'None') {
          playerData.number = '';
        }

        this.playerInTeamTournament.updatePlayerInTeamTournament({
          id: playerData.playerInTeamId,
          player_id: playerData.playerId,
          position_id: playerData.position.id,
          player_number: playerData.number,
        });
        // console.log('Specific player data at index', index, ':', playerData);
      } else if (array && action === 'add') {
        const playerData = {
          sportPlayer: getArrayFormDataByIndexAndKey<IPlayerInSport>(
            array,
            index,
            'playerInSport',
          ),
          position: getArrayFormDataByIndexAndKey<IPosition>(
            array,
            index,
            'position',
          ),
          number: getArrayFormDataByIndexAndKey<number>(array, index, 'number'),
        };

        // console.log('DDDDDDDDDDDDDD', playerData);
        if (playerData.sportPlayer) {
          const playerInTeamTournamentData: IPlayerInTeamTournament = {
            player_id: playerData.sportPlayer.player.id,
            position_id: null,
            player_number: playerData.number,
            team_id: null,
            tournament_id: this.tournamentId,
          };

          if (this.teamId) {
            playerInTeamTournamentData.team_id = this.teamId;
          }

          if (playerData.position) {
            playerInTeamTournamentData.position_id = playerData.position.id;
          }

          // console.log('PPPPPPPPPPPPPPPPPD', playerInTeamTournamentData);

          this.playerInTeamTournament.createPlayerInTeamTournament(
            playerInTeamTournamentData,
          );
        }
      }
    } else {
      console.error('Form is invalid or playerId is null');
    }
  }

  addNewPlayer(): void {
    const lastPlayer = this.players[this.players.length - 1];
    if (lastPlayer && lastPlayer.playerInTeamTournament.id === null) {
      return;
    }
    this.newPlayerCount++;

    const newPlayer: Partial<IPlayerInTeamTournament> = {
      id: null,
      position_id: null,
      player_number: '0',
      team_id: null,
      tournament_id: this.tournamentId,
    };

    if (this.teamId) {
      newPlayer.team_id = this.teamId;
    }

    const playerWithData: IPlayerInTeamTournamentWithPersonWithSportWithPosition =
      {
        playerInSport: null,
        playerInTeamTournament: newPlayer,
        position: null,
      };

    this.players = [
      ...this.players,
      playerWithData as IPlayerInTeamTournamentWithPersonWithSportWithPosition,
    ];
    this.initializeForm();
    // console.log(this.isNewPosition());
  }

  onDeleteButtonClick(dialogId: string) {
    // console.log('dialogIdButton', dialogId);
    this.dialogService.showDialog(dialogId);
  }

  onCancelButtonClick() {
    if (this.players.length > 0) {
      const lastPlayer = this.players[this.players.length - 1];
      if (!lastPlayer.playerInTeamTournament.id) {
        this.players = this.players.slice(0, this.players.length - 1);
        this.initializeForm();
      }
    }
  }

  onDelete(id: number) {
    // console.log('delete', id);
    this.playerInTeamTournament.deletePlayerInTeamTournamentWithId(id);
  }

  protected readonly getFormControl = getFormControl;
  protected readonly getFormDataByIndexAndKey = getFormDataByIndexAndKey;
}
