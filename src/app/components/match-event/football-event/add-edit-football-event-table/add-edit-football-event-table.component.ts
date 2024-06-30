import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { IPlayerInMatchFullData } from '../../../../type/player.type';
import {
  IEventHash,
  IFootballEvent,
  IFootballEventWithPlayers,
  IFootballPlayResult,
  IFootballPlayType,
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
import {
  TuiComboBoxModule,
  TuiDataListWrapperModule,
  TuiFilterByInputPipeModule,
  TuiInputNumberModule,
  TuiSelectModule,
  TuiSelectOptionModule,
  TuiStringifyContentPipeModule,
} from '@taiga-ui/kit';
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
    TuiSelectOptionModule,
    TuiSelectModule,
    TuiDataListWrapperModule,
    TuiComboBoxModule,
    TuiFilterByInputPipeModule,
    TuiStringifyContentPipeModule,
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

  eventHashOptions = Object.entries(IEventHash).map(([key, value]) => ({
    value: value,
    label: key,
  }));

  eventPlayTypeOptions = Object.entries(IFootballPlayType).map(
    ([key, value]) => ({
      value: value,
      label: key,
    }),
  );

  eventPlayResultOptions = Object.entries(IFootballPlayResult).map(
    ([key, value]) => ({
      value: value,
      label: key,
    }),
  );

  readonly stringify = (item: { value: string; label: string }): string =>
    `${item.value.toUpperCase()}`;

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
    if (this.events && this.match) {
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

    const controlEventHash = `eventHash${index}`;
    const controlEventPlayType = `eventPlayType${index}`;
    const controlEventPlayResult = `eventPlayResult${index}`;

    const controlEventRunPlayer = `eventRunPlayer${index}`;
    const controlEventReceiverPlayer = `eventReceiverPlayer${index}`;

    return this.fb.group({
      [controlEventId]: new FormControl(event.id),
      [controlEventNumber]: new FormControl(event.event_number),
      [controlEventQtr]: new FormControl(event.event_qtr),
      [controlEventBallOn]: new FormControl(event.ball_on),
      [controlEventTeam]: new FormControl(event.offense_team),
      [controlEventQb]: new FormControl(event.event_qb),
      [controlEventDown]: new FormControl(event.event_down),
      [controlEventDistance]: new FormControl(event.event_distance),
      [controlEventHash]: new FormControl(event.event_hash),
      [controlEventPlayType]: new FormControl(event.play_type),
      [controlEventPlayResult]: new FormControl(event.play_result),
      [controlEventRunPlayer]: new FormControl(event.run_player),
      [controlEventReceiverPlayer]: new FormControl(event.pass_received_player),
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
      let newEventDown: number | null;
      let newEventDistance: number | null;

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

      if (lastEvent && lastEvent.offense_team) {
        newEventTeam = lastEvent.offense_team;
      }

      if (lastEvent && lastEvent.event_qb) {
        newEventQb = lastEvent.event_qb;
      }

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
        event_hash: null,
        play_type: null,
        play_result: null,
      };
      // console.log('new event', newEvent);

      // Use spread operator to create a new array
      this.events = [...this.events, newEvent];

      // console.log(this.newEventCount, this.events);
      this.populateFormArray();
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
      const eventHash = getArrayFormDataByIndexAndKey(
        array,
        index,
        'eventHash',
      );
      const eventPlayType = getArrayFormDataByIndexAndKey(
        array,
        index,
        'eventPlayType',
      );
      const eventPlayResult = getArrayFormDataByIndexAndKey(
        array,
        index,
        'eventPlayResult',
      );
      const eventRunPlayer: IPlayerInMatchFullData =
        getArrayFormDataByIndexAndKey(array, index, 'eventRunPlayer');

      const eventReceiverPlayer: IPlayerInMatchFullData =
        getArrayFormDataByIndexAndKey(array, index, 'eventReceiverPlayer');

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

      if (eventTeam) {
        newEventData.offense_team = eventTeam.id;
      }

      if (eventQb) {
        newEventData.event_qb = eventQb.match_player.id;
      }

      if (eventDown) {
        newEventData.event_down = eventDown;
      }

      if (eventDistance) {
        newEventData.event_distance = eventDistance;
      }

      if (eventHash && eventHash.value) {
        newEventData.event_hash = eventHash.value.toLowerCase();
      }

      if (eventPlayType && eventPlayType.value) {
        newEventData.play_type = eventPlayType.value.toLowerCase();
      }

      if (eventPlayResult && eventPlayResult.value) {
        newEventData.play_result = eventPlayResult.value.toLowerCase();
      }

      if (eventRunPlayer) {
        newEventData.run_player = eventRunPlayer.match_player.id;
      }

      if (eventReceiverPlayer) {
        newEventData.pass_received_player = eventReceiverPlayer.match_player.id;
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

  onTeamChange(selectedTeam: ITeam, index: number): void {
    let previousTeam = null;
    if (index > 0) {
      previousTeam = this.eventsArray.controls[index - 1].get(
        `eventTeam${index - 1}`,
      )?.value;
    }
    // console.log('teams', selectedTeam, previousTeam);
    if (!previousTeam || selectedTeam.id !== previousTeam.id) {
      // console.log('first down team change');
      this.eventsArray.controls[index].get(`eventDown${index}`)?.setValue(1);
      this.eventsArray.controls[index].get(`eventQb${index}`)?.setValue(null);
    }
  }

  onDownChange(down: number, index: number): void {
    let previousDown = null;
    if (index > 0) {
      previousDown = this.eventsArray.controls[index - 1].get(
        `eventDown${index - 1}`,
      )?.value;
    }

    // console.log('downs', down, previousDown);
    if (down === 1 && previousDown !== 1) {
      // console.log('first down on down change');
      this.eventsArray.controls[index]
        .get(`eventDistance${index}`)
        ?.setValue(10);
    }

    this.eventsArray.controls[index].get(`eventDown${index}`)?.setValue(down);
  }

  onBallOnChange(ballOn: number, index: number): void {
    const updatedDown = this.isFirstDown(ballOn, index);
    const currentDown = this.eventsArray.controls[index].get(
      `eventDown${index}`,
    )?.value;

    let updatedDistance;
    if (updatedDown === 1 && currentDown !== 1) {
      updatedDistance = 10;
    } else {
      updatedDistance = this.calculateDistance(ballOn, index);
    }

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
      console.log('no team at top');
      return [];
    }
    if (
      this.homePlayersInMatch &&
      this.homePlayersInMatch.length &&
      selectedTeam.id === this.match?.teams_data?.team_a.id
    ) {
      return this.homePlayersInMatch;
    }

    if (
      this.awayPlayersInMatch &&
      this.awayPlayersInMatch.length &&
      selectedTeam.id === this.match?.teams_data?.team_b.id
    ) {
      return this.awayPlayersInMatch;
    }
    return [];
  }

  getAllPlayers(): IPlayerInMatchFullData[] {
    const homePlayers = this.homePlayersInMatch || [];
    const awayPlayers = this.awayPlayersInMatch || [];
    return [...homePlayers, ...awayPlayers];
  }

  isRunPlay(formGroup: FormGroup | any, index: number, key: string): boolean {
    const playType = getFormDataByIndexAndKey(formGroup, index, key);
    // console.log(playType);
    if (playType) {
      return playType.value === IFootballPlayType.Run;
    } else {
      return false;
    }
  }

  isPassReceivedPlay(
    formGroup: FormGroup | any,
    index: number,
    key: string,
  ): boolean {
    const playType = getFormDataByIndexAndKey(formGroup, index, key);
    // console.log(playType);
    if (playType) {
      return playType.value === IFootballPlayType.Pass;
    } else {
      return false;
    }
  }

  protected readonly getFormControl = getFormControl;
  protected readonly getFormDataByIndexAndKey = getFormDataByIndexAndKey;
}
