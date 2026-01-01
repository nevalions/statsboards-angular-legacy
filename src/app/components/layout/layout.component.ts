import { TuiRepeatTimes, TuiItem } from '@taiga-ui/cdk';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Breadcrumb } from '../../type/base.type';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/appstate';
import { AsyncPipe } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { RouterOutlet } from '@angular/router';
import { tuiBreadcrumbsOptionsProvider, TuiBreadcrumbs } from '@taiga-ui/kit';
import {
  TuiRoot,
  TuiDataList,
  TuiLoader,
  TuiDropdown,
  TuiLink,
} from '@taiga-ui/core';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    AsyncPipe,
    HeaderComponent,
    RouterOutlet,
    TuiBreadcrumbs,
    TuiItem,
    TuiLink,
    TuiLoader,
    TuiRoot,
    TuiRepeatTimes,
    TuiDropdown,
    TuiDataList,
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    tuiBreadcrumbsOptionsProvider({
      icon: '@tui.arrow-right',
      size: 'l',
    }),
  ],
})
export class LayoutComponent {
  title = 'StatsBoards';
  breadcrumbs$: Observable<Breadcrumb[]>;
  maxBreads: number = 2;

  constructor(private store: Store<AppState>) {
    this.breadcrumbs$ = this.store.select(
      (state) => state.breadcrumb.breadcrumbs,
    );
  }
}
