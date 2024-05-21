import {
  DatePipe,
  NgForOf,
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
import { TuiExpandModule, TuiTextfieldControllerModule } from '@taiga-ui/core';
import { TuiAvatarModule, TuiCheckboxLabeledModule } from '@taiga-ui/kit';
import { environment } from '../../../../environments/environment';
import {
  getArrayFormDataByIndexAndKey,
  getFormControl,
  getFormDataByIndexAndKey,
} from '../../../base/formHelpers';
import { DialogService } from '../../../services/dialog.service';
import { ImageService } from '../../../services/image.service';
import { ActionsButtonsComponent } from '../../../shared/ui/buttons/actions-buttons/actions-buttons.component';
import { AddButtonOnFinalTrComponent } from '../../../shared/ui/buttons/add-button-on-final-tr/add-button-on-final-tr.component';
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
import { PlayerInTeamTournament } from '../../player-team-tournament/player-team-tournament';
import { PlayerInMatch } from '../player-match';

@Component({
  selector: 'app-add-edit-player-match-table',
  standalone: true,
  imports: [
    TuiCheckboxLabeledModule,
    FormsModule,
    TuiTextfieldControllerModule,
    ReactiveFormsModule,
    NgForOf,
    TitleCasePipe,
    SelectPlayerNumberComponent,
    SelectPlayerPositionComponent,
    UpperCasePipe,
    ActionsButtonsComponent,
    DatePipe,
    TuiAvatarModule,
    TuiExpandModule,
    AddButtonOnFinalTrComponent,
    SelectPlayerToMatchComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './add-edit-player-match-table.component.html',
  styleUrl: './add-edit-player-match-table.component.less',
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
    console.log(id);
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
    private playerInTeamTournament: PlayerInTeamTournament,
    private playerInMatch: PlayerInMatch,
    private dialogService: DialogService,
    private fb: FormBuilder,
    private imageService: ImageService,
  ) {
    // if (this.side && this.arrayName) {
    //   const fullArrayName = this.arrayName + this.side;
    //   this.playerForm = this.fb.group({
    //     [fullArrayName]: this.fb.array([]),
    //   });
    //   if (this.players) {
    //     this.populateFormArray();
    //   }
    // }
  }

  ngOnInit() {
    if (this.side && this.players) {
      const fullArrayName = this.arrayName + this.side;
      this.playerForm = this.fb.group({
        [fullArrayName]: this.fb.array([]),
      });
      console.log('form', this.playerForm);
      this.populateFormArray();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes[this.arrayName + this.side] || this.players) {
      if (this.players.length) {
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
    const controlNamePlayerInTeamTournament = `playerInTeamTournament${index}`;

    return this.fb.group({
      [controlNamePlayerInMatchId]: new FormControl(player.match_player.id),
      [controlNamePlayerId]: new FormControl(player.match_player.id),
      [controlNameTeamId]: new FormControl(this.match.match.team_a_id),
      [controlNameFullName]: new FormControl(
        `${player.person?.first_name} ${player.person?.second_name}` || '',
      ),
      [controlNamePosition]: new FormControl({
        value: player.position,
        disabled: !(player.player_team_tournament === null),
      }),
      [controlNameNumber]: new FormControl({
        value: player.match_player.match_number,
        disabled: !(player.player_team_tournament === null),
      }),
      [controlNameStart]: new FormControl({
        value: player.match_player.is_start,
        disabled: !(player.player_team_tournament === null),
      }),
      [controlDateOfBirth]: new FormControl(
        `${player.person?.person_dob}` || '',
      ),
      [controlPhotoUrl]: new FormControl(
        `${player.person?.person_photo_web_url}` || '',
      ),

      [controlNamePlayerInTeamTournament]: new FormControl(
        player.player_team_tournament,
      ),
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

    playerFormGroup.patchValue({
      [positionKey]: playerPosition,
      [numberKey]: playerNumber,
    });
  }

  enableRowToEdit(playerIndex: number): void {
    const playerFormGroup = (
      this.playerForm.get(this.arrayName + this.side) as FormArray
    ).at(playerIndex);
    if (!playerFormGroup) {
      console.log('playerFormGroup is null');
      return;
    }

    let nameKey = `fullName${playerIndex}`;
    let positionKey = `position${playerIndex}`;
    let numberKey = `number${playerIndex}`;
    let isStartKey = `isStart${playerIndex}`;

    const nameInput = playerFormGroup.get(nameKey);
    const positionInput = playerFormGroup.get(positionKey);
    const numberInput = playerFormGroup.get(numberKey);
    const isStartInput = playerFormGroup.get(isStartKey);

    const anyControlEnabled =
      (positionInput && positionInput.enabled) ||
      (numberInput && numberInput.enabled) ||
      (nameInput && nameInput.enabled) ||
      (isStartInput && isStartInput.enabled);

    if (anyControlEnabled) {
      playerFormGroup.disable();
    } else {
      playerFormGroup.enable();
    }
  }

  isRowEnabled(playerIndex: number): boolean {
    const playerFormGroup = (
      this.playerForm.get(this.arrayName + this.side) as FormArray
    ).at(playerIndex);
    let positionKey = `position${playerIndex}`;
    let numberKey = `number${playerIndex}`;
    let nameKey = `fullName${playerIndex}`;
    let isStartKey = `isStart${playerIndex}`;

    if (playerFormGroup.get(positionKey)) {
      return playerFormGroup.get(positionKey)!.enabled;
    }
    if (playerFormGroup.get(numberKey)) {
      return playerFormGroup.get(numberKey)!.enabled;
    }
    if (playerFormGroup.get(nameKey)) {
      return playerFormGroup.get(nameKey)!.enabled;
    }
    if (playerFormGroup.get(isStartKey)) {
      return playerFormGroup.get(isStartKey)!.enabled;
    }
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

      console.log(array, index, action);
      if (array && action == 'add') {
        const newPlayerInMatch = {
          p: getArrayFormDataByIndexAndKey<IPlayerInTeamTournamentFullData>(
            array,
            index,
            'playerInTeamTournament',
          ),
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
            is_start: null,
          };

          if (newPlayerInMatch.p) {
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
      is_start: null,
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

    // Use spread operator to create a new array
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

  protected readonly getFormControl = getFormControl;
  protected readonly getFormDataByIndexAndKey = getFormDataByIndexAndKey;
  backendUrl = environment.backendUrl;
}
