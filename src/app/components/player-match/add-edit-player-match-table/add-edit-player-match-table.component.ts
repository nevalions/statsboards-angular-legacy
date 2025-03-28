import { TuiTextfieldControllerModule } from "@taiga-ui/legacy";
import {
  DatePipe,
  KeyValuePipe,
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
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { TuiAppearance, TuiExpand, TuiLabel } from '@taiga-ui/core';
import { TuiAvatar, TuiCheckbox } from '@taiga-ui/kit';
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
import { ButtonIconComponent } from '../../../shared/ui/buttons/button-icon/button-icon.component';
import { SelectPlayerNumberComponent } from '../../../shared/ui/select/select-player-number/select-player-number.component';
import { SelectPlayerPositionComponent } from '../../../shared/ui/select/select-player-position/select-player-position.component';
import { SelectPlayerToMatchComponent } from '../../../shared/ui/select/select-player-to-match/select-player-to-match.component';
import { IMatchWithFullData } from '../../../type/match.type';
import {
  IPlayerInMatch,
  IPlayerInMatchFullData,
  IPlayerInTeamTournamentFullData,
} from '../../../type/player.type';
import { IPosition } from '../../../type/position.type';
import { PlayerInMatch } from '../player-match';

@Component({
  selector: 'app-add-edit-player-match-table',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './add-edit-player-match-table.component.html',
  styleUrl: './add-edit-player-match-table.component.less',
  imports: [
    KeyValuePipe,
    TuiLabel,
    FormsModule,
    TuiTextfieldControllerModule,
    ReactiveFormsModule,
    NgIf,
    NgForOf,
    TitleCasePipe,
    SelectPlayerNumberComponent,
    SelectPlayerPositionComponent,
    UpperCasePipe,
    ActionsButtonsComponent,
    DatePipe,
    TuiAvatar,
    TuiExpand,
    AddButtonOnFinalTrComponent,
    SelectPlayerToMatchComponent,
    ButtonIconComponent,
    TuiCheckbox
  ],
})
export class AddEditPlayerMatchTableComponent implements OnChanges, OnInit {
  @Input() side!: 'home' | 'away';
  @Input() sportId!: number;
  @Input() match!: IMatchWithFullData;
  @Input()
  availablePlayersInTeamTournament: IPlayerInTeamTournamentFullData[] = [];
  @Input() players: IPlayerInMatchFullData[] = [];
  @Input() positions: IPosition[] | null = [];
  @Input() deleteOrUpdate: 'delete' | 'update' | 'deleteFromTeam' = 'delete';
  @Input() homeFootballOffense: IPlayerInMatchFullData[] = [];
  @Input() awayFootballOffense: IPlayerInMatchFullData[] = [];
  @Input() homeFootballDefense: IPlayerInMatchFullData[] = [];
  @Input() awayFootballDefense: IPlayerInMatchFullData[] = [];
  @Input() homeFootballStartOffense: IPlayerInMatchFullData[] = [];
  @Input() awayFootballStartOffense: IPlayerInMatchFullData[] = [];
  @Input() homeFootballStartDefense: IPlayerInMatchFullData[] = [];
  @Input() awayFootballStartDefense: IPlayerInMatchFullData[] = [];

  newHomePlayerCount = 0;
  newAwayPlayerCount = 0;
  playerForm!: FormGroup;
  arrayName = 'players';
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
      // console.log(this.expandedStates);
    }
  }

  isExpanded(id: string): boolean {
    // console.log(this.expandedStates);
    // console.log(this.expandedStates[id]);
    return this.expandedStates[id];
  }

  get playersArray(): FormArray | null | undefined {
    if (this.side && this.arrayName) {
      return this.playerForm.get(this.arrayName + this.side) as FormArray;
    }
    return null;
  }

  private populateFormArray(): void {
    const playersFormArray = this.players.map((player, index) =>
      this.createFormGroupForPlayer(player, index),
    );
    // console.log('players from array', playersFormArray);
    const formArray = this.fb.array(playersFormArray);
    // console.log(formArray);
    if (this.arrayName && this.side) {
      if (this.players.length) {
        // console.log(this.arrayName, this.side);
        this.playerForm.setControl(this.arrayName + this.side, formArray);
      }
    }
  }

  constructor(
    private playerInMatch: PlayerInMatch,
    private dialogService: DialogService,
    private fb: FormBuilder,
    private imageService: ImageService,
  ) { }

  ngOnInit() {
    if (this.side && this.players) {
      const fullArrayName = this.arrayName + this.side;
      this.playerForm = this.fb.group({
        [fullArrayName]: this.fb.array([]),
      });
      // console.log('form', this.playerForm);
      this.populateFormArray();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes[this.arrayName + this.side] || this.players) {
      if (this.players.length) {
        // console.log('CHANGED');
        this.populateFormArray();
      }
    }
  }

  private createFormGroupForPlayer(
    player: IPlayerInMatchFullData,
    index: number,
  ): FormGroup {
    const controlNamePlayerInMatchId = `playerInMatchId${index}`;
    const controlNamePlayerId = `playerId${index}`;
    const controlNameTeamId = `teamId${index}`;
    const controlNameFullName = `fullName${index}`;
    const controlNamePosition = `position${index}`;
    const controlNameNumber = `number${index}`;
    const controlNameStart = `isStart${index}`;
    const controlDateOfBirth = `dob${index}`;
    const controlPhotoUrl = `photoUrl${index}`;
    const controlNamePlayerInMatch = `playerInMatch${index}`;
    // const controlNamePlayerInTeamTournament = `playerInTeamTournament${index}`;

    return this.fb.group({
      [controlNamePlayerInMatchId]: new FormControl(player.match_player.id),

      [controlNamePlayerId]: new FormControl(
        player.match_player.player_team_tournament_id,
      ),
      [controlNameTeamId]: new FormControl(this.match.match.team_a_id),
      [controlNameFullName]: new FormControl(
        player.person?.first_name || player.person?.second_name
          ? `${player.person?.first_name} ${player.person?.second_name}`.trim()
          : null,
      ),
      [controlNamePosition]: new FormControl({
        value: player.position,
        disabled: !(player.match_player.id === null),
      }),
      [controlNameNumber]: new FormControl({
        value: player.match_player.match_number,
        disabled: !(player.match_player.id === null),
      }),
      [controlNameStart]: new FormControl({
        value: player.match_player.is_start,
        disabled: !(player.match_player.id === null),
      }),
      [controlDateOfBirth]: new FormControl(player.person?.person_dob || null),
      [controlPhotoUrl]: new FormControl(
        `${player.person?.person_photo_web_url}` || '',
      ),

      [controlNamePlayerInMatch]: new FormControl({
        value: player,
        disabled: !(player.match_player.id === null),
      }),

      // [controlNamePlayerInTeamTournament]: new FormControl(
      //   player.player_team_tournament,
      // ),
    });
  }

  onPlayerSelect(selectedPlayerId: number, playerIndex: number) {
    const selectedPlayer = this.availablePlayersInTeamTournament.find(
      (player) => player.player_team_tournament!.id! === selectedPlayerId,
    );
    // console.log(selectedPlayer);
    if (!selectedPlayer) return;

    const playerPosition = selectedPlayer.position || '';
    const playerNumber =
      selectedPlayer.player_team_tournament?.player_number || '0';

    const playerFormGroup = (
      this.playerForm.get(this.arrayName + this.side) as FormArray
    ).at(playerIndex);

    let positionKey = `position${playerIndex}`;
    let numberKey = `number${playerIndex}`;

    // playerFormGroup.patchValue({
    //   [positionKey]: playerPosition,
    //   [numberKey]: playerNumber,
    // });

    let patchObject: { [key: string]: any } = {};

    if (!playerFormGroup.get(positionKey)?.value) {
      patchObject[positionKey] = playerPosition;
    }

    if (
      !playerFormGroup.get(numberKey)?.value ||
      playerFormGroup.get(numberKey)?.value == '0'
    ) {
      patchObject[numberKey] = playerNumber;
    }

    if (Object.keys(patchObject).length > 0) {
      playerFormGroup.patchValue(patchObject);
    }
  }

  enableRowToEdit(playerIndex: number, playerId: number | null): void {
    const playerFormGroup = (
      this.playerForm.get(this.arrayName + this.side) as FormArray
    ).at(playerIndex);
    if (!playerFormGroup) {
      console.log('playerFormGroup is null');
      return;
    }

    let playerInMatchKey = `playerInMatch${playerIndex}`;
    let positionKey = `position${playerIndex}`;
    let numberKey = `number${playerIndex}`;
    let isStartKey = `isStart${playerIndex}`;

    const positionInput = playerFormGroup.get(positionKey);
    const numberInput = playerFormGroup.get(numberKey);
    // const playerInMatchInput = playerFormGroup.get(playerInMatchKey);
    // const isStartInput = playerFormGroup.get(isStartKey);

    // console.log(playerInMatchInput, positionInput, numberInput, isStartInput);

    const anyControlEnabled =
      (positionInput && positionInput.enabled) ||
      (numberInput && numberInput.enabled);
    // (playerInMatchInput && playerInMatchInput.enabled) ||
    // (isStartInput && isStartInput.enabled);

    // console.log(anyControlEnabled);

    if (anyControlEnabled) {
      console.log('disabled');
      playerFormGroup.disable();
    } else {
      // if (playerId) {
      //   console.log('selected on button enable', playerId);
      //   this.playerInMatch.onPlayerSelect(playerId);
      // }
      playerFormGroup.enable();
    }
  }

  isRowEnabled(playerIndex: number): boolean {
    const playerFormGroup = (
      this.playerForm.get(this.arrayName + this.side) as FormArray
    ).at(playerIndex);

    let positionKey = `position${playerIndex}`;
    let numberKey = `number${playerIndex}`;
    // let playerInMatchKey = `playerInMatch${playerIndex}`;
    // let isStartKey = `isStart${playerIndex}`;

    if (playerFormGroup.get(positionKey)) {
      return playerFormGroup.get(positionKey)!.enabled;
    }
    if (playerFormGroup.get(numberKey)) {
      return playerFormGroup.get(numberKey)!.enabled;
    }
    // if (playerFormGroup.get(playerInMatchKey)) {
    //   return playerFormGroup.get(playerInMatchKey)!.enabled;
    // }
    // if (playerFormGroup.get(isStartKey)) {
    //   return playerFormGroup.get(isStartKey)!.enabled;
    // }
    return false;
  }

  isDataChanged(playerIndex: number): boolean {
    const playerFormGroup = (
      this.playerForm.get(this.arrayName + this.side) as FormArray
    ).at(playerIndex);
    return playerFormGroup ? playerFormGroup.dirty : false;
  }

  onSubmit(
    action: 'add' | 'edit' | 'deleteFromTeam',
    index: number,
    playerId: number | null,
  ): void {
    if (this.playerForm.valid) {
      const array = this.playerForm.get(
        this.arrayName + this.side,
      ) as FormArray;

      // console.log(array, index, action);
      if (array && playerId && this.match && action == 'edit') {
        const playerData = {
          playerInMatchId: getArrayFormDataByIndexAndKey<number>(
            array,
            index,
            'playerInMatchId',
          ),
          playerInMatch: getArrayFormDataByIndexAndKey<IPlayerInMatchFullData>(
            array,
            index,
            'playerInMatch',
          ),
          // playerInTeamTournament:
          //   getArrayFormDataByIndexAndKey<IPlayerInTeamTournamentFullData>(
          //     array,
          //     index,
          //     'playerInTeamTournament',
          //   ),
          teamId: getArrayFormDataByIndexAndKey<number>(array, index, 'teamId'),
          position: getArrayFormDataByIndexAndKey<IPosition>(
            array,
            index,
            'position',
          ),
          number: getArrayFormDataByIndexAndKey<number>(array, index, 'number'),
          isStart: getArrayFormDataByIndexAndKey<boolean>(
            array,
            index,
            'isStart',
          ),
        };
        const data: IPlayerInMatch = {
          id: playerData.playerInMatchId,
          // player_match_eesl_id: null,
          player_team_tournament_id: null,
          match_position_id: null,
          // match_id: this.match.id,
          match_number: null,
          // team_id: null,
          is_start: false,
        };

        // console.log(playerData.playerInMatch);

        if (playerData.playerInMatch.player_team_tournament) {
          data.player_team_tournament_id =
            playerData.playerInMatch.player_team_tournament.id;
        }
        if (playerData.position) {
          data.match_position_id = playerData.position.id;
        }
        if (playerData.number) {
          data.match_number = playerData.number;
        }
        if (playerData.isStart) {
          data.is_start = playerData.isStart;
        }

        // if (playerData.playerInMatch.player_match_eesl_id) {
        //   data.player_match_eesl_id =
        //     playerData.playerInMatch.player_match_eesl_id;
        // }
        // if (playerData.teamId) {
        //   data.team_id = playerData.teamId;
        // }

        console.log('update player in match data', data);

        this.playerInMatch.updatePlayerInMatch(data);
      } else if (array && action == 'add') {
        const newPlayerInMatch = {
          p: getArrayFormDataByIndexAndKey<IPlayerInMatchFullData>(
            array,
            index,
            'playerInMatch',
          ), //playerINMATCH
          match_number: getArrayFormDataByIndexAndKey<string>(
            array,
            index,
            'number',
          ),
          position: getArrayFormDataByIndexAndKey<IPosition>(
            array,
            index,
            'position',
          ),
          isStart: getArrayFormDataByIndexAndKey<IPosition>(
            array,
            index,
            'isStart',
          ),
        };
        console.log('new', newPlayerInMatch);
        if (newPlayerInMatch) {
          const playerInMatchData: IPlayerInMatch = {
            player_team_tournament_id: null,
            player_match_eesl_id: null,
            match_position_id: null,
            match_number: null,
            team_id: null,
            match_id: this.match.id!,
            is_start: false,
          };

          if (newPlayerInMatch.p.player_team_tournament) {
            playerInMatchData.player_team_tournament_id =
              newPlayerInMatch.p.player_team_tournament.id;
          }
          if (this.side === 'home') {
            playerInMatchData.team_id = this.match.match.team_a_id;
          } else if (this.side === 'away') {
            playerInMatchData.team_id = this.match.match.team_b_id;
          } else {
            console.error('no team');
          }
          if (newPlayerInMatch.p.player_team_tournament) {
            if (
              newPlayerInMatch.p.player_team_tournament
                .player_team_tournament_eesl_id
            ) {
              playerInMatchData.player_match_eesl_id =
                newPlayerInMatch.p.player_team_tournament.player_team_tournament_eesl_id;
            }
          }
          if (newPlayerInMatch.match_number) {
            playerInMatchData.match_number = newPlayerInMatch.match_number;
          }
          if (newPlayerInMatch.position) {
            playerInMatchData.match_position_id = newPlayerInMatch.position.id;
          }
          if (newPlayerInMatch.isStart) {
            playerInMatchData.is_start = newPlayerInMatch.isStart;
          }

          this.playerInMatch.createPlayerInMatch(playerInMatchData);
        }
      } else {
        console.error('Error Match Player');
      }
    }
  }

  addNewPlayer(): void {
    const lastPlayer = this.players[this.players.length - 1];
    if (lastPlayer && lastPlayer.match_player.id === null) {
      return;
    }

    const newPlayer: Partial<IPlayerInMatch> = {
      id: null,
      match_position_id: null,
      match_number: '0',
      team_id: null,
      match_id: this.match.id,
      is_start: false,
    };

    if (this.side === 'home') {
      this.newHomePlayerCount++;
      console.log(this.newHomePlayerCount);
      newPlayer.team_id = this.match.match.team_a_id;
    }

    if (this.side === 'away') {
      this.newAwayPlayerCount++;
      console.log(this.newAwayPlayerCount);
      newPlayer.team_id = this.match.match.team_b_id;
    }

    const playerWithData: IPlayerInMatchFullData = {
      match_player: newPlayer,
      player_team_tournament: null,
      person: null,
      position: null,
    };

    this.players = [...this.players, playerWithData];
    this.populateFormArray();
  }

  onDelete(id: number) {
    this.playerInMatch.deletePlayerInMatchWithId(id);
  }

  onImgError(event: Event) {
    this.imageService.handleError(event);
  }

  onDeleteButtonClick(dialogId: string) {
    this.dialogService.showDialog(dialogId);
  }

  onCancelButtonClick() {
    if (this.players.length > 0) {
      const lastPlayer = this.players[this.players.length - 1];
      if (!lastPlayer.match_player.id) {
        this.players = this.players.slice(0, this.players.length - 1);
        this.populateFormArray();
        // this.initializeForm();
      }
    }
  }

  // protected readonly tuiAppFlat = TuiAppearance.Flat;
  protected readonly getFormControl = getFormControlWithIndex;
  protected readonly getFormDataByIndexAndKey = getFormDataByIndexAndKey;
  backendUrl = environment.backendUrl;
}
