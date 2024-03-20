import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { SportComponent } from '../sport.component';
import { HeaderMenuComponent } from '../../../shared/ui/headermenu/header-menu.component';
import { IBaseIdElse } from '../../../type/base.type';
import { tap } from 'rxjs/operators';
import { map, Observable } from 'rxjs';
import { SortService } from '../../../services/sort.service';
import { TuiLoaderModule } from '@taiga-ui/core';
import { AsyncPipe } from '@angular/common';
import { Store } from '@ngrx/store';
import { SportState } from '../store/reducers';
import { ISport } from '../../../type/sport.type';
import { sportActions } from '../store/actions';

import { Sport } from '../sport';
import { environment } from '../../../../environments/environment';
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

@Component({
  selector: 'app-sport-nav',
  standalone: true,
  imports: [HeaderMenuComponent, TuiLoaderModule, AsyncPipe],
  templateUrl: './sport-nav.component.html',
  styleUrl: './sport-nav.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SportNavComponent {
  sports$ = this.sport.sports$;

  constructor(private sport: Sport) {
    sport.loadAllSports();
  }

  mapItemToLabel(item: IBaseIdElse): string {
    return item.title ?? '';
  }

  sportRoutWithSeason(item: IBaseIdElse): any[] {
    return [
      `/sport/${item.id}/season/${environment.currentSeasonId}/tournaments`,
    ];
  }

  sportTeamsRout(item: IBaseIdElse): any[] {
    return [`/sport/${item.id}/teams`];
  }

  sportPlayersRout(item: IBaseIdElse): any[] {
    return [`/sport/${item.id}/players`];
  }
}
