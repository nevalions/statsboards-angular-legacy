import { TuiTable } from "@taiga-ui/addon-table";
import { TuiAvatar } from "@taiga-ui/kit";
import { TuiTextfieldControllerModule } from "@taiga-ui/legacy";
import {
  CdkFixedSizeVirtualScroll,
  CdkVirtualForOf,
  CdkVirtualScrollViewport,
} from '@angular/cdk/scrolling';
import {
  DatePipe,
  DecimalPipe,
  NgForOf,
  NgIf,
  TitleCasePipe,
  UpperCasePipe,
} from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { TuiExpand, TuiFallbackSrcPipe, TuiInitialsPipe } from '@taiga-ui/core';
import { environment } from '../../../../environments/environment';
import {
  getArrayFormDataByIndexAndKey,
  getFormControlWithIndex,
  getFormDataByIndexAndKey,
} from '../../../base/formHelpers';
import { DialogService } from '../../../services/dialog.service';
import { ImageService } from '../../../services/image.service';
import { ActionsButtonsComponent } from '../../../shared/ui/buttons/actions-buttons/actions-buttons.component';
import { AddButtonOnFinalTrComponent } from '../../../shared/ui/buttons/add-button-on-final-tr/add-button-on-final-tr.component';
import { DeleteDialogComponent } from '../../../shared/ui/dialogs/delete-dialog/delete-dialog.component';
import { SelectTeamComponent } from '../../../shared/ui/forms/select-team/select-team.component';
import { SelectPlayerNumberComponent } from '../../../shared/ui/select/select-player-number/select-player-number.component';
import { SelectPlayerPositionComponent } from '../../../shared/ui/select/select-player-position/select-player-position.component';
import { SelectPlayerToTeamTournamentComponent } from '../../../shared/ui/select/select-player-to-team-tournament/select-player-to-team-tournament.component';
import {
  IPlayerInSport,
  IPlayerInTeamTournament,
  IPlayerInTeamTournamentWithPersonWithSportWithPosition,
} from '../../../type/player.type';
import { IPosition } from '../../../type/position.type';
import { ITeam } from '../../../type/team.type';
import { PlayerInTeamTournament } from '../player-team-tournament';
import { calculateAge } from '../../../base/helpers';

