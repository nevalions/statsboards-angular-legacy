import {ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {TuiIslandModule} from "@taiga-ui/kit";
import {AsyncPipe} from "@angular/common";
import {TuiLoaderModule} from "@taiga-ui/core";
import {Observable, of, Subscription} from "rxjs";
import {SearchListService} from "../../../services/search-list.service";

@Component({
  selector: 'app-list-of-items-island',
  standalone: true,
  imports: [
    TuiIslandModule,
    AsyncPipe,
    TuiLoaderModule
  ],
  templateUrl: './list-of-items-island.component.html',
  styleUrl: './list-of-items-island.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class ListOfItemsIslandComponent<T extends { id: number, p?: string }>
  implements OnInit, OnDestroy {
  @Input() emptyMessage: string = 'No data available';
  @Input() formatPath: (item: T) => string = () => '';
  @Input() titleProperty: keyof T = 'id';
  @Input() paragraphProperty: keyof T = 'p';

  // Initialize with an empty array
  @Input() data$: Observable<T[]> = of({} as T[]);

  private subscription?: Subscription;

  constructor(
    private searchListService: SearchListService<T>
  ) {}

  ngOnInit() {
    // BRAKES CHILD IF INIT
    // this.subscription = this.searchListService.filteredData$
    //   .subscribe(data => {
    //     console.log('Data emitted:', data);
    //
    //     this.data$ = this.searchListService.filteredData$
    //
    //   });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
}
