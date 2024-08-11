import { Component, Input } from '@angular/core';
import { FormArray, FormControl } from '@angular/forms';
import { IEventStrongSide } from '../../../../type/football-event.type';
import {
  getEventStrongSide,
  toggleFootballEnumValue,
} from '../../../../components/match-event/football-event/football-event-helpers';
import { ToggleButtonComponent } from '../../../ui/buttons/toggle-button/toggle-button.component';

@Component({
  selector: 'app-football-events-strong-side-buttons',
  standalone: true,
  imports: [ToggleButtonComponent],
  templateUrl: './football-events-strong-side-buttons.component.html',
  styleUrl: './football-events-strong-side-buttons.component.less',
})
export class FootballEventsStrongSideButtonsComponent {
  @Input() eventsArray: FormArray | null | undefined = null;
  @Input() control: FormControl | null | undefined = null;
  @Input() i: number | null | undefined = null;
  protected readonly IEventStrongSide = IEventStrongSide;
  protected readonly getEventStrongSide = getEventStrongSide;
  protected readonly toggleFootballEnumValue = toggleFootballEnumValue;
}
