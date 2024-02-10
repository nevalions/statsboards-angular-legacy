import {
  TuiRootModule,
  TuiDialogModule,
  TuiAlertModule,
  TuiLinkModule,
  TuiLoaderModule,
} from '@taiga-ui/core';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  ActivationEnd,
  NavigationEnd,
  Router,
  RouterLink,
  RouterOutlet,
} from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { SportComponent } from './components/sport/sport.component';
import { SeasonComponent } from './components/season/season.component';
import { SidebarComponent } from './shared/ui/sidebar/sidebar.component';
import { SportDropdownComponent } from './components/sport/sport-dropdown/sport-dropdown.component';
import { SeasonDropdownComponent } from './components/season/season-dropdown/season-dropdown.component';
import { SportNavComponent } from './components/sport/sport-nav/sport-nav.component';
import { HomeComponent } from './components/home/home.component';
import { TuiBreadcrumbsModule } from '@taiga-ui/kit';
import {
  async,
  filter,
  map,
  mergeMap,
  Observable,
  of,
  Subject,
  takeUntil,
} from 'rxjs';
import { Breadcrumb, BreadcrumbService } from './services/breadcrub.service';
import { BreadcrumbGuard } from './guard/breadcrumb.guard';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterLink,
    RouterOutlet,
    CommonModule,
    HomeComponent,
    HeaderComponent,
    SportComponent,
    SeasonComponent,
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
  // providers: [BreadcrumbGuard],
})
export class AppComponent {
  title = 'StatsBoards';
  // private ngUnsubscribe = new Subject<void>();
  // breadcrumbs$: Observable<Breadcrumb[]> = this.breadcrumbService.breadcrumbs$;
  //
  // constructor(
  //   private breadcrumbService: BreadcrumbService,
  //   private activatedRoute: ActivatedRoute,
  //   private router: Router,
  // ) {}
  //
  // ngOnInit() {
  //   this.router.events
  //     .pipe(
  //       filter((event) => event instanceof NavigationEnd),
  //       map(() => this.activatedRoute),
  //       map((route) => {
  //         while (route.firstChild) {
  //           route = route.firstChild;
  //         }
  //         return route;
  //       }),
  //       filter((route) => route.outlet === 'primary'),
  //       mergeMap((route) => route.data),
  //     )
  //     .subscribe((event) => {
  //       console.log('Breadcrumbs from data: ', [event['breadcrumb']]);
  //
  //       // Get current breadcrumbs
  //       const currentBreadcrumbs = this.breadcrumbService.getBreadcrumbs();
  //
  //       // Append new breadcrumb
  //       currentBreadcrumbs.push(event['breadcrumb']);
  //
  //       // Set modified breadcrumbs
  //       this.breadcrumbService.setBreadcrumbs(currentBreadcrumbs);
  //     });
  // }
  //
  // ngOnDestroy() {
  //   this.ngUnsubscribe.next();
  //   this.ngUnsubscribe.complete();
  // }
  //
  // trackByFunction(index: number, item: Breadcrumb) {
  //   return item.routerLink; // unique id corresponding to the item
  // }
}

// export class AppComponent implements OnInit, OnDestroy {
//   private ngUnsubscribe = new Subject<void>();
//
//   private breadcrumbService = inject(BreadcrumbService);
//   title = 'StatsBoards';
//
//   breadcrumbs$ = this.breadcrumbService.breadcrumbs$;
//
//   constructor(
//     private router: Router,
//     private activatedRoute: ActivatedRoute,
//   ) {}
//
//   ngOnInit() {
//     this.router.events
//       .pipe(
//         filter((event) => event instanceof NavigationEnd),
//         takeUntil(this.ngUnsubscribe),
//       )
//       .subscribe(() => {
//         const snapshots = this.getAllSnapshots(this.activatedRoute.snapshot);
//         const breadcrumbs: Breadcrumb[] = [];
//         console.log('Breadcrumbs: ', breadcrumbs);
//
//         snapshots.forEach((snapshot) => {
//           breadcrumbs.push(...this.getBreadcrumbs(snapshot));
//         });
//
//         this.breadcrumbService.setBreadcrumbs(breadcrumbs);
//       });
//   }
//
//   private getBreadcrumbs(
//     route: ActivatedRouteSnapshot,
//     url: string = '',
//     breadcrumbs: Breadcrumb[] = [],
//   ): Breadcrumb[] {
//     let path = route.routeConfig?.path || '';
//     let caption = route.routeConfig?.data?.['breadcrumbs']?.[0]?.caption ?? '';
//
//     // Check if the route has params (like `:id`) and replace the route param in the path
//     if (path.includes(':id') && route.params && route.params['id']) {
//       path = path.replace(':id', route.params['id']);
//     }
//
//     const nextUrl = `${url}/${path}`;
//
//     const breadcrumb: Breadcrumb = {
//       caption: caption,
//       routerLink: nextUrl,
//     };
//
//     // Always include the breadcrumb, whether caption was provided or not
//     const newBreadcrumbs = [...breadcrumbs, breadcrumb];
//
//     if (route.firstChild) {
//       return this.getBreadcrumbs(route.firstChild, nextUrl, newBreadcrumbs);
//     }
//
//     return newBreadcrumbs;
//   }
//
//   private getAllSnapshots(
//     routeSnapshot: ActivatedRouteSnapshot,
//   ): ActivatedRouteSnapshot[] {
//     if (routeSnapshot.parent !== null) {
//       const snapshots = this.getAllSnapshots(routeSnapshot.parent);
//       return [...snapshots, routeSnapshot];
//     } else {
//       return [routeSnapshot];
//     }
//   }
//
//   ngOnDestroy() {
//     this.ngUnsubscribe.next();
//     this.ngUnsubscribe.complete();
//   }
//
//   trackByFunction(index: number, item: Breadcrumb) {
//     return item.routerLink; // unique id corresponding to the item
//   }
// }
