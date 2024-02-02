import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { AsyncPipe, UpperCasePipe } from '@angular/common';
import {
  TuiComboBoxModule,
  TuiDataListWrapperModule,
  TuiFilterByInputPipeModule,
  TuiInputModule,
  TuiStringifyContentPipeModule,
} from '@taiga-ui/kit';
import { debounceTime, distinctUntilChanged, map, Observable, of } from 'rxjs';
import { TuiLoaderModule, TuiTextfieldControllerModule } from '@taiga-ui/core';
import { TuiAutofilledModule, TuiValueChangesModule } from '@taiga-ui/cdk';
import { FilterStrategy } from '../../../../type/filter.type';
import { SearchListService } from '../../../../services/search-list.service';

@Component({
  selector: 'app-form-search-auto-complete',
  standalone: true,
  imports: [
    AsyncPipe,
    FormsModule,
    ReactiveFormsModule,
    TuiDataListWrapperModule,
    TuiFilterByInputPipeModule,
    TuiInputModule,
    TuiStringifyContentPipeModule,
    UpperCasePipe,
    TuiComboBoxModule,
    TuiTextfieldControllerModule,
    TuiAutofilledModule,
    TuiValueChangesModule,
    TuiLoaderModule,
  ],
  templateUrl: './form-search-auto-complete.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './form-search-auto-complete.component.less',
})
export class FormSearchAutoCompleteComponent<T> implements OnInit {
  @Input() searchTitle: string = '';
  @Input() parameter: string = 'id';
  @Input() data$: Observable<T[]> = of([]);
  @Input() filter: FilterStrategy = 'startsWith';

  @Input() stringify: (data: T) => string = (data) => String(data).toString();
  @Input() searchMatcher: any;

  searchForm = new FormGroup({
    searchValue: new FormControl(''),
  });

  constructor(public searchListService: SearchListService<T>) {}

  ngOnInit() {
    console.log(`AUTO COMPLETE${this.searchForm.get('searchValue')!.value}`);

    this.searchListService.updateData(this.data$);
    this.searchForm
      .get('searchValue')
      ?.valueChanges.pipe(
        debounceTime(300),
        distinctUntilChanged(),
        map((value) => value?.toLowerCase()),
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

// readonly searchMatcher = (team: ITeam, search: string): boolean =>
//   team.title.toString().toLowerCase().startsWith(search.toLowerCase());

// readonly stringify = ({match}: IMatchFullData): string => match.week.toString();
//
// readonly matcherMatch = (match: IMatchFullData, search: string): boolean =>
//   match.match.week.toString().toLowerCase().startsWith(search.toLowerCase());
