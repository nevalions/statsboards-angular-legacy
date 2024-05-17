import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import {
  IPlayerInMatch,
  IPlayerInMatchFullData,
  IPlayerInTeamTournament,
  IPlayerInTeamTournamentWithPersonWithSportWithPosition,
} from '../../../type/player.type';
import { IPosition } from '../../../type/position.type';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { PlayerInTeamTournament } from '../../player-team-tournament/player-team-tournament';
import { DialogService } from '../../../services/dialog.service';
import { ImageService } from '../../../services/image.service';
import { PlayerInMatch } from '../player-match';
import {
  getArrayFormDataByIndexAndKey,
  getFormControl,
  getFormDataByIndexAndKey,
} from '../../../base/formHelpers';
import { environment } from '../../../../environments/environment';
import { TuiExpandModule, TuiTextfieldControllerModule } from '@taiga-ui/core';
import {
  DatePipe,
  NgForOf,
  TitleCasePipe,
  UpperCasePipe,
} from '@angular/common';
import { SelectPlayerNumberComponent } from '../../../shared/ui/select/select-player-number/select-player-number.component';
import { SelectPlayerPositionComponent } from '../../../shared/ui/select/select-player-position/select-player-position.component';
import { ActionsButtonsComponent } from '../../../shared/ui/buttons/actions-buttons/actions-buttons.component';
import { TuiAvatarModule } from '@taiga-ui/kit';
import { AddButtonOnFinalTrComponent } from '../../../shared/ui/buttons/add-button-on-final-tr/add-button-on-final-tr.component';
import { IMatch } from '../../../type/match.type';

@Component({
  selector: 'app-add-edit-player-match-table',
  standalone: true,
  imports: [
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
  ],
  templateUrl: './add-edit-player-match-table.component.html',
  styleUrl: './add-edit-player-match-table.component.less',
})
export class AddEditPlayerMatchTableComponent implements OnChanges, OnInit {
  @Input() side: 'home' | 'away' = 'home';
  @Input() sportId!: number;
  // @Input() matchId!: number;
  // @Input() teamId: number | null = null;
  @Input() match!: IMatch;
  @Input() playersInTeamTournament: IPlayerInTeamTournament[] = [];
  @Input() availablePlayersInTeamTournament: IPlayerInTeamTournament[] = [];
  @Input() players: IPlayerInMatchFullData[] = [];
  @Input() positions: IPosition[] | null = [];
  @Input() deleteOrUpdate: 'delete' | 'update' | 'deleteFromTeam' = 'delete';

  newPlayerCount = 0;
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
    }
  }

  isExpanded(id: string): boolean {
    // console.log(this.expandedStates);
    // console.log(this.expandedStates[id]);
    return this.expandedStates[id];
  }

  get playersArray(): FormArray {
    return this.playerForm.get(this.arrayName + this.side) as FormArray;
  }

  private populateFormArray(): void {
    const playersFormArray = this.players.map((player, index) =>
      this.createFormGroupForPlayer(player, index),
    );
    const formArray = this.fb.array(playersFormArray);
    // console.log(formArray);
    this.playerForm.setControl(this.arrayName + this.side, formArray);
  }

  constructor(
    private playerInTeamTournament: PlayerInTeamTournament,
    private playerInMatch: PlayerInMatch,
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
    if (changes[this.arrayName + this.side] && this.players) {
      this.populateFormArray();
    }
  }

  private createFormGroupForPlayer(
    player: IPlayerInMatchFullData,
    index: number,
  ): FormGroup {
    const controlNamePlayerInMatchId = `playerInMatchId${index}`;
    // const controlNamePlayerId = `playerId${index}`;
    const controlNameTeamId = `teamId${index}`;
    const controlNameFullName = `fullName${index}`;
    const controlNamePosition = `position${index}`;
    const controlNameNumber = `number${index}`;
    const controlDateOfBirth = `dob${index}`;
    const controlPhotoUrl = `photoUrl${index}`;
    const controlNamePlayerInTeamTournament = `playerInTeamTournament${index}`;

    return this.fb.group({
      [controlNamePlayerInMatchId]: new FormControl(player.match_player.id),
      // [controlNamePlayerId]: new FormControl(
      //   player..player_id,
      // ),
      [controlNameTeamId]: new FormControl(this.match.team_a_id),
      [controlNameFullName]: new FormControl(
        `${player.person?.first_name} ${player.person?.second_name}` || '',
      ),
      [controlNamePosition]: new FormControl({
        value: player.position,
        disabled: !(player.match_player === null),
      }),
      [controlNameNumber]: new FormControl({
        value: player.match_player.match_number,
        disabled: true,
      }),
      [controlDateOfBirth]: new FormControl(
        `${player.person?.person_dob}` || '',
      ),
      [controlPhotoUrl]: new FormControl(
        `${player.person?.person_photo_web_url}` || '',
      ),

      [controlNamePlayerInTeamTournament]: new FormControl(
        player.team_tournament_player,
      ),
    });
  }

  //   onPlayerSelect(selectedPlayerId: number, playerIndex: number) {
  //   // console.log('SELECT PLAYER');
  //   const selectedPlayer = this.availablePlayersInTournament.find(
  //     (player) => player.playerInTeamTournament.player_id! === selectedPlayerId,
  //   );
  //   // console.log(selectedPlayer);
  //   if (!selectedPlayer) return;
  //
  //   const playerPosition = selectedPlayer.position || '';
  //
  //   // console.log('index', playerIndex);
  //   const playerFormGroup = (this.playerForm.get('players') as FormArray).at(
  //     playerIndex,
  //   );
  //   // console.log('playerFormGroup', playerFormGroup);
  //   // console.log('PlayerPosition', playerPosition);
  //   let positionKey = `position${playerIndex}`;
  //
  //   playerFormGroup.patchValue({ [positionKey]: playerPosition });
  // }

  enableRowToEdit(playerIndex: number): void {
    const playerFormGroup = (
      this.playerForm.get(this.arrayName + this.side) as FormArray
    ).at(playerIndex);
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
    const playerFormGroup = (
      this.playerForm.get(this.arrayName + this.side) as FormArray
    ).at(playerIndex);
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
    const playerFormGroup = (
      this.playerForm.get(this.arrayName + this.side) as FormArray
    ).at(playerIndex);
    return playerFormGroup ? playerFormGroup.dirty : false;
  }

  onSubmit(
    action: 'add' | 'edit' | 'deleteFromTeam',
    index: number,
    playerId: number | null,
  ): void {}

  addNewPlayer(): void {
    const lastPlayer = this.players[this.players.length - 1];
    if (lastPlayer && lastPlayer.match_player.id === null) {
      return;
    }
    this.newPlayerCount++;

    const newPlayer: Partial<IPlayerInMatch> = {
      id: null,
      match_position_id: null,
      match_number: '0',
      team_id: null,
      match_id: this.match.id,
    };

    if (this.side === 'home') {
      newPlayer.team_id = this.match.team_a_id;
    }

    if (this.side === 'away') {
      newPlayer.team_id = this.match.team_b_id;
    }

    // const playerWithData: IPlayerInTeamTournamentWithPersonWithSportWithPosition =
    //   {
    //     playerInSport: null,
    //     playerInTeamTournament: newPlayer,
    //     position: null,
    //   };
    //
    // // Use spread operator to create a new array
    // this.players = [...this.players, playerWithData];
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
