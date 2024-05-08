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
import { IPlayerInTeamTournamentWithPersonWithSportWithPosition } from '../../../type/player.type';
import { IPosition } from '../../../type/position.type';
import { stringifyTitle, stringifyTitleUpperCase } from '../../../base/helpers';
import { SelectFromListComponent } from '../../../shared/ui/select/select-from-list/select-from-list.component';
import { WithNullOptionPipe } from '../../../pipes/with-null-option.pipe';
import { WithNullOptionRetStringOnlyPipe } from '../../../pipes/with-null-option-ret-string-only.pipe';
import { SelectPlayerNumberComponent } from '../../../shared/ui/select/select-player-number/select-player-number.component';
import { SelectPlayerPositionComponent } from '../../../shared/ui/select/select-player-position/select-player-position.component';

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
  ],
  templateUrl: './add-edit-player-to-team-tournament-table.component.html',
  styleUrl: './add-edit-player-to-team-tournament-table.component.less',
})
export class AddEditPlayerToTeamTournamentTableComponent implements OnChanges {
  @Input() teamId!: number;
  @Input() tournamentId!: number;
  @Input() players: IPlayerInTeamTournamentWithPersonWithSportWithPosition[] =
    [];
  @Input() positions: IPosition[] | null = [];

  newPlayerCount = 0;
  // numbers = Array.from({ length: 100 }, (_, i) => i.toString());
  // playerForm = new FormGroup({});

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

  isNewPlayer(): boolean {
    const newControlName = `newPlayer${this.newPlayerCount}`;
    if (this.playerForm.get(newControlName)) {
      return !!this.playerForm.get(newControlName);
    }
    // console.log('null player', this.playerForm.get(newControlName));
    return false;
  }

  private initializeForm(): void {
    const playersFormArray = this.players.map((player, index) => {
      const controlNamePlayerInTournamentId = `playerId${index}`;
      const controlNameFullName = `fullName${index}`;
      const controlNamePosition = `position${index}`;
      const controlNameNumber = `number${index}`;

      // Create form group for each player containing all controls
      return this.fb.group({
        [controlNamePlayerInTournamentId]: new FormControl(
          player.playerInTeamTournament.id,
        ),
        [controlNameFullName]: new FormControl(
          `${player.person.first_name} ${player.person.second_name}`,
        ),
        [controlNamePosition]: new FormControl(player.position),
        [controlNameNumber]: new FormControl(
          player.playerInTeamTournament.player_number,
        ),
      });
    });

    // Initialize the form group with the form array of players
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

  onSubmit(event: Event, playerId: number | null): void {
    if (playerId && this.playerForm.valid) {
      event.preventDefault();
    }
  }

  // getControlNameByIndex(index: number): string {
  //   const p = this.players[index];
  //   return p.playerInTeamTournament.id
  //     ? 'player' + p.playerInTeamTournament.id
  //     : 'newPlayer' + this.newPlayerCount;
  // }

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

  protected readonly stringifyTitle = stringifyTitleUpperCase;
  protected readonly FormControl = FormControl;
}
