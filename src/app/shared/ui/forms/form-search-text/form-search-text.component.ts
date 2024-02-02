import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TuiInputModule, TuiInputMonthRangeModule } from '@taiga-ui/kit';
import { UpperCasePipe } from '@angular/common';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  Observable,
  of,
  startWith,
} from 'rxjs';
import { TuiTextfieldControllerModule } from '@taiga-ui/core';
import { TuiValueChangesModule } from '@taiga-ui/cdk';
import { SearchListService } from '../../../../services/search-list.service';
import { FilterStrategy } from '../../../../type/filter.type';

@Component({
  selector: 'app-form-search-text',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TuiInputModule,
    TuiInputMonthRangeModule,
    UpperCasePipe,
    TuiTextfieldControllerModule,
    TuiValueChangesModule,
  ],
  templateUrl: './form-search-text.component.html',
  styleUrl: './form-search-text.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormSearchTextComponent<T> implements OnInit {
  @Input() searchTitle: string = '';
  @Input() parameter: string = 'id';
  @Input() data$: Observable<T[]> = of([]);

  @Input() filter: FilterStrategy = 'startsWith';

  searchForm = new FormGroup({
    searchValue: new FormControl(''),
  });

  constructor(public searchListService: SearchListService<T>) {}

  ngOnInit() {
    this.searchForm.setValue({ searchValue: '' });
    this.searchListService.updateData(this.data$);
    this.searchForm
      .get('searchValue')
      ?.valueChanges.pipe(
        // startWith(''),
        debounceTime(300),
        distinctUntilChanged(),
      )
      .subscribe((query) => {
        this.searchListService.updateFilteredData(
          query!,
          this.parameter,
          this.filter,
        );
      });
  }

  onSearch() {
    const searchString = this.searchForm.get('searchValue')!.value;
    if (searchString) {
      this.searchListService.updateFilteredData(searchString, this.parameter);
    } else {
      this.searchListService.updateFilteredData('', this.parameter);
    }
  }
}
