import { TuiAppearance, TuiLoader, TuiSurface, TuiTitle } from "@taiga-ui/core";
import { Component, Input, inject } from '@angular/core';
import { AsyncPipe, DatePipe, TitleCasePipe } from '@angular/common';
import { IMatchWithFullData } from '../../../../type/match.type';
import { Observable, of } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { TuiCardLarge } from "@taiga-ui/layout";

@Component({
  selector: 'app-list-of-matches',
  standalone: true,
  imports: [
    AsyncPipe,
    TuiLoader,
    DatePipe,
    TitleCasePipe,
    TuiCardLarge,
    TuiTitle,
    TuiSurface,
    TuiAppearance,
    TitleCasePipe,
    TuiLoader,
  ],
  templateUrl: './list-of-matches.component.html',
  styleUrl: './list-of-matches.component.less',
})
export class ListOfMatchesComponent {
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  @Input() data$: Observable<IMatchWithFullData[]> = of([]);
  @Input() emptyMessage: string = 'No data available';

  navigateToMatchItem(item: IMatchWithFullData): void {
    this.router.navigate(['match', item.id], { relativeTo: this.route });
  }
}
