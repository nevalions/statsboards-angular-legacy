import { Component, Input } from '@angular/core';
import { AsyncPipe, TitleCasePipe, UpperCasePipe } from '@angular/common';
import { TuiAvatarModule, TuiIslandModule } from '@taiga-ui/kit';
import { TuiLoaderModule, TuiSizeL, TuiSizeS } from '@taiga-ui/core';
import { ITournament } from '../../../type/tournament.type';
import { ActivatedRoute, Router } from '@angular/router';
import { getTitleCase } from '../../../base/helpers';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-island-list-of-tournaments',
  standalone: true,
  imports: [
    AsyncPipe,
    TuiIslandModule,
    TuiLoaderModule,
    TitleCasePipe,
    UpperCasePipe,
    TuiAvatarModule,
  ],
  templateUrl: './island-list-of-tournaments.component.html',
  styleUrl: './island-list-of-tournaments.component.less',
})
export class IslandListOfTournamentsComponent {
  @Input() emptyMessage: string = 'No data available';
  @Input() titleProperty: keyof ITournament = 'title';
  @Input() paragraphProperty: keyof ITournament = 'description';
  @Input() avatarUrl: keyof ITournament = 'title';

  @Input() data: ITournament[] = [];
  @Input() _size: TuiSizeL | TuiSizeS = 'l';
  @Input() hoverable: boolean = true;

  backendUrl = environment.backendUrl;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  navigateToTournamentItem(item: ITournament): void {
    let currentUrl = this.router.url.split('/');
    if (currentUrl[currentUrl.length - 1] === 'tournaments') {
      currentUrl.pop(); // Removes 'tournaments'
    }
    currentUrl.push('tournament', item.id!.toString());
    this.router.navigate(currentUrl);
  }

  protected readonly getTitleCase = getTitleCase;
}
