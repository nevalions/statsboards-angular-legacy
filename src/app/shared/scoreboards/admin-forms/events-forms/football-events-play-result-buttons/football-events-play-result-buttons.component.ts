import { Component, Input } from '@angular/core';
import { ToggleButtonComponent } from '../../../../ui/buttons/toggle-button/toggle-button.component';
import { FormArray, FormControl } from '@angular/forms';
import { IFootballPlayResult } from '../../../../../type/football-event.type';
import {
  getEventPlayResult,
  toggleFootballEnumValue,
} from '../../../../../components/match-event/football-event/football-event-helpers';
import {
  isPassPlay,
  isRunPlay,
} from '../../../../../components/match-event/football-event/football-event-isPlayTypeOrResult-helper';

@Component({
  selector: 'app-football-events-play-result-buttons',
  standalone: true,
  imports: [ToggleButtonComponent],
  templateUrl: './football-events-play-result-buttons.component.html',
  styleUrl: './football-events-play-result-buttons.component.less',
})
export class FootballEventsPlayResultButtonsComponent {
  @Input() eventsArray: FormArray | null | undefined = null;
  @Input() control: FormControl | null | undefined = null;
  @Input() i: number | null | undefined = null;
  protected readonly IFootballPlayResult = IFootballPlayResult;
  protected readonly getEventPlayResult = getEventPlayResult;
  protected readonly toggleFootballEnumValue = toggleFootballEnumValue;
  protected readonly isRunPlay = isRunPlay;
  protected readonly isPassPlay = isPassPlay;
}
