import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { PlayerInTeamTournament } from '../player-team-tournament';
import { DialogService } from '../../../services/dialog.service';
import {
  AsyncPipe,
  NgForOf,
  NgIf,
  TitleCasePipe,
  UpperCasePipe,
} from '@angular/common';
import { DeleteDialogComponent } from '../../../shared/ui/dialogs/delete-dialog/delete-dialog.component';
import { TuiAutoFocusModule, TuiLetModule } from '@taiga-ui/cdk';
import {
  TuiButtonModule,
  TuiErrorModule,
  TuiLoaderModule,
  TuiTextfieldControllerModule,
} from '@taiga-ui/core';
import {
  TuiAvatarModule,
  TuiDataListWrapperModule,
  TuiFieldErrorPipeModule,
  TuiInputModule,
  TuiInputYearModule,
  TuiSelectModule,
} from '@taiga-ui/kit';
import { TuiTableModule } from '@taiga-ui/addon-table';
import {
  IPlayerInSport,
  IPlayerInTeamTournament,
  IPlayerInTeamTournamentWithPersonWithSportWithPosition,
} from '../../../type/player.type';
import { IPosition } from '../../../type/position.type';
import { stringifyTitle, stringifyTitleUpperCase } from '../../../base/helpers';
import { SelectFromListComponent } from '../../../shared/ui/select/select-from-list/select-from-list.component';
import { WithNullOptionPipe } from '../../../pipes/with-null-option.pipe';
import { WithNullOptionRetStringOnlyPipe } from '../../../pipes/with-null-option-ret-string-only.pipe';
import { SelectPlayerNumberComponent } from '../../../shared/ui/select/select-player-number/select-player-number.component';
import { SelectPlayerPositionComponent } from '../../../shared/ui/select/select-player-position/select-player-position.component';
import { AddEditPositionComponent } from '../../position/add-edit-position/add-edit-position.component';
import { EditButtonComponent } from '../../../shared/ui/buttons/edit-button/edit-button.component';
import { SelectFromPersonComponent } from '../../../shared/ui/select/select-from-person/select-from-person.component';
import { SelectPlayerToTeamTournamentComponent } from '../../../shared/ui/select/select-player-to-team-tournament/select-player-to-team-tournament.component';
import { playerInTeamTournamentActions } from '../store/actions';

@Component({
  selector: 'app-add-edit-player-to-team-tournament-table',
  standalone: true,
  imports: [
    AsyncPipe,
    DeleteDialogComponent,
    FormsModule,
    TuiAutoFocusModule,
    TuiButtonModule,
    TuiErrorModule,
    TuiFieldErrorPipeModule,
    TuiInputModule,
    TuiInputYearModule,
    TuiTableModule,
    TuiTextfieldControllerModule,
    UpperCasePipe,
    ReactiveFormsModule,
    TitleCasePipe,
    TuiSelectModule,
    TuiDataListWrapperModule,
    SelectFromListComponent,
    NgForOf,
    TuiLetModule,
    NgIf,
    TuiAvatarModule,
    WithNullOptionPipe,
    WithNullOptionRetStringOnlyPipe,
    TuiLoaderModule,
    SelectPlayerNumberComponent,
    SelectPlayerPositionComponent,
    AddEditPositionComponent,
    EditButtonComponent,
    SelectFromPersonComponent,
    SelectPlayerToTeamTournamentComponent,
  ],
  templateUrl: './add-edit-player-to-team-tournament-table.component.html',
  styleUrl: './add-edit-player-to-team-tournament-table.component.less',
})
export class AddEditPlayerToTeamTournamentTableComponent implements OnChanges {
  @Input() teamId!: number;
  @Input() tournamentId!: number;
  @Input() sportId!: number;
  @Input() playersInSport: IPlayerInSport[] = [];
  @Input() availablePlayersInSport: IPlayerInSport[] = [];
  @Input() players: IPlayerInTeamTournamentWithPersonWithSportWithPosition[] =
    [];
  @Input() positions: IPosition[] | null = [];

  newPlayerCount = 0;
  playerForm!: FormGroup;

  getFormControl(index: number, text: string): FormControl {
    // this.logFormArrayControls();
    // this.logFormGroupControls(index);
    const formGroup = this.playersArray.at(index) as FormGroup;
    const control = formGroup.get(text + index.toString()) as FormControl;

    if (!control) {
      throw new Error(
        `Control ${text + index.toString()} not found at index ${index}`,
      );
    }

    return control;
  }

  get playersArray(): FormArray {
    return this.playerForm.get('players') as FormArray;
  }

