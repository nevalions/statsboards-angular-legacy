import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs';
import { IFootballEvent } from '../../../../type/football-event.type';
import { ToggleVisibleButtonComponent } from '../../../ui/buttons/toggle-visible-button/toggle-visible-button.component';
import { AsyncPipe, NgIf } from '@angular/common';
import { IPlayerInMatchFullData } from '../../../../type/player.type';
import { AddEditFootballEventTableComponent } from '../../../../components/match-event/football-event/add-edit-football-event-table/add-edit-football-event-table.component';
import { IMatchFullDataWithScoreboard } from '../../../../type/match.type';

@Component({
  selector: 'app-events-forms',
  standalone: true,
  imports: [
    ToggleVisibleButtonComponent,
    AsyncPipe,
    NgIf,
    AddEditFootballEventTableComponent,
  ],
  templateUrl: './events-forms.component.html',
  styleUrl: './events-forms.component.less',
})
export class EventsFormsComponent implements OnChanges {
  @Input() data: IMatchFullDataWithScoreboard | undefined;

  @Input() eventsFormsVisible$!: Observable<boolean>;
  @Input() events: IFootballEvent[] | null = [];
  @Input() disabled: boolean = false;

  @Input() homePlayersInMatch: IPlayerInMatchFullData[] | null = [];
  @Input() awayPlayersInMatch: IPlayerInMatchFullData[] | null = [];

  constructor() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['events']) {
    }
    if (changes['disabled']) {
    }
  }
}
