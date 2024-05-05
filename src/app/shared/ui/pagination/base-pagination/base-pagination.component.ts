import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  TuiDataListWrapperModule,
  TuiPaginationModule,
  TuiSelectModule,
} from '@taiga-ui/kit';
import { TuiTextfieldControllerModule } from '@taiga-ui/core';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-base-pagination',
  standalone: true,
  imports: [
    TuiPaginationModule,
    ReactiveFormsModule,
    TuiSelectModule,
    TuiDataListWrapperModule,
    TuiTextfieldControllerModule,
  ],
  templateUrl: './base-pagination.component.html',
  styleUrl: './base-pagination.component.less',
})
export class BasePaginationComponent {
  @Input() currentPage: number = 1;
  @Input() totalPages!: number;

  @Output() pageChange = new EventEmitter<number>();
  @Output() pageSizeChange = new EventEmitter<number | 'All'>();

  itemsPerPageOptions: (string | number)[] = ['All', 2, 4, 6, 8, 10, 20];

  itemPerPageForm = new FormGroup({
    itemPerPageValue: new FormControl(4, Validators.required),
  });

  constructor() {
    this.itemPerPageForm
      .get('itemPerPageValue')!
      .valueChanges.pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((itemsPerPage) => {
        this.pageSizeChange.emit(itemsPerPage ?? 'All');
      });
  }

  onIndexChange(newPageIndex: number) {
    this.pageChange.emit(newPageIndex + 1);
  }

  changePageSize(itemsPerPage: number | 'All') {
    this.pageSizeChange.emit(itemsPerPage);
  }
}
