import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { IPlayerInMatchFullData } from '../../../../type/player.type';
import {
  eventDirectionOptions,
  eventHashOptions,
  eventPlayTypeOptions,
  IFootballEvent,
  IFootballEventWithPlayers,
  IFootballPlayResult,
  IFootballPlayType,
  IFootballScoreResult,
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
  eventAssistTacklePlayer,
  eventBallOn,
  eventBallOnKey,
  eventDefenceScorePlayer,
  eventDeflectedPlayer,
  eventDirection,
  eventDistance,
  eventDistanceKey,
  eventDistanceMoved,
  eventDistanceOnOffence,
  eventDistanceOnOffenceKey,
  eventDown,
  eventDownKey,
  eventDroppedPlayer,
  eventFlaggedPlayer,
  eventFumblePlayer,
  eventFumbleRecoveredPlayer,
  eventHash,
  eventId,
  eventInterceptedPlayer,
  eventIsFumble,
  eventIsFumbleRecovered,
  eventKickOffPlayer,
  eventKickPlayer,
  eventNumber,
  eventNumberKey,
  eventPatOnePlayer,
  eventPlayResult,
  eventPlayResultKey,
  eventPlayType,
  eventPlayTypeKey,
  eventPuntPlayer,
  eventQb,
  eventQtr,
  eventQtrKey,
  eventReceiverPlayer,
  eventReturnPlayer,
  eventRunPlayer,
  eventSackPlayer,
  eventScorePlayer,
  eventScoreResult,
  eventScoreResultKey,
  eventTacklePlayer,
  eventTeam,
  extractEventData,
  getBallOn,
  getBallOnFormControl,
  getEventAssistTacklePlayer,
  getEventAssistTacklePlayerFormControl,
  getEventDefenceScorePlayer,
  getEventDefenceScorePlayerFormControl,
  getEventDeflectedPlayer,
  getEventDeflectedPlayerFormControl,
  getEventDirectionFormControl,
  getEventDistance,
  getEventDistanceFormControl,
  getEventDistanceMoved,
  getEventDistanceOnOffenceFormControl,
  getEventDown,
  getEventDownFormControl,
  getEventDroppedPlayer,
  getEventDroppedPlayerFormControl,
  getEventFlaggedPlayer,
  getEventFlaggedPlayerFormControl,
  getEventFumblePlayer,
  getEventFumblePlayerFormControl,
  getEventFumbleRecoveredPlayer,
  getEventFumbleRecoveredPlayerFormControl,
  getEventHashFormControl,
  getEventInterceptedPlayer,
  getEventInterceptedPlayerFormControl,
  getEventIsFumble,
  getEventIsFumbleFormControl,
  getEventIsFumbleRecovered,
  getEventIsFumbleRecoveredFormControl,
  getEventKickOffPlayer,
  getEventKickOffPlayerFormControl,
  getEventKickPlayer,
  getEventKickPlayerFormControl,
  getEventNumber,
  getEventNumberFormControl,
  getEventPatOnePlayer,
  getEventPatOnePlayerFormControl,
  getEventPlayResult,
  getEventPlayResultFormControl,
  getEventPlayType,
  getEventPlayTypeFormControl,
  getEventPuntPlayer,
  getEventPuntPlayerFormControl,
  getEventQb,
  getEventQbFormControl,
  getEventReceiverPlayer,
  getEventReceiverPlayerFormControl,
  getEventReturnPlayer,
  getEventReturnPlayerFormControl,
  getEventRunPlayer,
  getEventRunPlayerFormControl,
  getEventSackPlayer,
  getEventSackPlayerFormControl,
  getEventScorePlayer,
  getEventScorePlayerFormControl,
  getEventScoreResult,
  getEventScoreResultFormControl,
  getEventTacklePlayer,
  getEventTacklePlayerFormControl,
  getEventTeam,
  getEventTeamFormControl,
  getQtrFormControl,
} from '../football-event-helpers';
import {
  changePlayResultOnPlayTypeChange,
  filterPlayResultsByType,
  filterScoreResultsByType,
  incrementNumberWithArrayAndIndex,
  incrementOnBall,
  onBallOnChange,
  onDownChange,
  onOffenceScore,
  onPlayResultChange,
  onPlayTypeChange,
  onTeamChange,
} from '../football-event-on-change-helpers';
import {
  TuiAppearance,
  TuiButtonModule,
  TuiTextfieldControllerModule,
} from '@taiga-ui/core';
import { hexToRgba } from '../../../../base/helpers';
import { DeviceDetectorService } from 'ngx-device-detector';
import { NgForOf, TitleCasePipe, UpperCasePipe } from '@angular/common';
import { ButtonIconComponent } from '../../../../shared/ui/buttons/button-icon/button-icon.component';
import { InputNumberWithButtonsComponent } from '../../../../shared/scoreboards/admin-forms/input-number-with-buttons/input-number-with-buttons.component';
import { TuiInputNumberModule, TuiToggleModule } from '@taiga-ui/kit';
import { TuiValueChangesModule } from '@taiga-ui/cdk';
import { SelectTeamInMatchComponent } from '../../../../shared/ui/select/select-team-in-match/select-team-in-match.component';
import { SearchPlayerInMatchAutocompleteComponent } from '../../../../shared/ui/search/search-player-in-match-autocomplete/search-player-in-match-autocomplete.component';
import { SelectListOfStringsComponent } from '../../../../shared/ui/select/select-list-of-strings/select-list-of-strings.component';
import { SearchListOfStringsComponent } from '../../../../shared/ui/search/search-list-of-strings/search-list-of-strings.component';
import { ActionsButtonsComponent } from '../../../../shared/ui/buttons/actions-buttons/actions-buttons.component';
import { AddButtonOnFinalTrComponent } from '../../../../shared/ui/buttons/add-button-on-final-tr/add-button-on-final-tr.component';
import {
  isCautionColor,
  isCautionColorResult,
  isMaxCautionColor,
  isMinCautionColor,
  isPlayerSecondName,
  noDefenceScorePlayerSelected,
  noDeflectPlayerSelected,
  noDroppedPlayerSelected,
  noFlagPlayerSelected,
  noInterceptedPlayerSelected,
  noKickOffPlayerSelected,
  noKickPlayerSelected,
  noPatOnePlayerSelected,
  noPuntPlayerSelected,
  noQbSelected,
  noReceiverPlayerSelected,
  noReturnPlayerSelected,
  noRunPlayerSelected,
  noSackPlayerSelected,
  noScoreOffencePlayerSelected,
} from '../football-event-isPlayerSelected-helper';
import {
  isDefenceScore,
  isDeflectResult,
  isFlagResult,
  isInterceptResult,
  isKickOffPlay,
  isKickPlay,
  isOffenceScorePossible,
  isPassCompletedPlay,
  isPassDroppedPlay,
  isPatOnePlay,
  isPuntPlay,
  isQbPlay,
  isReturnPlay,
  isRunPlay,
  isSackResult,
  isScoreTDPatTwoOffence,
  isTacklePossible,
} from '../football-event-isPlayTypeOrResult-helper';
import { FootballEventShortViewComponent } from './football-event-short-view/football-event-short-view.component';

