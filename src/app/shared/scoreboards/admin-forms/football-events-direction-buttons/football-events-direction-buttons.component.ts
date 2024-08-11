import { Component, Input } from '@angular/core';
import { IEventDirection } from '../../../../type/football-event.type';
import {
  getEventDirection,
  toggleFootballEnumValue,
} from '../../../../components/match-event/football-event/football-event-helpers';
import { ToggleButtonComponent } from '../../../ui/buttons/toggle-button/toggle-button.component';
import { FormArray, FormControl } from '@angular/forms';

@Component({
  selector: 'app-football-events-direction-buttons',
  standalone: true,
  imports: [ToggleButtonComponent],
  templateUrl: './football-events-direction-buttons.component.html',
  styleUrl: './football-events-direction-buttons.component.less',
})
export class FootballEventsDirectionButtonsComponent {
  @Input() eventsArray: FormArray | null | undefined = null;
  @Input() control: FormControl | null | undefined = null;
  @Input() i: number | null | undefined = null;

  protected readonly IEventDirection = IEventDirection;
  protected readonly toggleFootballEnumValue = toggleFootballEnumValue;
  protected readonly getEventDirection = getEventDirection;
}
