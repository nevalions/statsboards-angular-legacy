import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Breadcrumb } from '../../type/base.type';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/appstate';
import { AsyncPipe } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { RouterLink, RouterOutlet } from '@angular/router';
import { TuiBreadcrumbsModule } from '@taiga-ui/kit';
import { TuiLinkModule, TuiLoaderModule, TuiRootModule } from '@taiga-ui/core';

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
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.less',
})
export class LayoutComponent {
  title = 'StatsBoards';
  breadcrumbs$: Observable<Breadcrumb[]>;

  constructor(private store: Store<AppState>) {
    this.breadcrumbs$ = this.store.select(
      (state) => state.breadcrumb.breadcrumbs,
    );
  }
}
