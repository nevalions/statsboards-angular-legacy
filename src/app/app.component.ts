import { TuiItem } from "@taiga-ui/cdk";
import { TuiBreadcrumbs } from "@taiga-ui/kit";
import { TuiRoot, TuiAlert, TuiLoader, TuiLink, TuiDialog, TuiButton } from '@taiga-ui/core';
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';

import { RouterLink, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';

import { HomeComponent } from './components/home/home.component';
import { Observable } from 'rxjs';
import { Breadcrumb } from './type/base.type';
import { Store } from '@ngrx/store';
import { AppState } from './store/appstate';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    TuiButton,
    RouterLink,
    RouterOutlet,
    HomeComponent,
    HeaderComponent,
    TuiRoot,
    TuiDialog,
    TuiAlert,
    TuiBreadcrumbs,
    TuiItem,
    TuiLink,
    TuiLoader
],
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
