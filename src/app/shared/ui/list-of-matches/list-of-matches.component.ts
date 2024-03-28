import { Component, Input } from '@angular/core';
import { AsyncPipe, DatePipe, TitleCasePipe } from '@angular/common';
import { IMatchWithFullData } from '../../../type/match.type';
import { TuiLoaderModule } from '@taiga-ui/core';
import { TuiIslandModule } from '@taiga-ui/kit';
import { Observable, of } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-list-of-matches',
  standalone: true,
  imports: [
    AsyncPipe,
    TuiLoaderModule,
    TuiIslandModule,
    DatePipe,
    TitleCasePipe,
  ],
  templateUrl: './list-of-matches.component.html',
  styleUrl: './list-of-matches.component.less',
})
export class ListOfMatchesComponent {
  @Input() data$: Observable<IMatchWithFullData[]> = of([]);
  @Input() emptyMessage: string = 'No data available';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  navigateToMatchItem(item: IMatchWithFullData): void {
    this.router.navigate(['match', item.id], { relativeTo: this.route });
  }
}
