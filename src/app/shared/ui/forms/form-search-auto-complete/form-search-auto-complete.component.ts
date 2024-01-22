import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {AsyncPipe, UpperCasePipe} from "@angular/common";
import {
  TuiComboBoxModule,
  TuiDataListWrapperModule,
  TuiFilterByInputPipeModule,
  TuiInputModule,
  TuiStringifyContentPipeModule
} from "@taiga-ui/kit";
import {map, Observable, of} from "rxjs";
import {TuiTextfieldControllerModule} from "@taiga-ui/core";
import {TuiAutofilledModule, TuiValueChangesModule} from "@taiga-ui/cdk";


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
    TuiValueChangesModule
  ],
  templateUrl: './form-search-auto-complete.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './form-search-auto-complete.component.less'
})

export class FormSearchAutoCompleteComponent<T> {
  @Input() data$: Observable<T[]> = of({} as T[]);
  @Input() searchTitle: string = ''
  @Input() searchString: string = '';
  @Input() stringify: (data: T) => string = (data) => String(data).toString();
  @Input() searchMatcher: any;

  @Output() searchPerformed: EventEmitter<string> = new EventEmitter<string>();

  searchForm = new FormGroup({
    searchValue: new FormControl(''),
  });

  onSearch() {
    this.searchString = this.searchForm.get('searchValue')?.value || '';
    this.searchPerformed.emit(this.searchString);

    this.data$.subscribe(items => {
      if (items) {
        console.log('IIIIIIIIIIIII', items)
        console.log('filtered items', this.filterItems(items));
      }
    });
  }

  filterItems(items: T[]): T[] {
    console.log('Item type:', typeof items[0]);
    if (!this.searchString) {
      return items;
    }
    console.log('SSSSSSSSSSSSSS', this.searchString)
    const lowerCaseSearch = this.searchString.toString().toLowerCase();
    console.log('MMMMMMMMMMMMMM', lowerCaseSearch)
    return items.filter(item =>
      this.searchMatcher(item, lowerCaseSearch)
    );
  }

}


  // readonly searchMatcher = (team: ITeam, search: string): boolean =>
  //   team.title.toString().toLowerCase().startsWith(search.toLowerCase());

  // readonly stringify = ({match}: IMatchFullData): string => match.week.toString();
  //
  // readonly matcherMatch = (match: IMatchFullData, search: string): boolean =>
  //   match.match.week.toString().toLowerCase().startsWith(search.toLowerCase());
