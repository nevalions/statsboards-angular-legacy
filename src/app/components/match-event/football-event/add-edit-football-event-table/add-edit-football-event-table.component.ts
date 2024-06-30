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
  AbstractControl,
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
import { ITeam } from '../../../../type/team.type';
import { SelectTeamComponent } from '../../../../shared/ui/forms/select-team/select-team.component';
import { IMatchFullDataWithScoreboard } from '../../../../type/match.type';
import { SelectTeamInMatchComponent } from '../../../../shared/ui/select/select-team-in-match/select-team-in-match.component';
import { F } from '@angular/cdk/keycodes';
import * as net from 'node:net';
import { TuiValueChangesModule } from '@taiga-ui/cdk';

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
    SelectTeamComponent,
    SelectTeamInMatchComponent,
    TuiValueChangesModule,
  ],
  templateUrl: './add-edit-football-event-table.component.html',
  styleUrl: './add-edit-football-event-table.component.less',
})
export class AddEditFootballEventTableComponent implements OnChanges, OnInit {
  @Input() events: IFootballEventWithPlayers[] | null = [];
  @Input() homePlayersInMatch: IPlayerInMatchFullData[] | null = [];
  @Input() awayPlayersInMatch: IPlayerInMatchFullData[] | null = [];
  @Input() match: IMatchFullDataWithScoreboard | null = null;

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
      // this.setInitialTeamSelection();
    }
  }

  private createFormGroupForEvent(
    event: IFootballEventWithPlayers,
    index: number,
  ): FormGroup {
    const controlEventId = `eventId${index}`;
    const controlEventNumber = `eventNumber${index}`;
    const controlEventQtr = `eventQtr${index}`;
    const controlEventBallOn = `eventBallOn${index}`;

    const controlEventTeam = `eventTeam${index}`;
    const controlEventQb = `eventQb${index}`;

    const controlEventDown = `eventDown${index}`;
    const controlEventDistance = `eventDistance${index}`;

    return this.fb.group({
      [controlEventId]: new FormControl(event.id),
      [controlEventNumber]: new FormControl(event.event_number),
      [controlEventQtr]: new FormControl(event.event_qtr),
      [controlEventBallOn]: new FormControl(event.ball_on),
      [controlEventTeam]: new FormControl(event.offense_team),
      [controlEventQb]: new FormControl(event.event_qb),
      [controlEventDown]: new FormControl(event.event_down),
      [controlEventDistance]: new FormControl(event.event_distance),
    });
  }

  addNewEvent(): void {
    if (this.events) {
      const lastEvent = this.events[this.events.length - 1];
      // console.log('lastEvent', lastEvent);
      if (lastEvent && lastEvent.id === null) {
        return;
      }
      this.newEventCount++;
      let newEventNumber: number | null;
      let newEventQtr: number | null;
      let newEventTeam: ITeam | null = null;
      let newEventQb: IPlayerInMatchFullData | null = null;
      let newEventBallOn: number | null = null;
      let newEventDown: number | null = null;
      let newEventDistance: number | null = null;

      if (lastEvent && lastEvent.event_number) {
        newEventNumber = lastEvent.event_number + 1;
      } else {
        newEventNumber = 1;
      }

      if (lastEvent && lastEvent.event_qtr) {
        newEventQtr = lastEvent.event_qtr;
      } else {
        newEventQtr = 1;
      }

      if (lastEvent && lastEvent.ball_on) {
        newEventBallOn = lastEvent.ball_on;
      }

      // if (lastEvent && lastEvent.offense_team) {
      //   newEventTeam = lastEvent.offense_team;
      // }
      //
      // if (lastEvent && lastEvent.event_qb) {
      //   newEventQb = lastEvent.event_qb;
      //   // console.log('newQB', newEventQb);
      // }

      if (lastEvent && lastEvent.event_down) {
        if (lastEvent.event_down < 4) {
          newEventDown = lastEvent.event_down + 1;
        } else {
          newEventDown = lastEvent.event_down;
        }
      } else {
        newEventDown = 1;
      }

      if (lastEvent && lastEvent.event_distance) {
        newEventDistance = lastEvent.event_distance;
      } else {
        newEventDistance = 10;
      }

      const newEvent: Partial<IFootballEventWithPlayers> = {
        id: null,
        event_number: newEventNumber,
        event_qtr: newEventQtr,
        ball_on: newEventBallOn,
        offense_team: newEventTeam,
        event_qb: newEventQb,
        event_down: newEventDown,
        event_distance: newEventDistance,
      };

      // Use spread operator to create a new array
      this.events = [...this.events, newEvent];

      // console.log(this.newEventCount, this.events);
      this.populateFormArray();

      // if (newEventTeam) {
      //   const newEventIndex = this.events.length - 1;
      //   console.log('newIndex', newEventIndex);
      //   const eventFormArray = this.eventForm.get('events') as FormArray;
      //   const newEventControl = eventFormArray.at(newEventIndex);
      //   newEventControl.get('eventTeam')?.setValue(newEventTeam.id);
      //   console.log('newEventControl', newEventControl);
      //   this.setInitialTeamSelection();
      // }
    }
  }

  onSubmitNewEvent(
    action: 'add' | 'edit' | 'deleteFromTeam',
    index: number,
    eventId: number | null,
  ): void {
    if (this.eventForm.valid && this.match?.match_id) {
      const array = this.eventForm.get('events') as FormArray;
      const eventQtr: number = getArrayFormDataByIndexAndKey(
        array,
        index,
        'eventQtr',
      );
      const eventBallOn: number = getArrayFormDataByIndexAndKey(
        array,
        index,
        'eventBallOn',
      );
      const eventTeam: ITeam = getArrayFormDataByIndexAndKey(
        array,
        index,
        'eventTeam',
      );
      const eventQb: IPlayerInMatchFullData = getArrayFormDataByIndexAndKey(
        array,
        index,
        'eventQb',
      );
      const eventDown: number = getArrayFormDataByIndexAndKey(
        array,
        index,
        'eventDown',
      );
      const eventDistance: number = getArrayFormDataByIndexAndKey(
        array,
        index,
        'eventDistance',
      );
      const newEventData: IFootballEvent = {
        match_id: this.match.match_id,
        event_number: getArrayFormDataByIndexAndKey<number>(
          array,
          index,
          'eventNumber',
        ),
      };

      if (eventQtr) {
        newEventData.event_qtr = eventQtr;
      }

      if (eventBallOn) {
        newEventData.ball_on = eventBallOn;
      }

      // console.log(eventTeam);
      if (eventTeam) {
        newEventData.offense_team = eventTeam.id;
      }

      // console.log('New Event DATA', newEventData);
      if (eventQb) {
        newEventData.event_qb = eventQb.match_player.id;
      }
      // console.log('QB', eventQb);

      if (eventDown) {
        newEventData.event_down = eventDown;
      }

      if (eventDistance) {
        newEventData.event_distance = eventDistance;
      }
      console.log('New EVENT WITH NEW DATA', newEventData);

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

  getEventTeam(formGroup: FormGroup | any, index: number, key: string): ITeam {
    const team = getFormDataByIndexAndKey<ITeam>(formGroup, index, key);
    // console.log('team', team)
    return team;
  }

  getEventPlayer(
    formGroup: FormGroup | any,
    index: number,
    key: string,
  ): IPlayerInMatchFullData {
    const player = getFormDataByIndexAndKey<IPlayerInMatchFullData>(
      formGroup,
      index,
      key,
    );
    // console.log(playerFormGroup, index, key);
    // console.log('Player', player);
    return player;
  }

  onBallOnChange(ballOn: number, index: number): void {
    // Calculate the updated down based on the current ball position
    const updatedDown = this.isFirstDown(ballOn, index);

    // Determine the updated distance. If the down has changed to 1, set distance to 10.
    // Otherwise, calculate the distance normally.
    let updatedDistance;
    if (updatedDown === 1) {
      updatedDistance = 10;
    } else {
      updatedDistance = this.calculateDistance(ballOn, index);
    }

    // Update the form controls with the new values
    this.eventsArray.controls[index]
      .get(`eventDistance${index}`)
      ?.setValue(updatedDistance);

    this.eventsArray.controls[index]
      .get(`eventDown${index}`)
      ?.setValue(updatedDown);
  }

  isFirstDown(ballOn: number | null, index: number): number | null {
    if (this.events && index >= 0 && index < this.events.length) {
      if (ballOn === null) {
        return null;
      }
      if (index > 0) {
        const previousEvent = this.events[index - 1];
        if (previousEvent && previousEvent.ball_on) {
          let newDistance = 10 - (ballOn - previousEvent.ball_on);
          if (newDistance <= 0) {
            return 1;
          } else {
            const previousDown =
              typeof previousEvent.event_down === 'number'
                ? previousEvent.event_down
                : 1;
            return previousDown < 4 ? previousDown + 1 : previousDown;
          }
        }
      } else {
        return 1;
      }
    }
    return null;
  }

  calculateDistance(ballOn: number | null, index: number): number | null {
    if (this.events && index >= 0 && index < this.events.length) {
      if (ballOn === null) {
        return null;
      }
      let newDistance: number | null = null;
      if (index > 0) {
        const previousEvent = this.events[index - 1];
        if (previousEvent && previousEvent.ball_on) {
          newDistance = 10 - (ballOn - previousEvent.ball_on);
          if (newDistance <= 0) {
            newDistance = 10;
          }
        } else {
          return newDistance;
        }
      } else {
        newDistance = 10;
      }
      return newDistance;
    }
    return null;
  }

  getPlayersForSelectedTeam(
    selectedTeam: ITeam | null,
  ): IPlayerInMatchFullData[] {
    if (!selectedTeam) {
      return [];
    }
    if (
      this.homePlayersInMatch &&
      selectedTeam === this.match?.teams_data?.team_a
    ) {
      console.log('homeTeam', this.homePlayersInMatch);
      return this.homePlayersInMatch;
    }

    if (
      this.awayPlayersInMatch &&
      selectedTeam === this.match?.teams_data?.team_b
    ) {
      console.log('awayTeam', this.awayPlayersInMatch);
      return this.awayPlayersInMatch;
    }
    return [];
  }

  getAllPlayers(): IPlayerInMatchFullData[] {
    const homePlayers = this.homePlayersInMatch || [];
    const awayPlayers = this.awayPlayersInMatch || [];
    return [...homePlayers, ...awayPlayers];
  }

  setInitialTeamSelection() {
    if (this.match) {
      const eventFormArray = this.eventForm.get('events') as FormArray;
      eventFormArray.controls.forEach((eventControl, index) => {
        const selectedTeam = this.getEventTeam(
          this.eventForm,
          index,
          'eventTeam',
        );
        if (selectedTeam) {
          eventControl.get('eventTeam')?.setValue(selectedTeam.id);
        }
      });
    }
  }

  protected readonly getFormControl = getFormControl;
  protected readonly getFormDataByIndexAndKey = getFormDataByIndexAndKey;
}
