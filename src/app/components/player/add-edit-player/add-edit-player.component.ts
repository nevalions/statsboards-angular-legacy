import { TuiDialog } from "@taiga-ui/core";
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
import { Subscription } from 'rxjs';
import { IPlayer, IPlayerInSport } from '../../../type/player.type';
import { Player } from '../player';
import { DialogService } from '../../../services/dialog.service';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { IPerson } from '../../../type/person.type';
import { SearchPersonInputAutocompleteComponent } from '../../../shared/ui/search/search-person-input-autocomplete/search-person-input-autocomplete.component';
import { CreateButtonInFormComponent } from '../../../shared/ui/buttons/create-button-in-form/create-button-in-form.component';
import { CancelButtonInFormComponent } from '../../../shared/ui/buttons/cancel-button-in-form/cancel-button-in-form.component';

@Component({
  selector: 'app-add-edit-player',
  standalone: true,
  imports: [
    TuiDialog,
    ReactiveFormsModule,
    SearchPersonInputAutocompleteComponent,
    CreateButtonInFormComponent,
    CancelButtonInFormComponent,
  ],
  templateUrl: './add-edit-player.component.html',
  styleUrl: './add-edit-player.component.less',
})
export class AddEditPlayerComponent implements OnInit, OnChanges, OnDestroy {
  private dialogSubscription: Subscription | undefined;

  @Input() action: string = 'add';
  @Input() dialogId: string = 'addDialog';
  @Input() allAvailablePersons: IPerson[] = [];
  @Input() playerWithPersonToUpdate: IPlayerInSport = {} as IPlayerInSport;
  @Input() sportId!: number;

  @Output() addEvent = new EventEmitter<any>();
  @Output() editEvent = new EventEmitter<any>();

  constructor(
    private player: Player,
    private dialogService: DialogService,
  ) {}

  playerForm = new FormGroup({
    id: new FormControl<number | null | undefined>(undefined),
    person: new FormControl<IPerson | null>(null, [Validators.required]),
    playerEeslId: new FormControl<number | undefined>(undefined),
  });

  open: boolean = false;

  showDialog(open: boolean): void {
    this.open = open;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (
      changes['playerWithPersonToUpdate'] &&
      this.action === 'edit' &&
      this.playerWithPersonToUpdate &&
      this.sportId
    ) {
      const pl = this.playerWithPersonToUpdate;

      this.playerForm.setValue({
        id: pl.player.id,
        person: pl.person!,
        playerEeslId: pl.player.player_eesl_id,
      });
    }
  }

  onSubmit(): void {
    if (this.playerForm.valid) {
      const formValue = this.playerForm.getRawValue();

      if (formValue.person) {
        let data: IPlayer = {
          id: this.playerForm.get('id')?.value,
          person_id: formValue.person.id!,
          player_eesl_id: formValue.playerEeslId,
          sport_id: this.sportId,
        };

        if (this.action === 'add') {
          // console.log(data);
          this.player.createPlayer(data);
          this.playerForm.reset();
        } else if (this.action === 'edit') {
          // console.log(this.action);
          // console.log(data);
          this.player.updatePlayer(data);
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
