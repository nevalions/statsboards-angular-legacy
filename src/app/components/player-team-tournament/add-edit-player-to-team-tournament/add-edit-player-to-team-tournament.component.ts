import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { CancelButtonInFormComponent } from '../../../shared/ui/buttons/cancel-button-in-form/cancel-button-in-form.component';
import { CreateButtonInFormComponent } from '../../../shared/ui/buttons/create-button-in-form/create-button-in-form.component';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TuiDialogModule, TuiErrorModule } from '@taiga-ui/core';
import { TuiFieldErrorPipeModule, TuiInputModule } from '@taiga-ui/kit';
import { Subscription } from 'rxjs';
import {
  IPlayerInSport,
  IPlayerInTeamTournament,
  IPlayerInTeamTournamentWithPersonWithSportWithPosition,
} from '../../../type/player.type';
import { DialogService } from '../../../services/dialog.service';
import { PlayerInTeamTournament } from '../player-team-tournament';
import { IPosition } from '../../../type/position.type';
import { SearchPersonInputAutocompleteComponent } from '../../../shared/ui/search/search-person-input-autocomplete/search-person-input-autocomplete.component';
import { IPerson } from '../../../type/person.type';
import { SelectPlayerPositionComponent } from '../../../shared/ui/select/select-player-position/select-player-position.component';
import { SelectPlayerNumberComponent } from '../../../shared/ui/select/select-player-number/select-player-number.component';
import { SearchPlayerInSportAutocompliteComponent } from '../../../shared/ui/search/search-player-in-sport-autocomplite/search-player-in-sport-autocomplite.component';

@Component({
  selector: 'app-add-edit-player-to-team-tournament',
  standalone: true,
  imports: [
    AsyncPipe,
    CancelButtonInFormComponent,
    CreateButtonInFormComponent,
    ReactiveFormsModule,
    TuiDialogModule,
    TuiErrorModule,
    TuiFieldErrorPipeModule,
    TuiInputModule,
    SearchPersonInputAutocompleteComponent,
    SelectPlayerPositionComponent,
    SelectPlayerNumberComponent,
    SearchPlayerInSportAutocompliteComponent,
  ],
  templateUrl: './add-edit-player-to-team-tournament.component.html',
  styleUrl: './add-edit-player-to-team-tournament.component.less',
})
export class AddEditPlayerToTeamTournamentComponent
  implements OnInit, OnDestroy, OnChanges
{
  private dialogSubscription: Subscription | undefined;

  @Input() action: string = 'add';
  @Input() dialogId: string = 'addDialog';
  @Input()
  playerToEdit: IPlayerInTeamTournamentWithPersonWithSportWithPosition =
    {} as IPlayerInTeamTournamentWithPersonWithSportWithPosition;
  @Input() availablePlayers: IPlayerInSport[] = [];
  @Input() sportPositions: IPosition[] | null = [];
  @Input() sport_Id!: number;
  @Input() teamId: number | null = null;
  @Input() tournamentId!: number;

  @Output() addEvent = new EventEmitter<any>();
  @Output() editEvent = new EventEmitter<any>();

  constructor(
    private dialogService: DialogService,
    private player: PlayerInTeamTournament,
  ) {}

  playerForm = new FormGroup({
    id: new FormControl<number | null | undefined>(undefined),
    playerInSport: new FormControl<IPlayerInSport | null>(null),
    position: new FormControl<IPosition | null>(null),
    number: new FormControl<string | null>(null),
  });

  open: boolean = false;

  showDialog(open: boolean): void {
    this.open = open;
  }

  mapPersons(players: IPlayerInSport[]): IPerson[] | null {
    const persons = players.map((player) => player.person);
    const playersId = players.map((player) => player.player.id);
    if (persons && persons.length > 0 && playersId.length > 0) {
      return <IPerson[]>persons;
    }
    return null;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (
      changes['playerToEdit'] &&
      this.action === 'edit' &&
      this.playerToEdit &&
      this.tournamentId
    ) {
      const item: IPlayerInTeamTournamentWithPersonWithSportWithPosition =
        this.playerToEdit;

      this.playerForm.setValue({
        id: item.playerInTeamTournament.id,
        playerInSport: item.playerInSport,
        position: item.position ? item.position : null,
        number: item.playerInTeamTournament.player_number
          ? item.playerInTeamTournament.player_number
          : null,
      });
    }
  }

  onSubmit(): void {
    if (this.playerForm.valid) {
      const formValue = this.playerForm.getRawValue();
      if (formValue.playerInSport) {
        const data: IPlayerInTeamTournament = {
          id: this.playerForm.get('id')?.value,
          player_id: formValue.playerInSport.player.id!,
          player_number: formValue.number,
          position_id: null,
          team_id: this.teamId,
          tournament_id: this.tournamentId,
        };

        if (formValue.position) {
          data.position_id = formValue.position.id;
        }

        if (this.action === 'add') {
          this.player.createPlayerInTeamTournament(data);
          this.playerForm.reset();
        } else if (this.action === 'edit') {
          this.player.updatePlayerInTeamTournament(data);
        }
      }
    }
  }

  ngOnInit(): void {
    // console.log(this.dialogId);
    // console.log(this.action);

    this.dialogSubscription = this.dialogService
      .getDialogEvent(this.dialogId)
      .subscribe(() => {
        this.showDialog(true);
      });
  }

  ngOnDestroy(): void {
    if (this.dialogSubscription) {
      this.dialogSubscription.unsubscribe();
    }
  }
}
