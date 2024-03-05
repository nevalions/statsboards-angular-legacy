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
import { Location, CommonModule } from '@angular/common';
import {
  ActivatedRoute,
  NavigationEnd,
  Params,
  Router,
  RouterLink,
  RouterOutlet,
} from '@angular/router';
import { HeaderComponent } from './components/header/header.component';

import { HomeComponent } from './components/home/home.component';
import { TuiBreadcrumbsModule } from '@taiga-ui/kit';
import { tuiIconArrowLeftLarge } from '@taiga-ui/icons';
import {
  filter,
  map,
  mergeMap,
  Observable,
  Subscription,
  take,
  withLatestFrom,
} from 'rxjs';
import { Breadcrumb } from './type/base.type';
import { Store } from '@ngrx/store';
import { AppState } from './store/appstate';
import { BreadcrumbState } from './store/breadcrumbs.reducers';
import { breadcrumbActions } from './store/breadcrumbs.actions';
import { switchMap, tap } from 'rxjs/operators';

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

  // showBackButton: boolean = false;

  // constructor(
  //   private store: Store<AppState>,
  //   // private location: Location,
  //   private router: Router,
  //   private activatedRoute: ActivatedRoute,
  // ) {
  //   this.breadcrumbs$ = this.store.select(
  //     (state) => state.breadcrumb.breadcrumbs,
  //   );
  //
  //   this.router.events
  //     .pipe(
  //       filter((event) => {
  //         // console.log('Router Event: ', event);
  //         return event instanceof NavigationEnd;
  //       }),
  //       map(() => {
  //         let route = this.activatedRoute;
  //         while (route.firstChild) route = route.firstChild;
  //
  //         // console.log('Current Route: ', route);
  //
  //         const params = this.getParams(route);
  //         const sportsId = params['sport_id'];
  //         const seasonId = params['season_id'];
  //         const tournamentId = params['tournament_id'];
  //         const matchId = params['match_id'];
  //
  //         if (route.snapshot.data['breadcrumb']) {
  //           let routerLink = route.snapshot.data['breadcrumb']['routerLink'];
  //           console.log('Original RouterLink: ', routerLink); // Log original router link
  //
  //           if (routerLink.includes(':sport_id')) {
  //             routerLink = routerLink.replace(':sport_id', sportsId);
  //           }
  //           if (routerLink.includes(':season_id')) {
  //             routerLink = routerLink.replace(':season_id', seasonId);
  //           }
  //           if (routerLink.includes(':tournament_id')) {
  //             routerLink = routerLink.replace(':tournament_id', tournamentId);
  //           }
  //           if (routerLink.includes(':match_id')) {
  //             routerLink = routerLink.replace(':match_id', matchId);
  //           }
  //
  //           console.log('Modified RouterLink: ', routerLink); // Log modified router link
  //
  //           route.snapshot.data['breadcrumb']['routerLink'] = routerLink;
  //         }
  //
  //         return route;
  //       }),
  //       filter((route) => route.outlet === 'primary'),
  //       switchMap((route) =>
  //         route.data.pipe(
  //           withLatestFrom(this.breadcrumbs$),
  //           tap(([data, currentBreadcrumbs]) => {
  //             console.log('Breadcrumb Data: ', data); // Log breadcrumb Data
  //             console.log('Current Breadcrumbs: ', currentBreadcrumbs); // Log current breadcrumb state
  //
  //             if (data['breadcrumb']) {
  //               const level = data['breadcrumb']['routerLink']
  //                 .split('/')
  //                 .filter((segment: string) => segment.length > 0).length;
  //
  //               const index = currentBreadcrumbs.findIndex(
  //                 (bc) => bc.routerLink === data['breadcrumb']['routerLink'],
  //               );
  //
  //               const setBreadcrumbAction = breadcrumbActions.setBreadcrumb({
  //                 breadcrumb: {
  //                   ...data['breadcrumb'],
  //                   level: level,
  //                 },
  //               });
  //
  //               console.log('Dispatching Set Action: ', setBreadcrumbAction);
  //               this.store.dispatch(setBreadcrumbAction);
  //
  //               if (index !== -1) {
  //                 const clearBreadcrumbsAfterIndexAction =
  //                   breadcrumbActions.clearBreadcrumbsAfterIndex({
  //                     index: index + 1,
  //                   });
  //                 console.log(
  //                   'Dispatching Clear After Index Action: ',
  //                   clearBreadcrumbsAfterIndexAction,
  //                 );
  //                 this.store.dispatch(clearBreadcrumbsAfterIndexAction);
  //               } else {
  //                 const clearBreadcrumbsFromLevelAction =
  //                   breadcrumbActions.clearBreadcrumbsFromLevel({
  //                     level: level + 1,
  //                   });
  //                 console.log(
  //                   'Dispatching Clear From Level Action: ',
  //                   clearBreadcrumbsFromLevelAction,
  //                 );
  //                 this.store.dispatch(clearBreadcrumbsFromLevelAction);
  //               }
  //             }
  //           }),
  //         ),
  //       ),
  //     )
  //     .subscribe();
  //
  //   // Initialize navigation end event subscription to check current URL
  //   // this.router.events.subscribe((event) => {
  //   //   if (event instanceof NavigationEnd) {
  //   //     this.showBackButton = event.url !== '/' && event.url !== '/home';
  //   //   }
  //   // });
  // }

  // getParams(route: ActivatedRoute): { [key: string]: any } {
  //   let params: { [key: string]: any } = {};
  //   while (route) {
  //     params = { ...params, ...route.snapshot.params };
  //     if (route.firstChild) {
  //       route = route.firstChild;
  //     } else {
  //       break;
  //     }
  //   }
  //   return params;
  // }

  // a method to go back.
  // goBack() {
  //   this.location.back();
  // }

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
