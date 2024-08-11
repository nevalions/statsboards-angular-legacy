import { Component, Input } from '@angular/core';
import { FormArray, FormControl } from '@angular/forms';
import {
  getEventHash,
  toggleFootballEnumValue,
} from '../../../../components/match-event/football-event/football-event-helpers';
import { IEventHash } from '../../../../type/football-event.type';
import { ToggleButtonComponent } from '../../../ui/buttons/toggle-button/toggle-button.component';

@Component({
  selector: 'app-football-events-hash-buttons',
  standalone: true,
  imports: [ToggleButtonComponent],
  templateUrl: './football-events-hash-buttons.component.html',
  styleUrl: './football-events-hash-buttons.component.less',
})
export class FootballEventsHashButtonsComponent {
  @Input() eventsArray: FormArray | null | undefined = null;
  @Input() control: FormControl | null | undefined = null;
  @Input() i: number | null | undefined = null;
  protected readonly toggleFootballEnumValue = toggleFootballEnumValue;
  protected readonly IEventHash = IEventHash;
  protected readonly getEventHash = getEventHash;
}
