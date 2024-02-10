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
  NavigationEnd,
  Router,
  RouterLink,
  RouterOutlet,
} from '@angular/router';
import { HeaderComponent } from './components/header/header.component';

import { HomeComponent } from './components/home/home.component';
import { TuiBreadcrumbsModule } from '@taiga-ui/kit';
import { tuiIconArrowLeftLarge } from '@taiga-ui/icons';

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

  showBackButton: boolean = false;

  constructor(
    private location: Location,
    private router: Router,
  ) {
    // Initialize navigation end event subscription to check current URL
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.showBackButton = event.url !== '/' && event.url !== '/home';
      }
    });
  }

  // a method to go back.
  goBack() {
    this.location.back();
  }

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
