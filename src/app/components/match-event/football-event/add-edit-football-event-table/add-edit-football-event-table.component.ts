import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { IPlayerInMatchFullData } from '../../../../type/player.type';
import {
  IFootballEvent,
  IFootballEventWithPlayers,
} from '../../../../type/football-event.type';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  getArrayFormDataByIndexAndKey,
  getFormControl,
  getFormDataByIndexAndKey,
} from '../../../../base/formHelpers';
import { TuiTextfieldControllerModule } from '@taiga-ui/core';
import { NgForOf, UpperCasePipe } from '@angular/common';
import { AddButtonOnFinalTrComponent } from '../../../../shared/ui/buttons/add-button-on-final-tr/add-button-on-final-tr.component';
import { ActionsButtonsComponent } from '../../../../shared/ui/buttons/actions-buttons/actions-buttons.component';
import { TuiInputNumberModule } from '@taiga-ui/kit';
import { FootballEvent } from '../football-event';
import { SearchPlayerInMatchAutocompleteComponent } from '../../../../shared/ui/search/search-player-in-match-autocomplete/search-player-in-match-autocomplete.component';

@Component({
  selector: 'app-add-edit-football-event-table',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TuiTextfieldControllerModule,
    NgForOf,
    AddButtonOnFinalTrComponent,
    ActionsButtonsComponent,
    TuiInputNumberModule,
    UpperCasePipe,
    SearchPlayerInMatchAutocompleteComponent,
  ],
  templateUrl: './add-edit-football-event-table.component.html',
  styleUrl: './add-edit-football-event-table.component.less',
})
export class AddEditFootballEventTableComponent implements OnChanges, OnInit {
  @Input() events: IFootballEventWithPlayers[] | null = [];
  @Input() homePlayersInMatch: IPlayerInMatchFullData[] | null = [];
  @Input() awayPlayersInMatch: IPlayerInMatchFullData[] | null = [];
  @Input() matchId: number | null = null;

  eventForm!: FormGroup;
  newEventCount = 0;

  get eventsArray(): FormArray {
    return this.eventForm.get('events') as FormArray;
  }

  private populateFormArray(): void {
    if (this.events) {
      const eventFormArray = this.events.map((event, index) =>
        this.createFormGroupForEvent(event, index),
      );
      const formArray = this.fb.array(eventFormArray);
      // console.log('array', formArray);
      this.eventForm.setControl('events', formArray);
    }
  }

  constructor(
    private footballEvent: FootballEvent,
    private fb: FormBuilder,
  ) {
    this.eventForm = this.fb.group({
      events: this.fb.array([]),
    });
  }

  ngOnInit() {
    if (this.events) {
      this.populateFormArray();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['events'] && this.events) {
      this.populateFormArray();
    }
  }

  private createFormGroupForEvent(
    event: IFootballEventWithPlayers,
    index: number,
  ): FormGroup {
    const controlEventId = `eventId${index}`;
    const controlEventNumber = `eventNumber${index}`;

    const controlEventQb = `eventQb${index}`;

    return this.fb.group({
      [controlEventId]: new FormControl(event.id),
      [controlEventNumber]: new FormControl(event.event_number),
      [controlEventQb]: new FormControl(event.event_qb),
    });
  }

  addNewEvent(): void {
    if (this.events) {
      const lastEvent = this.events[this.events.length - 1];
      if (lastEvent && lastEvent.id === null) {
        return;
      }
      this.newEventCount++;

      const newEvent: Partial<IFootballEventWithPlayers> = {
        id: null,
        event_number: null,
        event_qb: null,
      };

      // Use spread operator to create a new array
      this.events = [...this.events, newEvent];

      // console.log(this.newEventCount, this.events);
      this.populateFormArray();
    }
  }

  onCreateNewEvent(
    action: 'add' | 'edit' | 'deleteFromTeam',
    index: number,
    eventId: number | null,
  ): void {
    if (this.eventForm.valid && this.matchId) {
      const array = this.eventForm.get('events') as FormArray;
      const eventQb: IPlayerInMatchFullData = getArrayFormDataByIndexAndKey(
        array,
        index,
        'eventQb',
      );
      const newEventData: IFootballEvent = {
        match_id: this.matchId,
        event_number: getArrayFormDataByIndexAndKey<number>(
          array,
          index,
          'eventNumber',
        ),
        event_qb: null,
      };
      // console.log('New Event DATA', newEventData);
      if (eventQb) {
        newEventData.event_qb = eventQb.match_player.id;
      }
      // console.log('QB', eventQb);
      // console.log('New Event DATA WITH QB', newEventData);

      this.footballEvent.createFootballEvent(newEventData);
    }
  }

  onCancelButtonClick() {
    if (this.events && this.events.length > 0) {
      const lastEvent: IFootballEventWithPlayers =
        this.events[this.events.length - 1];
      if (!lastEvent.id) {
        this.events = this.events.slice(0, this.events.length - 1);
        this.populateFormArray();
      }
    }
  }

  getEventPlayer(
    playerFormGroup: FormGroup | any,
    index: number,
    key: string,
  ): IPlayerInMatchFullData {
    const player = getFormDataByIndexAndKey<IPlayerInMatchFullData>(
      playerFormGroup,
      index,
      key,
    );
    // console.log(playerFormGroup, index, key);
    // console.log('Player', player);
    return player;
  }

  protected readonly getFormControl = getFormControl;
  protected readonly getFormDataByIndexAndKey = getFormDataByIndexAndKey;
}
