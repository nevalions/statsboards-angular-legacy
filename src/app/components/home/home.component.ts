import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Breadcrumb } from '../../type/base.type';
import { Store } from '@ngrx/store';

import { RouterLink } from '@angular/router';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less'],
  standalone: true,
  imports: [RouterLink, AsyncPipe],
})
export class HomeComponent {
  title = 'StatsBoards';

  // breadcrumbs$: Observable<Breadcrumb[]>;
  //
  // constructor(private store: Store) {
  //   this.breadcrumbs$ = this.store.select(selectBreadcrumbs);
  // }
}
