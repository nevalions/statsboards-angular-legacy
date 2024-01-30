import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {TuiInputModule, TuiInputMonthRangeModule} from "@taiga-ui/kit";
import {UpperCasePipe} from "@angular/common";
import {debounceTime, distinctUntilChanged, map, Observable, of, startWith, Subscription, switchMap} from "rxjs";
import {TuiTextfieldControllerModule} from "@taiga-ui/core";
import {TuiValueChangesModule} from "@taiga-ui/cdk";
import {tap} from "rxjs/operators";
import {SearchListService} from "../../../../services/search-list.service";

@Component({
  selector: 'app-form-search-text',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TuiInputModule,
    TuiInputMonthRangeModule,
    UpperCasePipe,
    TuiTextfieldControllerModule,
    TuiValueChangesModule
  ],
  templateUrl: './form-search-text.component.html',
  styleUrl: './form-search-text.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormSearchTextComponent<T> implements OnInit, OnDestroy {
  @Input() searchTitle: string = ''
  @Input() data$: Observable<T[]> = of({} as T[]);
  @Input() searchString: string = '';
  @Input() parameter: string = 'id';


  searchForm = new FormGroup({
    searchValue: new FormControl(''),
  });

  private subscription?: Subscription;

  constructor(
    private searchListService: SearchListService<T>
  ) {}

  ngOnInit() {
    this.searchForm.get('searchValue')?.valueChanges.pipe(
    startWith(''),  /* Add this line */
    debounceTime(300),
    distinctUntilChanged()
    )
      .subscribe(query => {
        if (query !== null) {
          this.onSearch(query);
        }});
  }

  onSearch(searchString?: string) {
  this.subscription?.unsubscribe();

  this.subscription = this.data$
    .pipe(
      map((items) => this.filterItems(items, searchString ?? ''))
    )
    .subscribe(filteredItems => {
      this.searchListService.updateFilteredData(filteredItems);
    });
  }

  private filterItems(items: T[], searchString: string): T[] {
    if (searchString === '') {
      return items;
    }
    else {
      const lowerCaseSearch = searchString.toLowerCase();
      return items.filter((item) => {
        const paramValue = String(item[this.parameter as keyof T]).toLowerCase();
        return paramValue.startsWith(lowerCaseSearch);
      });
    }
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
}
