import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs';
import { IFootballEvent } from '../../../../type/football-event.type';
import { ToggleVisibleButtonComponent } from '../../../ui/buttons/toggle-visible-button/toggle-visible-button.component';
import { AsyncPipe, NgIf } from '@angular/common';
import { IPlayerInMatchFullData } from '../../../../type/player.type';

@Component({
  selector: 'app-events-forms',
  standalone: true,
  imports: [ToggleVisibleButtonComponent, AsyncPipe, NgIf],
  templateUrl: './events-forms.component.html',
  styleUrl: './events-forms.component.less',
})
export class EventsFormsComponent implements OnChanges {
  @Input() eventsFormsVisible$!: Observable<boolean>;
  @Input() events: IFootballEvent[] | null = [];
  @Input() disabled: boolean = false;

  @Input() homePlayersInMatch: IPlayerInMatchFullData[] | null = [];
  @Input() awayPlayersInMatch: IPlayerInMatchFullData[] | null = [];

  constructor() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data']) {
    }
    if (changes['disabled']) {
    }
  }
}
