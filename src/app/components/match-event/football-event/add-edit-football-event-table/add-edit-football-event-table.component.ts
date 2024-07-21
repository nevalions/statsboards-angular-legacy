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
  IFootballEvent,
  IFootballEventWithPlayers,
  IFootballPlayResult,
  IFootballPlayType,
} from '../../../../type/football-event.type';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  enableFullRowToEdit,
  getFormDataByIndexAndKey,
  isDataChanged,
  isFullRowEnabled,
} from '../../../../base/formHelpers';
import { FootballEvent } from '../football-event';
import { ITeam } from '../../../../type/team.type';
import { IMatchFullDataWithScoreboard } from '../../../../type/match.type';
import { DialogService } from '../../../../services/dialog.service';
import {
  createNewEvent,
  eventBallOn,
  eventBallOnKey,
  eventDeflectedPlayer,
  eventDistance,
  eventDistanceKey,
  eventDown,
  eventDownKey,
  eventDroppedPlayer,
  eventHash,
  eventId,
  eventInterceptedPlayer,
  eventKickPlayer,
  eventNumber,
  eventNumberKey,
  eventPlayResult,
  eventPlayResultKey,
  eventPlayType,
  eventPlayTypeKey,
  eventPuntPlayer,
  eventQb,
  eventQtr,
  eventQtrKey,
  eventReceiverPlayer,
  eventRunPlayer,
  eventSackPlayer,
  eventTacklePlayer,
  eventTeam,
  extractEventData,
  getBallOnFormControl,
  getEventDeflectedPlayer,
  getEventDeflectedPlayerFormControl,
  getEventDistanceFormControl,
  getEventDownFormControl,
  getEventDroppedPlayer,
  getEventDroppedPlayerFormControl,
  getEventHashFormControl,
  getEventInterceptedPlayer,
  getEventInterceptedPlayerFormControl,
  getEventKickPlayer,
  getEventKickPlayerFormControl,
  getEventNumber,
  getEventNumberFormControl,
  getEventPlayResultFormControl,
  getEventPlayTypeFormControl,
  getEventPuntPlayer,
  getEventPuntPlayerFormControl,
  getEventQbFormControl,
  getEventReceiverPlayer,
  getEventReceiverPlayerFormControl,
  getEventRunPlayer,
  getEventRunPlayerFormControl,
  getEventSackPlayer,
  getEventSackPlayerFormControl,
  getEventTacklePlayer,
  getEventTacklePlayerFormControl,
  getEventTeam,
  getEventTeamFormControl,
  getQtrFormControl,
} from '../football-event-helpers';
import {
  filterPlayResultsByType,
  incrementNumber,
  onBallOnChange,
  onDownChange,
  onPlayResultChange,
  onPlayTypeChange,
  onTeamChange,
} from '../football-event-on-change-helpers';
import { TuiButtonModule, TuiTextfieldControllerModule } from '@taiga-ui/core';
import { NgForOf } from '@angular/common';
import { TuiInputNumberModule } from '@taiga-ui/kit';
import { TuiFocusableModule, TuiValueChangesModule } from '@taiga-ui/cdk';
import { SelectTeamInMatchComponent } from '../../../../shared/ui/select/select-team-in-match/select-team-in-match.component';
import { SearchPlayerInMatchAutocompleteComponent } from '../../../../shared/ui/search/search-player-in-match-autocomplete/search-player-in-match-autocomplete.component';
import { SelectEnumComponent } from '../../../../shared/ui/select/select-enum/select-enum.component';
import { ActionsButtonsComponent } from '../../../../shared/ui/buttons/actions-buttons/actions-buttons.component';
import { AddButtonOnFinalTrComponent } from '../../../../shared/ui/buttons/add-button-on-final-tr/add-button-on-final-tr.component';
import { IEnumObject } from '../../../../type/base.type';
import { InputNumberWithButtonsComponent } from '../../../../shared/scoreboards/admin-forms/input-number-with-buttons/input-number-with-buttons.component';

