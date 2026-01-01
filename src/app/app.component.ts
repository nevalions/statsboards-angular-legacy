import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';

import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.less',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  // title = 'StatsBoards';
  // breadcrumbs$: Observable<Breadcrumb[]>;
  //
  // constructor(private store: Store<AppState>) {
  //   this.breadcrumbs$ = this.store.select(
  //     (state) => state.breadcrumb.breadcrumbs,
  //   );
  // }
}
