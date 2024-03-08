import { Component, Input } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { TuiIslandModule } from '@taiga-ui/kit';
import { TuiLoaderModule, TuiSizeL, TuiSizeS } from '@taiga-ui/core';
import { Observable, of } from 'rxjs';
import { ITournament } from '../../../type/tournament.type';
import { IMatchWithFullData } from '../../../type/match.type';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-island-list-of-tournaments',
  standalone: true,
  imports: [AsyncPipe, TuiIslandModule, TuiLoaderModule],
  templateUrl: './island-list-of-tournaments.component.html',
  styleUrl: './island-list-of-tournaments.component.less',
})
export class IslandListOfTournamentsComponent {
  @Input() emptyMessage: string = 'No data available';
  @Input() formatPath: (item: ITournament) => string = () => '';
  @Input() titleProperty: keyof ITournament = 'title';
  @Input() paragraphProperty: keyof ITournament = 'description';

  // Initialize with an empty array
  @Input() data: ITournament[] = [];
  @Input() _size: TuiSizeL | TuiSizeS = 'l';
  @Input() hoverable: boolean = true;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  navigateToTournamentItem(item: ITournament): void {
    let sportId = this.route.snapshot.params['sport_id'];
    let seasonId = this.route.snapshot.params['season_id'];

    console.log(sportId, seasonId);

    this.router.navigate([
      '/sport',
      sportId,
      'season',
      seasonId,
      'tournament',
      item.id,
    ]);
  }
}
