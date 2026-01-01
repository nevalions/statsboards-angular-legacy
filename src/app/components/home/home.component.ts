import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less'],
  standalone: true,
})
export class HomeComponent {
  title = 'StatsBoards';

  // breadcrumbs$: Observable<Breadcrumb[]>;
  //
  // constructor(private store: Store) {
  //   this.breadcrumbs$ = this.store.select(selectBreadcrumbs);
  // }
}
