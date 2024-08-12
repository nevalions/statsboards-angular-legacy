import { Component, Input } from '@angular/core';
import { ToggleButtonComponent } from '../../../../ui/buttons/toggle-button/toggle-button.component';
import { FormArray, FormControl } from '@angular/forms';
import { IFootballPlayType } from '../../../../../type/football-event.type';
import {
  getEventPlayType,
  toggleFootballEnumValue,
} from '../../../../../components/match-event/football-event/football-event-helpers';
import {
  isFourthDown,
  isPreviousScoreTdOrDefenceTd,
} from '../../../../../components/match-event/football-event/football-event-isPlayTypeOrResult-helper';

@Component({
  selector: 'app-football-events-play-type-buttons',
  standalone: true,
  imports: [ToggleButtonComponent],
  templateUrl: './football-events-play-type-buttons.component.html',
  styleUrl: './football-events-play-type-buttons.component.less',
})
export class FootballEventsPlayTypeButtonsComponent {
  @Input() eventsArray: FormArray | null | undefined = null;
  @Input() control: FormControl | null | undefined = null;
  @Input() i: number | null | undefined = null;
  protected readonly IFootballPlayType = IFootballPlayType;
  protected readonly getEventPlayType = getEventPlayType;
  protected readonly toggleFootballEnumValue = toggleFootballEnumValue;
  protected readonly isPreviousScoreTdOrDefenceTd =
    isPreviousScoreTdOrDefenceTd;
  protected readonly isFourthDown = isFourthDown;
}