@Component({
  selector: 'app-add-edit-player-to-team-tournament-table',
  standalone: true,
  imports: [
    TuiTextfieldControllerModule,
    ReactiveFormsModule,
    TuiTable,
    SelectPlayerToTeamTournamentComponent,
    UpperCasePipe,
    SelectPlayerNumberComponent,
    SelectPlayerPositionComponent,
    ActionsButtonsComponent,
    DeleteDialogComponent,
    AddButtonOnFinalTrComponent,
    NgIf,
    SelectTeamComponent,
    CdkVirtualScrollViewport,
    CdkVirtualForOf,
    CdkFixedSizeVirtualScroll,
    NgForOf,
    TitleCasePipe,
    TuiExpand,
    DatePipe,
    TuiAvatar,
    DecimalPipe,
      TuiFallbackSrcPipe,
      TuiInitialsPipe
],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './add-edit-player-to-team-tournament-table.component.html',
  styleUrl: './add-edit-player-to-team-tournament-table.component.less',
})
export class AddEditPlayerToTeamTournamentTableComponent
  implements OnChanges, OnInit
{
  @Input() teamId: number | null = null;
  @Input() tournamentId!: number;
  @Input() sportId!: number;
  @Input() teamsInTournament: ITeam[] | null = [];
  @Input() playersInSport: IPlayerInSport[] = [];
  @Input() availablePlayersInSport: IPlayerInSport[] = [];
  @Input()
  availablePlayersInTournament: IPlayerInTeamTournamentWithPersonWithSportWithPosition[] =
    [];
  @Input() players: IPlayerInTeamTournamentWithPersonWithSportWithPosition[] =
    [];
  @Input() positions: IPosition[] | null = [];
  @Input() deleteOrUpdate: 'delete' | 'update' | 'deleteFromTeam' = 'delete';

  newPlayerCount = 0;
  playerForm!: FormGroup;
  expandedStates: { [key: string]: boolean } = {};

  toggle(id: string): void {
    // console.log(id);
    if (id) {
      let str = id.toString();
      if (this.expandedStates[str] === undefined) {
        this.expandedStates[str] = true;
      } else {
        this.expandedStates[str] = !this.expandedStates[str];
      }
    }
  }

  isExpanded(id: string): boolean {
    return this.expandedStates[id];
  }

  get playersArray(): FormArray {
    return this.playerForm.get('players') as FormArray;
  }

  private populateFormArray(): void {
    const playersFormArray = this.players.map((player, index) =>
      this.createFormGroupForPlayer(player, index),
    );
    const formArray = this.fb.array(playersFormArray);
    // console.log(formArray);
    this.playerForm.setControl('players', formArray);
  }

  constructor(
    private playerInTeamTournament: PlayerInTeamTournament,
    private dialogService: DialogService,
    private fb: FormBuilder,
    private imageService: ImageService,
  ) {
    this.playerForm = this.fb.group({
      players: this.fb.array([]),
    });
  }

  ngOnInit() {
    if (this.players) {
      this.populateFormArray();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['players'] && this.players) {
      this.populateFormArray();
    }
  }

  private createFormGroupForPlayer(
    player: IPlayerInTeamTournamentWithPersonWithSportWithPosition,
    index: number,
  ): FormGroup {
    const controlNamePlayerInTournamentId = `playerInTeamId${index}`;
    const controlNamePlayerId = `playerId${index}`;
    const controlNameSportId = `sportId${index}`;
    const controlNameFullName = `fullName${index}`;
    const controlNamePosition = `position${index}`;
    const controlNameNumber = `number${index}`;
    const controlDateOfBirth = `dob${index}`;
    const controlPhotoUrl = `photoUrl${index}`;
    const controlNameTeam = `team${index}`;
    const controlNamePlayerInSport = `playerInSport${index}`;

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
      [controlNamePosition]: new FormControl({
        value: player.position,
        disabled: !(
          player.playerInSport === null &&
          player.playerInTeamTournament.id === null
        ),
      }),
      [controlNameNumber]: new FormControl({
        value: player.playerInTeamTournament.player_number,
        disabled: !(
          player.playerInSport === null &&
          player.playerInTeamTournament.id === null
        ),
      }),
      [controlDateOfBirth]: new FormControl(
        `${player.playerInSport?.person?.person_dob}` || '',
      ),
      [controlPhotoUrl]: new FormControl(
        `${player.playerInSport?.person?.person_photo_web_url}` || '',
      ),

      [controlNameTeam]: new FormControl(player.team),
      [controlNamePlayerInSport]: new FormControl(player.playerInSport),
    });
  }

  // private initializeForm(): void {
  //   const playersFormArray = this.players.map((player, index) => {
  //     const controlNamePlayerInTournamentId = `playerInTeamId${index}`;
  //     const controlNamePlayerId = `playerId${index}`;
  //     const controlNameSportId = `sportId${index}`;
  //     const controlNameFullName = `fullName${index}`;
  //     const controlNamePosition = `position${index}`;
  //     const controlNameNumber = `number${index}`;
  //     const controlNameTeam = `team${index}`;
  //
  //     const controlNamePlayerInSport = `playerInSport${index}`;
  //
  //     // const isPlayerSelected = player.playerInSport !== null;
  //
  //     return this.fb.group({
  //       [controlNamePlayerInTournamentId]: new FormControl(
  //         player.playerInTeamTournament.id,
  //       ),
  //       [controlNamePlayerId]: new FormControl(
  //         player.playerInTeamTournament.player_id,
  //       ),
  //       [controlNameSportId]: new FormControl(this.sportId),
  //       [controlNameFullName]: new FormControl(
  //         `${player.playerInSport?.person?.first_name} ${player.playerInSport?.person?.second_name}` ||
  //           '',
  //       ),
  //       [controlNamePosition]: new FormControl({
  //         value: player.position,
  //         disabled: !(
  //           player.playerInSport === null &&
  //           player.playerInTeamTournament.id === null
  //         ),
  //       }),
  //       [controlNameNumber]: new FormControl({
  //         value: player.playerInTeamTournament.player_number,
  //         disabled: !(
  //           player.playerInSport === null &&
  //           player.playerInTeamTournament.id === null
  //         ),
  //       }),
  //       [controlNameTeam]: new FormControl(player.team),
  //       [controlNamePlayerInSport]: new FormControl(player.playerInSport),
  //     });
  //   });
  //
  //   this.playerForm = this.fb.group({
  //     players: this.fb.array(playersFormArray),
  //   });
  // }

  onPlayerSelect(selectedPlayerId: number, playerIndex: number) {
    // console.log('SELECT PLAYER');
    const selectedPlayer = this.availablePlayersInTournament.find(
      (player) => player.playerInTeamTournament.player_id! === selectedPlayerId,
    );
    // console.log(selectedPlayer);
    if (!selectedPlayer) return;

    const playerPosition = selectedPlayer.position || '';

    // console.log('index', playerIndex);
    const playerFormGroup = (this.playerForm.get('players') as FormArray).at(
      playerIndex,
    );
    // console.log('playerFormGroup', playerFormGroup);
    // console.log('PlayerPosition', playerPosition);
    let positionKey = `position${playerIndex}`;

    playerFormGroup.patchValue({ [positionKey]: playerPosition });
  }

  enableRowToEdit(playerIndex: number): void {
    const playerFormGroup = (this.playerForm.get('players') as FormArray).at(
      playerIndex,
    );
    if (!playerFormGroup) {
      return; // Exit if playerFormGroup is not found
    }

    let positionKey = `position${playerIndex}`;
    let numberKey = `number${playerIndex}`;

    const positionInput = playerFormGroup.get(positionKey);
    const numberInput = playerFormGroup.get(numberKey);

    const anyControlEnabled =
      (positionInput && positionInput.enabled) ||
      (numberInput && numberInput.enabled);

    if (anyControlEnabled) {
      playerFormGroup.disable();
    } else {
      playerFormGroup.enable();
    }
  }

  isRowEnabled(playerIndex: number): boolean {
    const playerFormGroup = (this.playerForm.get('players') as FormArray).at(
      playerIndex,
    );
    let positionKey = `position${playerIndex}`;
    let numberKey = `number${playerIndex}`;
    if (playerFormGroup.get(positionKey)) {
      return playerFormGroup.get(positionKey)!.enabled;
    }
    if (playerFormGroup.get(numberKey)) {
      return playerFormGroup.get(numberKey)!.enabled;
    }
    return false;
  }

  isDataChanged(playerIndex: number): boolean {
    const playerFormGroup = (this.playerForm.get('players') as FormArray).at(
      playerIndex,
    );
    return playerFormGroup ? playerFormGroup.dirty : false;
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
    action: 'add' | 'edit' | 'deleteFromTeam',
    index: number,
    playerId: number | null,
  ): void {
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
          team: getArrayFormDataByIndexAndKey<ITeam>(array, index, 'team'),
        };
        if (playerData.number == 'None') {
          playerData.number = '';
        }

        const data = {
          id: playerData.playerInTeamId,
          player_id: playerData.playerId,
          position_id: playerData.position?.id,
          player_number: playerData.number,
          team_id: playerData.team?.id ? playerData.team?.id : null,
        };

        if (this.teamId) {
          data.team_id = this.teamId;
        }

        this.playerInTeamTournament.updatePlayerInTeamTournament(data);

        // console.log('Specific player data at index', index, ':', playerData);
      } else if (array && action === 'deleteFromTeam') {
        const playerData: { playerInTeamId: number } = {
          playerInTeamId: getArrayFormDataByIndexAndKey<number>(
            array,
            index,
            'playerInTeamId',
          ),
        };

        this.playerInTeamTournament.removePlayerFromTeam(
          playerData.playerInTeamId,
        );
      } else if (array && action === 'add') {
        const newPlayerData = {
          p: getArrayFormDataByIndexAndKey<
            | IPlayerInTeamTournamentWithPersonWithSportWithPosition
            | IPlayerInSport
          >(array, index, 'playerInSport'),
          position: getArrayFormDataByIndexAndKey<IPosition>(
            array,
            index,
            'position',
          ),
          number: getArrayFormDataByIndexAndKey<number>(array, index, 'number'),
          team: getArrayFormDataByIndexAndKey<ITeam>(array, index, 'team'),
        };

        if (newPlayerData.p && 'playerInSport' in newPlayerData.p) {
          const playerInTeamData: IPlayerInTeamTournament = {
            id: newPlayerData.p.playerInTeamTournament.id,
            player_id: newPlayerData.p.playerInTeamTournament.player_id,
            position_id: newPlayerData.position
              ? newPlayerData.position.id
              : null,
            player_number: newPlayerData.number
              ? newPlayerData.number.toString()
              : null,
            team_id: newPlayerData.team?.id ? newPlayerData.team?.id : null,
            tournament_id: this.tournamentId,
          };

          if (this.teamId) {
            playerInTeamData.team_id = this.teamId;
          } //?

          if (newPlayerData.position) {
            playerInTeamData.position_id = newPlayerData.position.id;
          }

          this.playerInTeamTournament.addPlayerToTeam(
            playerInTeamData.id!,
            playerInTeamData,
          );
        } else if (newPlayerData.p && 'player' in newPlayerData.p) {
          const playerInSportData: IPlayerInTeamTournament = {
            player_id: newPlayerData.p.player.id,
            position_id: newPlayerData.position
              ? newPlayerData.position.id
              : null,
            player_number: newPlayerData.number
              ? newPlayerData.number.toString()
              : null,
            team_id: newPlayerData.team?.id ? newPlayerData.team?.id : null,
            tournament_id: this.tournamentId,
          };

          // if (this.teamId) {
          //   playerInSportData.team_id = this.teamId;
          // }

          if (newPlayerData.position) {
            playerInSportData.position_id = newPlayerData.position.id;
          }

          this.playerInTeamTournament.createPlayerInTeamTournament(
            playerInSportData,
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
      team_id: this.teamId || null,
      tournament_id: this.tournamentId,
    };

    const playerWithData: IPlayerInTeamTournamentWithPersonWithSportWithPosition =
      {
        playerInSport: null,
        playerInTeamTournament: newPlayer,
        position: null,
      };

    // Use spread operator to create a new array
    this.players = [...this.players, playerWithData];
    this.populateFormArray();
  }

  onDeleteButtonClick(dialogId: string) {
    this.dialogService.showDialog(dialogId);
  }

  onCancelButtonClick() {
    if (this.players.length > 0) {
      const lastPlayer = this.players[this.players.length - 1];
      if (!lastPlayer.playerInTeamTournament.id) {
        this.players = this.players.slice(0, this.players.length - 1);
        this.populateFormArray();
      }
    }
  }

  onDelete(id: number) {
    this.playerInTeamTournament.deletePlayerInTeamTournamentWithId(id);
  }

  onImgError(event: Event) {
    this.imageService.handleError(event);
  }

  protected readonly getFormControl = getFormControlWithIndex;
  protected readonly getFormDataByIndexAndKey = getFormDataByIndexAndKey;
  backendUrl = environment.backendUrl;
  protected readonly calculateAge = calculateAge;
}