@Component({
  selector: 'app-add-edit-football-event-table',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgForOf,
    ButtonIconComponent,
    TitleCasePipe,
    UpperCasePipe,
    InputNumberWithButtonsComponent,
    TuiInputNumberModule,
    TuiTextfieldControllerModule,
    TuiValueChangesModule,
    TuiButtonModule,
    SelectTeamInMatchComponent,
    SearchPlayerInMatchAutocompleteComponent,
    SelectListOfStringsComponent,
    SearchListOfStringsComponent,
    ActionsButtonsComponent,
    AddButtonOnFinalTrComponent,
    TuiToggleModule,
    FootballEventShortViewComponent,
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

  isMobile: boolean = false;

  eventForm!: FormGroup;
  arrayName = 'events';
  newEventCount = 0;
  expandedStates: { [key: string]: boolean } = {};
  highestId: number | null = null;

  toggle(id: number): void {
    if (this.highestId === null || id > this.highestId) {
      this.highestId = id;
    }

    // Toggle the state of the item
    const str = id.toString();
    if (this.expandedStates[str] === undefined) {
      this.expandedStates[str] = true;
    } else {
      this.expandedStates[str] = !this.expandedStates[str];
    }

    // Ensure the highest ID is always expanded
    if (this.highestId !== null) {
      this.expandedStates[this.highestId] = true;
    }
  }

  isExpanded(id: number): boolean {
    return this.expandedStates[id] || false;
  }

  handlePlayTypeChange(
    eventsArray: FormArray,
    selectedType: IFootballPlayType | undefined | null,
    index: number,
  ): void {
    onPlayTypeChange(eventsArray, selectedType, index);
    changePlayResultOnPlayTypeChange(eventsArray, index);
  }

  handlePlayResultChange(
    eventsArray: FormArray,
    selectedResult: IFootballPlayResult | undefined | null,
    index: number,
  ): void {
    onPlayResultChange(eventsArray, selectedResult, index);
  }

  handleScoreResultChange(eventsArray: FormArray, index: number): void {
    if (eventsArray && index) {
      onOffenceScore(eventsArray, index);
    }
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

      // Determine the ID of the last event and toggle its state
      if (this.events.length > 0) {
        const lastIndex = this.events.length - 1;
        this.toggle(lastIndex);
      }
    }
  }

  // RENAME MOVE TO HELPERS
  handleFieldChange(event: { index: number; step: number; key: string }): void {
    const { index, step, key } = event;
    const control = this.getFormControlByFieldKey(key, index);

    if (control && !control.disabled) {
      const value = control.value || 0;
      const newValue = incrementNumberWithArrayAndIndex(
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
      case eventDistanceOnOffenceKey:
        return this.getEventDistanceOnOffenceFormControl(
          this.eventForm,
          this.arrayName,
          index,
        );

      default:
        return null;
    }
  }

  // getPlayTypeBackgroundColor(playResult: IFootballPlayResult): string {
  //   switch (playResult) {
  //     case IFootballPlayResult.Flag:
  //       return '#D7BB69FF';
  //     case IFootballPlayResult.PassIntercepted:
  //       return '#ee88d2';
  //     default:
  //       return 'transparent';
  //   }
  // }

  constructor(
    private footballEvent: FootballEvent,
    private fb: FormBuilder,
    private dialogService: DialogService,
    private deviceService: DeviceDetectorService,
  ) {
    this.isMobile =
      this.deviceService.isMobile() || this.deviceService.isTablet();
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
      // console.log('change events');
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
    const controlEventDistanceMoved = eventDistanceMoved(index);
    const controlEventDistanceOnOffence = eventDistanceOnOffence(index);

    const controlEventTeam = eventTeam(index);
    const controlEventQb = eventQb(index);

    const controlEventDown = eventDown(index);
    const controlEventDistance = eventDistance(index);

    const controlEventHash = eventHash(index);
    const controlEventDirection = eventDirection(index);
    const controlEventPlayType = eventPlayType(index);
    const controlEventPlayResult = eventPlayResult(index);
    const controlEventScoreResult = eventScoreResult(index);
    const controlEventIsFumble = eventIsFumble(index);
    const controlEventIsFumbleRecovered = eventIsFumbleRecovered(index);

    const controlEventRunPlayer = eventRunPlayer(index);
    const controlEventReceiverPlayer = eventReceiverPlayer(index);
    const controlEventDroppedPlayer = eventDroppedPlayer(index);
    const controlEventScorePlayer = eventScorePlayer(index);
    const controlEventDefenceScorePlayer = eventDefenceScorePlayer(index);
    const controlEventKickOffPlayer = eventKickOffPlayer(index);
    const controlEventReturnPlayer = eventReturnPlayer(index);
    const controlEventPatOnePlayer = eventPatOnePlayer(index);
    const controlEventFlaggedPlayer = eventFlaggedPlayer(index);
    const controlEventKickPlayer = eventKickPlayer(index);
    const controlEventPuntPlayer = eventPuntPlayer(index);

    const controlEventTacklePlayer = eventTacklePlayer(index);
    const controlEventAssistTacklePlayer = eventAssistTacklePlayer(index);
    const controlEventDeflectedPlayer = eventDeflectedPlayer(index);
    const controlEventInterceptedPlayer = eventInterceptedPlayer(index);
    const controlEventSackPlayer = eventSackPlayer(index);
    const controlEventFumblePlayer = eventFumblePlayer(index);
    const controlEventFumbleRecoveredPlayer = eventFumbleRecoveredPlayer(index);

    // Create the form group
    const formGroup = this.fb.group({
      [controlEventId]: new FormControl(event.id),
      [controlEventNumber]: new FormControl(event.event_number),
      [controlEventQtr]: new FormControl(event.event_qtr),
      [controlEventBallOn]: new FormControl(event.ball_on),
      [controlEventDistanceMoved]: new FormControl(event.distance_moved),
      [controlEventDistanceOnOffence]: new FormControl(
        event.distance_on_offence,
      ),
      [controlEventTeam]: new FormControl(event.offense_team),
      [controlEventQb]: new FormControl(event.event_qb),
      [controlEventDown]: new FormControl(event.event_down),
      [controlEventDistance]: new FormControl(event.event_distance),
      [controlEventHash]: new FormControl(event.event_hash),
      [controlEventDirection]: new FormControl(event.play_direction),
      [controlEventPlayType]: new FormControl(event.play_type),
      [controlEventPlayResult]: new FormControl(event.play_result),
      [controlEventScoreResult]: new FormControl(event.score_result),
      [controlEventIsFumble]: new FormControl(event.is_fumble),
      [controlEventIsFumbleRecovered]: new FormControl(
        event.is_fumble_recovered,
      ),
      [controlEventRunPlayer]: new FormControl(event.run_player),
      [controlEventReceiverPlayer]: new FormControl(event.pass_received_player),
      [controlEventDroppedPlayer]: new FormControl(event.pass_dropped_player),
      [controlEventScorePlayer]: new FormControl(event.score_player),
      [controlEventDefenceScorePlayer]: new FormControl(
        event.defence_score_player,
      ),
      [controlEventKickOffPlayer]: new FormControl(event.kickoff_player),
      [controlEventReturnPlayer]: new FormControl(event.return_player),
      [controlEventPatOnePlayer]: new FormControl(event.pat_one_player),
      [controlEventFlaggedPlayer]: new FormControl(event.flagged_player),
      [controlEventKickPlayer]: new FormControl(event.kick_player),
      [controlEventPuntPlayer]: new FormControl(event.punt_player),
      [controlEventTacklePlayer]: new FormControl(event.tackle_player),
      [controlEventAssistTacklePlayer]: new FormControl(
        event.assist_tackle_player,
      ),
      [controlEventDeflectedPlayer]: new FormControl(
        event.pass_deflected_player,
      ),
      [controlEventInterceptedPlayer]: new FormControl(
        event.pass_intercepted_player,
      ),
      [controlEventSackPlayer]: new FormControl(event.sack_player),
      [controlEventFumblePlayer]: new FormControl(event.fumble_player),
      [controlEventFumbleRecoveredPlayer]: new FormControl(
        event.fumble_recovered_player,
      ),
    });

    // Disable the entire form group if event.id is not null
    if (event.id !== null && event.id !== undefined) {
      formGroup.disable();
    }

    return formGroup;
  }

  addNewEvent(): void {
    if (this.events && this.events.length > 0) {
      const lastEvent = this.events[this.events.length - 1];
      if (lastEvent && lastEvent.id === null) {
        return;
      }
      this.newEventCount++;
      const newEvent = createNewEvent(
        lastEvent,
        this.newEventCount,
        this.match,
      );
      this.events = [...this.events, newEvent];
      this.populateFormArray();
    } else {
      // console.log('create first football event');
      const newEvent = createNewEvent(null, 0, this.match);
      // console.log('firs event', newEvent);
      this.events = [newEvent];
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
          if (this.events && this.events.length > 0) {
            this.toggle(index - 1);
          }
        }
      } else if (action === 'edit') {
        // console.log('action', action);
        const updateEventData = extractEventData(this.eventsArray, index);
        // console.log('UPDATE EVENT WITH NEW DATA', updateEventData);
        if (updateEventData) {
          if (updateEventData.id) {
            this.footballEvent.updateFootballEventKeyValue(
              updateEventData.id,
              updateEventData,
            );
            if (this.events) {
              if (index && index < this.events.length) {
                this.toggle(index);
              }
            }
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
      this.homePlayersInMatch &&
      this.homePlayersInMatch.length &&
      selectedTeam.id === this.match?.teams_data?.team_b.id
    ) {
      return this.homePlayersInMatch;
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

  isPlayTypeWithIndex(
    formGroup: FormGroup | any,
    index: number,
    key: string,
    playTypeEnum: IFootballPlayType,
  ): boolean {
    const playType = getFormDataByIndexAndKey(formGroup, index, key);
    if (!playType) {
      // console.log('No play type found');
      return false;
    }
    return playType === playTypeEnum;
  }

  isPlayResultWithIndex(
    formGroup: FormGroup | any,
    index: number,
    key: string,
    playResultEnum: IFootballPlayResult,
  ): boolean {
    const playResult = getFormDataByIndexAndKey(formGroup, index, key);
    if (!playResult) {
      // console.log('No play result found');
      return false;
    }
    return playResult === playResultEnum;
  }

  isScoreResultWithIndex(
    formGroup: FormGroup | any,
    index: number,
    key: string,
    scoreResultEnum: IFootballScoreResult,
  ): boolean {
    const scoreResult = getFormDataByIndexAndKey(formGroup, index, key);
    if (!scoreResult) {
      // console.log('No score result found');
      return false;
    }
    return scoreResult === scoreResultEnum;
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
  protected readonly getEventScoreResultFormControl =
    getEventScoreResultFormControl;
  protected readonly getEventScoreResult = getEventScoreResult;
  protected readonly getEventDirectionFormControl =
    getEventDirectionFormControl;
  protected readonly eventDirectionOptions = eventDirectionOptions;
  protected readonly getEventIsFumbleFormControl = getEventIsFumbleFormControl;
  protected readonly getEventIsFumbleRecoveredFormControl =
    getEventIsFumbleRecoveredFormControl;
  protected readonly getEventIsFumble = getEventIsFumble;
  protected readonly getEventFumblePlayerFormControl =
    getEventFumblePlayerFormControl;
  protected readonly getEventFumblePlayer = getEventFumblePlayer;
  protected readonly getEventFumbleRecoveredPlayerFormControl =
    getEventFumbleRecoveredPlayerFormControl;
  protected readonly getEventFumbleRecoveredPlayer =
    getEventFumbleRecoveredPlayer;
  protected readonly getEventIsFumbleRecovered = getEventIsFumbleRecovered;
  protected readonly getEventScorePlayerFormControl =
    getEventScorePlayerFormControl;
  protected readonly getEventScorePlayer = getEventScorePlayer;
  protected readonly getEventDefenceScorePlayerFormControl =
    getEventDefenceScorePlayerFormControl;
  protected readonly IFootballScoreResult = IFootballScoreResult;
  protected readonly getEventDefenceScorePlayer = getEventDefenceScorePlayer;
  protected readonly getEventAssistTacklePlayerFormControl =
    getEventAssistTacklePlayerFormControl;
  protected readonly getEventAssistTacklePlayer = getEventAssistTacklePlayer;
  protected readonly getEventKickOffPlayerFormControl =
    getEventKickOffPlayerFormControl;
  protected readonly getEventKickOffPlayer = getEventKickOffPlayer;
  protected readonly getEventPatOnePlayerFormControl =
    getEventPatOnePlayerFormControl;
  protected readonly getEventPatOnePlayer = getEventPatOnePlayer;
  protected readonly getEventReturnPlayerFormControl =
    getEventReturnPlayerFormControl;
  protected readonly getEventReturnPlayer = getEventReturnPlayer;
  protected readonly getEventFlaggedPlayerFormControl =
    getEventFlaggedPlayerFormControl;
  protected readonly getEventFlaggedPlayer = getEventFlaggedPlayer;
  protected readonly incrementOnBall = incrementOnBall;
  protected readonly getBallOn = getBallOn;
  protected readonly eventScoreResultKey = eventScoreResultKey;
  protected readonly getEventDistanceMoved = getEventDistanceMoved;
  protected readonly getEventPlayResult = getEventPlayResult;
  protected readonly tuiAppFlat = TuiAppearance.Flat;
  protected readonly hexToRgba = hexToRgba;
  protected readonly getEventDistanceOnOffenceFormControl =
    getEventDistanceOnOffenceFormControl;
  protected readonly eventDistanceOnOffenceKey = eventDistanceOnOffenceKey;
  protected readonly getEventDown = getEventDown;
  protected readonly getEventDistance = getEventDistance;
  protected readonly filterPlayResultsByType = filterPlayResultsByType;
  protected readonly getEventPlayType = getEventPlayType;
  protected readonly eventPlayTypeOptions = eventPlayTypeOptions;
  protected readonly filterScoreResultsByType = filterScoreResultsByType;
  protected readonly isRunPlayerSelected = noRunPlayerSelected;
  protected readonly isReceiverPlayerSelected = noReceiverPlayerSelected;
  protected readonly isPatOnePlayerSelected = noPatOnePlayerSelected;
  protected readonly isScorePlayerSelected = noScoreOffencePlayerSelected;
  protected readonly isDefenceScorePlayerSelected =
    noDefenceScorePlayerSelected;
  protected readonly isCautionColor = isCautionColor;
  protected readonly isMaxCautionColor = isMaxCautionColor;
  protected readonly isQb = noQbSelected;
  protected readonly isDroppedPlayerSelected = noDroppedPlayerSelected;
  protected readonly isKickPlayerSelected = noKickPlayerSelected;
  protected readonly isKickOffPlayerSelected = noKickOffPlayerSelected;
  protected readonly isPuntPlayerSelected = noPuntPlayerSelected;
  protected readonly isReturnPlayerSelected = noReturnPlayerSelected;
  protected readonly isDeflectPlayerSelected = noDeflectPlayerSelected;
  protected readonly isInterceptedPlayerSelected = noInterceptedPlayerSelected;
  protected readonly isSackPlayerSelected = noSackPlayerSelected;
  protected readonly isFlagPlayerSelected = noFlagPlayerSelected;
  protected readonly getEventQb = getEventQb;
  protected readonly isCautionColorResult = isCautionColorResult;
  protected readonly isPlayer = isPlayerSecondName;
  protected readonly noScorePlayerSelected = noScoreOffencePlayerSelected;
  protected readonly isQbPlay = isQbPlay;
  protected readonly noQbSelected = noQbSelected;
  protected readonly isRunPlay = isRunPlay;
  protected readonly noRunPlayerSelected = noRunPlayerSelected;
  protected readonly isMinCautionColor = isMinCautionColor;
  protected readonly isPassCompletedPlay = isPassCompletedPlay;
  protected readonly noReceiverPlayerSelected = noReceiverPlayerSelected;
  protected readonly isPassDroppedPlay = isPassDroppedPlay;
  protected readonly isScoreTDPatTwoOffence = isScoreTDPatTwoOffence;
  protected readonly noPatOnePlayerSelected = noPatOnePlayerSelected;
  protected readonly isPatOnePlay = isPatOnePlay;
  protected readonly noReturnPlayerSelected = noReturnPlayerSelected;
  protected readonly isReturnPlay = isReturnPlay;
  protected readonly isPuntPlay = isPuntPlay;
  protected readonly noPuntPlayerSelected = noPuntPlayerSelected;
  protected readonly isFlagResult = isFlagResult;
  protected readonly noFlagPlayerSelected = noFlagPlayerSelected;
  protected readonly isSackResult = isSackResult;
  protected readonly noSackPlayerSelected = noSackPlayerSelected;
  protected readonly noInterceptedPlayerSelected = noInterceptedPlayerSelected;
  protected readonly isInterceptResult = isInterceptResult;
  protected readonly isDeflectResult = isDeflectResult;
  protected readonly noDeflectPlayerSelected = noDeflectPlayerSelected;
  protected readonly isKickPlay = isKickPlay;
  protected readonly noKickPlayerSelected = noKickPlayerSelected;
  protected readonly isKickOffPlay = isKickOffPlay;
  protected readonly noKickOffPlayerSelected = noKickOffPlayerSelected;
  protected readonly isDefenceScore = isDefenceScore;
  protected readonly noDefenceScorePlayerSelected =
    noDefenceScorePlayerSelected;
  protected readonly isTacklePossible = isTacklePossible;
  protected readonly isScorePossible = isOffenceScorePossible;
}
