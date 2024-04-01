import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Breadcrumb } from '../../type/base.type';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/appstate';
import { AsyncPipe } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { RouterLink, RouterOutlet } from '@angular/router';
import {
  TuiBreadcrumbsModule,
  tuiBreadcrumbsOptionsProvider,
} from '@taiga-ui/kit';
import {
  TuiButtonModule,
  TuiDataListModule,
  TuiHostedDropdownModule,
  TuiLinkModule,
  TuiLoaderModule,
  TuiRootModule,
} from '@taiga-ui/core';
import { TuiRepeatTimesModule } from '@taiga-ui/cdk';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    AsyncPipe,
    HeaderComponent,
    RouterOutlet,
    TuiBreadcrumbsModule,
    TuiLinkModule,
    TuiLoaderModule,
    TuiRootModule,
    RouterLink,
    TuiRepeatTimesModule,
    TuiHostedDropdownModule,
    TuiDataListModule,
    TuiButtonModule,
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    tuiBreadcrumbsOptionsProvider({
      icon: 'tuiIconArrowRight',
      mode: null,
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
