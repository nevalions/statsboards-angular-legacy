import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { IPlayerInMatchFullData } from '../../../../type/player.type';
import {
  eventHashOptions,
  eventPlayResultOptions,
  eventPlayTypeOptions,
  IFootballEvent,
  IFootballEventWithPlayers,
  IFootballPlayType,
} from '../../../../type/football-event.type';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { getFormDataByIndexAndKey } from '../../../../base/formHelpers';
import { TuiTextfieldControllerModule } from '@taiga-ui/core';
import { NgForOf, NgIf, TitleCasePipe, UpperCasePipe } from '@angular/common';
import { AddButtonOnFinalTrComponent } from '../../../../shared/ui/buttons/add-button-on-final-tr/add-button-on-final-tr.component';
import { ActionsButtonsComponent } from '../../../../shared/ui/buttons/actions-buttons/actions-buttons.component';
import {
  TuiComboBoxModule,
  TuiDataListWrapperModule,
  TuiFilterByInputPipeModule,
  TuiInputModule,
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
import { TuiValueChangesModule } from '@taiga-ui/cdk';
import { DialogService } from '../../../../services/dialog.service';
import { SelectEnumComponent } from '../../../../shared/ui/select/select-enum/select-enum.component';
import {
  eventBallOn,
  eventDistance,
  eventDown,
  eventHash,
  eventId,
  eventNumber,
  eventPlayResult,
  eventPlayType,
  eventQb,
  eventQtr,
  eventReceiverPlayer,
  eventRunPlayer,
  eventTeam,
  getBallOn,
  getBallOnFormControl,
  getEventDistance,
  getEventDistanceFormControl,
  getEventDown,
  getEventDownFormControl,
  getEventHash,
  getEventHashFormControl,
  getEventNumber,
  getEventNumberFormControl,
  getEventPlayResult,
  getEventPlayResultFormControl,
  getEventPlayType,
  getEventPlayTypeFormControl,
  getEventQb,
  getEventQbFormControl,
  getEventReceiverPlayer,
  getEventReceiverPlayerFormControl,
  getEventRunPlayer,
  getEventRunPlayerFormControl,
  getEventTeam,
  getEventTeamFormControl,
  getQtr,
  getQtrFormControl,
} from '../football-event-helpers';
import {
  onBallOnChange,
  onDownChange,
  onPlayTypeChange,
  onTeamChange,
} from '../football-event-on-change-helpers';

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
    NgIf,
    TuiInputModule,
    TitleCasePipe,
    SelectEnumComponent,
  ],
  templateUrl: './add-edit-football-event-table.component.html',
  styleUrl: './add-edit-football-event-table.component.less',
})
export class AddEditFootballEventTableComponent implements OnChanges, OnInit {
  @Input() events: IFootballEventWithPlayers[] | null = [];
  @Input() homePlayersInMatch: IPlayerInMatchFullData[] | null = [];
  @Input() awayPlayersInMatch: IPlayerInMatchFullData[] | null = [];
  @Input() match: IMatchFullDataWithScoreboard | null = null;
  @Input() deleteOrUpdate: 'delete' | 'update' | 'deleteFromTeam' = 'delete';

  eventForm!: FormGroup;
  arrayName = 'events';
  newEventCount = 0;

  get eventsArray(): FormArray {
    return this.eventForm.get(this.arrayName) as FormArray;
  }

  private populateFormArray(): void {
    if (this.events) {
      const eventFormArray = this.events.map((event, index) =>
        this.createFormGroupForEvent(event, index),
      );
      const formArray = this.fb.array(eventFormArray);
      // console.log('array', formArray);
      this.eventForm.setControl(this.arrayName, formArray);
    }
  }