@Component({
  selector: 'app-add-edit-football-event-table',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TuiTextfieldControllerModule,
    NgForOf,
    TuiInputNumberModule,
    TuiValueChangesModule,
    SelectTeamInMatchComponent,
    SearchPlayerInMatchAutocompleteComponent,
    SelectEnumComponent,
    ActionsButtonsComponent,
    AddButtonOnFinalTrComponent,
    TuiFocusableModule,
    TuiButtonModule,
    InputNumberWithButtonsComponent,
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

  @Input() min: number = 1;
  @Input() step: number = 1;

  eventForm!: FormGroup;
  arrayName = 'events';
  newEventCount = 0;

  eventFilteredPlayResultOptions: IEnumObject[] = [];
  eventPlayTypeOptions = Object.values(IFootballPlayType).map((type) => ({
    value: type,
    label: type,
  }));

  handlePlayTypeChange(
    eventsArray: FormArray,
    selectedType: IEnumObject,
    index: number,
  ): void {
    onPlayTypeChange(
      eventsArray,
      selectedType,
      index,
      this.setFilteredPlayResults.bind(this),
    );
  }

  handlePlayResultChange(
    eventsArray: FormArray,
    selectedResult: IEnumObject,
    index: number,
  ): void {
    onPlayResultChange(eventsArray, selectedResult, index);
  }

  setFilteredPlayResults(results: IEnumObject[]): void {
    this.eventFilteredPlayResultOptions = results;
  }

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

  // RENAME MOVE TO HELPERS
  handleFieldChange(event: { index: number; step: number; key: string }): void {
    const { index, step, key } = event;
    const control = this.getFormControlByFieldKey(key, index);

    if (control && !control.disabled) {
      const value = control.value || 0;
      const newValue = incrementNumber(
        this.eventsArray,
        index,
        value,
        step,
        key,
      );

      if (value !== newValue) {
        control.markAsDirty();
      }
    }
  }

  // Method to get form control based on the field key
  getFormControlByFieldKey(
    key: string,
    index: number,
  ): FormControl | null | undefined {
    switch (key) {
      case eventNumberKey:
        return this.getEventNumberFormControl(
          this.eventForm,
          this.arrayName,
          index,
        );
      case eventQtrKey:
        return this.getQtrFormControl(this.eventForm, this.arrayName, index);
      case eventBallOnKey:
        return this.getBallOnFormControl(this.eventForm, this.arrayName, index);
      case eventDistanceKey:
        return this.getEventDistanceFormControl(
          this.eventForm,
          this.arrayName,
          index,
        );
      case eventDownKey:
        return this.getEventDownFormControl(
          this.eventForm,
          this.arrayName,
          index,
        );

      default:
        return null;
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
    const controlEventDroppedPlayer = eventDroppedPlayer(index);
    const controlEventKickPlayer = eventKickPlayer(index);
    const controlEventPuntPlayer = eventPuntPlayer(index);

    const controlEventTacklePlayer = eventTacklePlayer(index);
    const controlEventDeflectedPlayer = eventDeflectedPlayer(index);
    const controlEventInterceptedPlayer = eventInterceptedPlayer(index);
    const controlEventSackPlayer = eventSackPlayer(index);

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
      [controlEventDroppedPlayer]: new FormControl(event.pass_dropped_player),
      [controlEventKickPlayer]: new FormControl(event.kick_player),
      [controlEventPuntPlayer]: new FormControl(event.punt_player),
      [controlEventTacklePlayer]: new FormControl(event.tackle_player),
      [controlEventDeflectedPlayer]: new FormControl(
        event.pass_deflected_player,
      ),
      [controlEventInterceptedPlayer]: new FormControl(
        event.pass_intercepted_player,
      ),
      [controlEventSackPlayer]: new FormControl(event.sack_player),
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
      if (lastEvent && lastEvent.id === null) {
        return;
      }
      this.newEventCount++;
      const newEvent = createNewEvent(lastEvent, this.newEventCount);
      this.events = [...this.events, newEvent];
      this.populateFormArray();
    }
  }

  onSubmitEvent(
    action: 'add' | 'edit' | 'deleteFromTeam',
    index: number,
    eventId: number | null,
  ): void {
    if (this.eventForm.valid && this.match?.match_id) {
      if (action === 'add') {
        // console.log('action', action);
        const newEventData = extractEventData(this.eventsArray, index);
        newEventData.match_id = this.match.match_id;
        newEventData.id = null;
        // console.log('New EVENT WITH NEW DATA', newEventData);
        if (newEventData) {
          this.footballEvent.createFootballEvent(
            newEventData as IFootballEvent,
          );
        }
      } else if (action === 'edit') {
        console.log('action', action);
        const updateEventData = extractEventData(this.eventsArray, index);
        console.log('UPDATE EVENT WITH NEW DATA', updateEventData);
        if (updateEventData) {
          if (updateEventData.id) {
            this.footballEvent.updateFootballEventKeyValue(
              updateEventData.id,
              updateEventData,
            );
          }
        }
      }
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

  getPlayersForSelectedTeam(
    selectedTeam: ITeam | null,
  ): IPlayerInMatchFullData[] {
    if (!selectedTeam) {
      console.log('no team');
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

  getDefencePlayersForTeam(
    selectedTeam: ITeam | null,
  ): IPlayerInMatchFullData[] {
    if (!selectedTeam) {
      console.log('no team');
      return [];
    }
    if (
      this.awayPlayersInMatch &&
      this.awayPlayersInMatch.length &&
      selectedTeam.id === this.match?.teams_data?.team_a.id
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

    if (!playType || !playType.value) {
      // console.log('No play type found');
      return false;
    }
    //
    // console.log('playtype', playType);
    // console.log('playtype Value', playType.value);
    // console.log('playtypeEnum', playTypeEnum);

    return playType.value === playTypeEnum;
  }

  isPlayResult(
    formGroup: FormGroup | any,
    index: number,
    key: string,
    playResultEnum: IFootballPlayResult,
  ): boolean {
    const playResult = getFormDataByIndexAndKey(formGroup, index, key);

    if (!playResult || !playResult.value) {
      // console.log('No play result found');
      return false;
    }
    //
    // console.log('playresult', playResult);
    // console.log('playresult Value', playResult.value);
    // console.log('playresultEnum', playResultEnum);

    return playResult.value === playResultEnum;
  }

  protected readonly IFootballPlayType = IFootballPlayType;
  protected readonly eventHashOptions = eventHashOptions;
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
  protected readonly onTeamChange = onTeamChange;
  protected readonly onDownChange = onDownChange;
  protected readonly onBallOnChange = onBallOnChange;
  protected readonly isDataChanged = isDataChanged;
  protected readonly isFullRowEnabled = isFullRowEnabled;
  protected readonly enableFullRowToEdit = enableFullRowToEdit;
  protected readonly getEventKickPlayerFormControl =
    getEventKickPlayerFormControl;
  protected readonly getEventPuntPlayerFormControl =
    getEventPuntPlayerFormControl;
  protected readonly eventNumberKey = eventNumberKey;
  protected readonly eventQtrKey = eventQtrKey;
  protected readonly eventBallOn = eventBallOn;
  protected readonly eventBallOnKey = eventBallOnKey;
  protected readonly eventDistanceKey = eventDistanceKey;
  protected readonly eventDownKey = eventDownKey;
  protected readonly eventPlayTypeKey = eventPlayTypeKey;
  protected readonly eventPlayResultKey = eventPlayResultKey;
  protected readonly IFootballPlayResult = IFootballPlayResult;
  protected readonly getEventTacklePlayerFormControl =
    getEventTacklePlayerFormControl;
  protected readonly getEventDeflectedPlayer = getEventDeflectedPlayer;
  protected readonly getEventDeflectedPlayerFormControl =
    getEventDeflectedPlayerFormControl;
  protected readonly getEventDroppedPlayerFormControl =
    getEventDroppedPlayerFormControl;
  protected readonly getEventRunPlayer = getEventRunPlayer;
  protected readonly getEventReceiverPlayer = getEventReceiverPlayer;
  protected readonly getEventDroppedPlayer = getEventDroppedPlayer;
  protected readonly getEventKickPlayer = getEventKickPlayer;
  protected readonly getEventPuntPlayer = getEventPuntPlayer;
  protected readonly getEventTacklePlayer = getEventTacklePlayer;
  protected readonly getEventInterceptedPlayer = getEventInterceptedPlayer;
  protected readonly getEventInterceptedPlayerFormControl =
    getEventInterceptedPlayerFormControl;
  protected readonly getEventSackPlayerFormControl =
    getEventSackPlayerFormControl;
  protected readonly getEventSackPlayer = getEventSackPlayer;
}
