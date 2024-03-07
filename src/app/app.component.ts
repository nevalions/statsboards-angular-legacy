import {
  TuiRootModule,
  TuiDialogModule,
  TuiAlertModule,
  TuiLinkModule,
  TuiLoaderModule,
  TuiButtonModule,
} from '@taiga-ui/core';
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';

import { HomeComponent } from './components/home/home.component';
import { TuiBreadcrumbsModule } from '@taiga-ui/kit';

import { Observable } from 'rxjs';
import { Breadcrumb } from './type/base.type';
import { Store } from '@ngrx/store';
import { AppState } from './store/appstate';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    TuiButtonModule,
    RouterLink,
    RouterOutlet,
    CommonModule,
    HomeComponent,
    HeaderComponent,
    TuiRootModule,
    TuiDialogModule,
    TuiAlertModule,
    TuiBreadcrumbsModule,
    TuiLinkModule,
    TuiLoaderModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.less',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  title = 'StatsBoards';
  breadcrumbs$: Observable<Breadcrumb[]>;

  constructor(private store: Store<AppState>) {
    this.breadcrumbs$ = this.store.select(
      (state) => state.breadcrumb.breadcrumbs,
    );
  }
}