  logFormArrayControls(): void {
    // Log the entire array for reference
    console.log('FormArray value:', this.playersArray.value);

    this.playersArray.controls.forEach(
      (group: AbstractControl, index: number) => {
        // Assuming each control in the array is a FormGroup
        console.log(`Group at index ${index}:`, group.value);

        // If you need to dive deeper into each FormGroup and log each FormControl:
        if (group instanceof FormGroup) {
          Object.keys(group.controls).forEach((controlName) => {
            console.log(
              `Control - ${controlName}:`,
              group.get(controlName)?.value,
            );
          });
        }
      },
    );
  }

  logFormGroupControls(index: number): void {
    const formGroup = this.playersArray.at(index);

    // Log the form group for overview
    console.log(`FormGroup at index ${index}:`, formGroup.value);

    // Assuming the control is a FormGroup
    if (formGroup instanceof FormGroup) {
      Object.keys(formGroup.controls).forEach((controlName) => {
        console.log(
          `Control - ${controlName}:`,
          formGroup.get(controlName)?.value,
        );
      });
    }
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

  // isNewPlayer(): boolean {
  //   const newControlName = `newPlayer${this.newPlayerCount}`;
  //   if (this.playerForm.get(newControlName)) {
  //     return !!this.playerForm.get(newControlName);
  //   }
  //   // console.log('null player', this.playerForm.get(newControlName));
  //   return false;
  // }

  private initializeForm(): void {
    const playersFormArray = this.players.map((player, index) => {
      const controlNamePlayerInTournamentId = `playerInTeamId${index}`;
      const controlNamePlayerId = `playerId${index}`;
      const controlNameSportId = `sportId${index}`;
      const controlNameFullName = `fullName${index}`;
      const controlNamePosition = `position${index}`;
      const controlNameNumber = `number${index}`;

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

  getArrayFormDataByIndexAndKey<T>(
    array: FormArray,
    index: number,
    key: string,
  ): any {
    const playersArray = array as FormArray;
    const playerFormGroup = playersArray.at(index);
    if (playersArray && playerFormGroup) {
      return playerFormGroup.get(`${key}${index}`)?.value;
    } else {
      return null;
    }
  }

  onSubmit(
    event: Event,
    action: 'add' | 'edit',
    index: number,
    playerId: number | null,
  ): void {
    event.preventDefault();
    if (this.playerForm.valid) {
      const array = this.playerForm.get('players') as FormArray;

      if (array && playerId && action == 'edit') {
        const playerData = {
          playerInTeamId: this.getArrayFormDataByIndexAndKey<number>(
            array,
            index,
            'playerInTeamId',
          ),
          playerId: this.getArrayFormDataByIndexAndKey<number>(
            array,
            index,
            'playerId',
          ),
          sportId: this.getArrayFormDataByIndexAndKey<number>(
            array,
            index,
            'sportId',
          ),
          fullName: this.getArrayFormDataByIndexAndKey(
            array,
            index,
            'fullName',
          ),

          position: this.getArrayFormDataByIndexAndKey<IPosition>(
            array,
            index,
            'position',
          ),
          number: this.getArrayFormDataByIndexAndKey<number>(
            array,
            index,
            'number',
          ),
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
          sportPlayer: this.getArrayFormDataByIndexAndKey<IPlayerInSport>(
            array,
            index,
            'playerInSport',
          ),
          position: this.getArrayFormDataByIndexAndKey<IPosition>(
            array,
            index,
            'position',
          ),
          number: this.getArrayFormDataByIndexAndKey<number>(
            array,
            index,
            'number',
          ),
        };

        // console.log(playerData);
        if (playerData.sportPlayer) {
          const playerInTeamTournamentData = {
            player_id: playerData.sportPlayer.player.id,
            position_id: null, // Default to null
            player_number: playerData.number,
            team_id: this.teamId,
            tournament_id: this.tournamentId,
          };

          if (
            playerData.sportPlayer.position &&
            typeof playerData.sportPlayer.position.id === 'number'
          ) {
            playerInTeamTournamentData.position_id =
              playerData.sportPlayer.position.id;
          }

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
      team_id: this.teamId,
      tournament_id: this.tournamentId,
    };

    const playerWithData: IPlayerInTeamTournamentWithPersonWithSportWithPosition =
      {
        // player: null,
        // person: null,
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

  getControlNameByIndexAndData(
    title: string,
    index: number,
    data: any,
  ): string {
    return `${title}-${index}-${data}`;
  }

  onDeleteButtonClick(dialogId: string) {
    // console.log('clicked');
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
    this.playerInTeamTournament.deletePlayerInTeamTournamentWithId(id);
  }
}
