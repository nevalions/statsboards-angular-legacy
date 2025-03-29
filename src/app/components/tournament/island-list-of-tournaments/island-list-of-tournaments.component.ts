import { TuiAvatar } from "@taiga-ui/kit";
import { Component, Input } from '@angular/core';
import { TuiTitle, TuiSurface, TuiAppearance } from '@taiga-ui/core';
import { TuiCardLarge, TuiCell, TuiHeader } from '@taiga-ui/layout';

import { ITournament } from '../../../type/tournament.type';
import { Router } from '@angular/router';
import { getTitleCase } from '../../../base/helpers';
import { environment } from '../../../../environments/environment';
import { urlWithProtocol } from "../../../base/constants";
import { UpperCasePipe } from "@angular/common";

@Component({
  selector: 'app-island-list-of-tournaments',
  standalone: true,
  imports: [
    TuiCardLarge,
    TuiCell,
    TuiTitle,
    TuiSurface,
    TuiAppearance,
    TuiAvatar,
    UpperCasePipe,
  ],
  templateUrl: './island-list-of-tournaments.component.html',
  styleUrl: './island-list-of-tournaments.component.less',
})
export class IslandListOfTournamentsComponent {
  @Input() data: ITournament[] = [];

  backendUrl = environment.backendUrl;

  constructor(
    private router: Router,
  ) { }

  navigateToTournamentItem(item: ITournament): void {
    let currentUrl = this.router.url.split('/');
    if (currentUrl[currentUrl.length - 1] === 'tournaments') {
      currentUrl.pop(); // Removes 'tournaments'
    }
    currentUrl.push('tournament', item.id!.toString());
    this.router.navigate(currentUrl);
  }

  protected readonly url = urlWithProtocol;
  protected readonly getTitleCase = getTitleCase;
}