  constructor(
    private footballEvent: FootballEvent,
    private fb: FormBuilder,
    private dialogService: DialogService,
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
    }
  }

  private createFormGroupForEvent(
    event: IFootballEventWithPlayers,
    index: number,
  ): FormGroup {
    const controlEventId = eventId(index);
    // console.log(eventId(index));
    const controlEventNumber = eventNumber(index);
    const controlEventQtr = eventQtr(index);
    const controlEventBallOn = eventBallOn(index);

    const controlEventTeam = eventTeam(index);
    const controlEventQb = eventQb(index);

    const controlEventDown = eventDown(index);
    const controlEventDistance = eventDistance(index);

    const controlEventHash = eventHash(index);
    const controlEventPlayType = eventPlayType(index);
    const controlEventPlayResult = eventPlayResult(index);

    const controlEventRunPlayer = eventRunPlayer(index);
    const controlEventReceiverPlayer = eventReceiverPlayer(index);

    // Create the form group
    const formGroup = this.fb.group({
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

    // Disable the entire form group if event.id is not null
    if (event.id !== null && event.id !== undefined) {
      formGroup.disable();
    }

    return formGroup;
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
      const eventNumber = getEventNumber(this.eventsArray, index);
      const eventQtr = getQtr(this.eventsArray, index);
      const eventBallOn = getBallOn(this.eventsArray, index);
      const eventTeam = getEventTeam(this.eventsArray, index);
      const eventQb = getEventQb(this.eventsArray, index);
      const eventDown = getEventDown(this.eventsArray, index);
      const eventDistance = getEventDistance(this.eventsArray, index);
      const eventHash = getEventHash(this.eventsArray, index);
      const eventPlayType = getEventPlayType(this.eventsArray, index);
      const eventPlayResult = getEventPlayResult(this.eventsArray, index);
      const eventRunPlayer = getEventRunPlayer(this.eventsArray, index);
      const eventReceiverPlayer = getEventReceiverPlayer(
        this.eventsArray,
        index,
      );

      const newEventData: IFootballEvent = {
        match_id: this.match.match_id,
      };

      if (eventNumber) {
        newEventData.event_number = eventNumber;
      }

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

  onDeleteEvent(id: number) {
    this.footballEvent.deleteEventInMatchById(id);
  }

  onDeleteButtonClick(dialogId: string) {
    this.dialogService.showDialog(dialogId);
  }

  enableRowToEdit(index: number): void {
    const formArray = (this.eventsArray as FormArray).at(index);
    if (formArray && formArray.disabled) {
      formArray.enable();
    } else if (formArray && formArray.enabled) {
      formArray.disable();
    } else {
      console.log(
        formArray ? 'FormGroup is already enabled' : 'FormGroup is null',
      );
    }
  }

  isRowEnabled(index: number): boolean {
    // const formArray = (this.eventForm.get(this.arrayName) as FormArray).at(
    //   index,
    // );
    const formArray = (this.eventsArray as FormArray).at(index);
    if (formArray && formArray.disabled) {
      // console.log('formGroup is disabled');
      return false;
    } else if (formArray && formArray.enabled) {
      // console.log('formGroup is enabled');
      return true;
    } else {
      console.log('formGroup is null');
      return false;
    }
  }

  isDataChanged(index: number): boolean {
    const formArray = (this.eventsArray as FormArray).at(index);
    return formArray ? formArray.dirty : false;
  }

  // getEventTeam(formGroup: FormGroup | any, index: number, key: string): ITeam {
  //   const team = getFormDataByIndexAndKey<ITeam>(formGroup, index, key);
  //   // console.log('team', team)
  //   return team;
  // }

  // getEventPlayer(
  //   formGroup: FormGroup | any,
  //   index: number,
  //   key: string,
  // ): IPlayerInMatchFullData {
  //   const player = getFormDataByIndexAndKey<IPlayerInMatchFullData>(
  //     formGroup,
  //     index,
  //     key,
  //   );
  //   // console.log(playerFormGroup, index, key);
  //   // console.log('Player', player);
  //   return player;
  // }

  // onTeamChange(selectedTeam: ITeam, index: number): void {
  //   let previousTeam = null;
  //   if (index > 0) {
  //     previousTeam = this.eventsArray.controls[index - 1].get(
  //       `eventTeam${index - 1}`,
  //     )?.value;
  //   }
  //   // console.log('teams', selectedTeam, previousTeam);
  //   if (!previousTeam || selectedTeam.id !== previousTeam.id) {
  //     // console.log('first down team change');
  //     this.eventsArray.controls[index].get(`eventDown${index}`)?.setValue(1);
  //     this.eventsArray.controls[index].get(`eventQb${index}`)?.setValue(null);
  //   }
  // }

  // private resetRunPlayer(index: number): void {
  //   this.eventsArray.controls[index]
  //     .get(`eventRunPlayer${index}`)
  //     ?.setValue(null);
  // }
  //
  // private resetReceiverPlayer(index: number): void {
  //   this.eventsArray.controls[index]
  //     .get(`eventReceiverPlayer${index}`)
  //     ?.setValue(null);
  // }
  //
  // private setPlayType(index: number, selectedType: IEnumObject): void {
  //   this.eventsArray.controls[index]
  //     .get(`eventPlayType`)
  //     ?.setValue(selectedType);
  // }
  //
  // onPlayTypeChange(selectedType: IEnumObject, index: number): void {
  //   if (!selectedType) {
  //     return;
  //   }
  //   console.log('selected type', selectedType);
  //   if (selectedType.value) {
  //     console.log('selected type value', selectedType.value);
  //
  //     switch (selectedType.value.toLowerCase()) {
  //       case IFootballPlayType.Pass.toLowerCase():
  //         this.resetRunPlayer(index);
  //         break;
  //       case IFootballPlayType.Run.toLowerCase():
  //         this.resetReceiverPlayer(index);
  //         break;
  //     }
  //
  //     this.setPlayType(index, selectedType);
  //   } else {
  //     this.resetRunPlayer(index);
  //     this.resetReceiverPlayer(index);
  //     this.setPlayType(index, selectedType);
  //   }
  // }

  // onDownChange(down: number, index: number): void {
  //   let previousDown = null;
  //   if (index > 0) {
  //     previousDown = this.eventsArray.controls[index - 1].get(
  //       `eventDown${index - 1}`,
  //     )?.value;
  //   }
  //
  //   // console.log('downs', down, previousDown);
  //   if (down === 1 && previousDown !== 1) {
  //     // console.log('first down on down change');
  //     this.eventsArray.controls[index]
  //       .get(`eventDistance${index}`)
  //       ?.setValue(10);
  //   }
  //
  //   this.eventsArray.controls[index].get(`eventDown${index}`)?.setValue(down);
  // }

  // onBallOnChange(ballOn: number, index: number): void {
  //   const updatedDown = this.isFirstDown(ballOn, index);
  //   const currentDown = this.eventsArray.controls[index].get(
  //     `eventDown${index}`,
  //   )?.value;
  //
  //   let updatedDistance;
  //   if (updatedDown === 1 && currentDown !== 1) {
  //     updatedDistance = 10;
  //   } else {
  //     updatedDistance = this.calculateDistance(ballOn, index);
  //   }
  //
  //   this.eventsArray.controls[index]
  //     .get(`eventDistance${index}`)
  //     ?.setValue(updatedDistance);
  //
  //   this.eventsArray.controls[index]
  //     .get(`eventDown${index}`)
  //     ?.setValue(updatedDown);
  // }

  // isFirstDown(ballOn: number | null, index: number): number | null {
  //   if (this.events && index >= 0 && index < this.events.length) {
  //     if (ballOn === null) {
  //       return null;
  //     }
  //     if (index > 0) {
  //       const previousEvent = this.events[index - 1];
  //       if (previousEvent && previousEvent.ball_on) {
  //         let newDistance = 10 - (ballOn - previousEvent.ball_on);
  //         if (newDistance <= 0) {
  //           return 1;
  //         } else {
  //           const previousDown =
  //             typeof previousEvent.event_down === 'number'
  //               ? previousEvent.event_down
  //               : 1;
  //           return previousDown < 4 ? previousDown + 1 : previousDown;
  //         }
  //       }
  //     } else {
  //       return 1;
  //     }
  //   }
  //   return null;
  // }

  // calculateDistance(ballOn: number | null, index: number): number | null {
  //   if (this.events && index >= 0 && index < this.events.length) {
  //     if (ballOn === null) {
  //       return null;
  //     }
  //     let newDistance: number | null = null;
  //     if (index > 0) {
  //       const previousEvent = this.events[index - 1];
  //       if (previousEvent && previousEvent.ball_on) {
  //         newDistance = 10 - (ballOn - previousEvent.ball_on);
  //         if (newDistance <= 0) {
  //           newDistance = 10;
  //         }
  //       } else {
  //         return newDistance;
  //       }
  //     } else {
  //       newDistance = 10;
  //     }
  //     return newDistance;
  //   }
  //   return null;
  // }

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

  isPlayType(
    formGroup: FormGroup | any,
    index: number,
    key: string,
    playTypeEnum: IFootballPlayType,
  ): boolean {
    const playType = getFormDataByIndexAndKey(formGroup, index, key);
    return playType ? playType.value === playTypeEnum : false;
  }

  protected readonly IFootballPlayType = IFootballPlayType;
  protected readonly eventHashOptions = eventHashOptions;
  protected readonly eventPlayTypeOptions = eventPlayTypeOptions;
  protected readonly eventPlayResultOptions = eventPlayResultOptions;
  protected readonly getQtrFormControl = getQtrFormControl;
  protected readonly getEventNumberFormControl = getEventNumberFormControl;
  protected readonly getBallOnFormControl = getBallOnFormControl;
  protected readonly getEventTeamFormControl = getEventTeamFormControl;
  protected readonly getEventQbFormControl = getEventQbFormControl;
  protected readonly getEventDownFormControl = getEventDownFormControl;
  protected readonly getEventDistanceFormControl = getEventDistanceFormControl;
  protected readonly getEventHashFormControl = getEventHashFormControl;
  protected readonly getEventPlayTypeFormControl = getEventPlayTypeFormControl;
  protected readonly getEventPlayResultFormControl =
    getEventPlayResultFormControl;
  protected readonly getEventRunPlayerFormControl =
    getEventRunPlayerFormControl;
  protected readonly getEventReceiverPlayerFormControl =
    getEventReceiverPlayerFormControl;
  protected readonly getEventTeam = getEventTeam;
  protected readonly getEventNumber = getEventNumber;
  protected readonly onPlayTypeChange = onPlayTypeChange;
  protected readonly onTeamChange = onTeamChange;
  protected readonly onDownChange = onDownChange;
  protected readonly onBallOnChange = onBallOnChange;
}
