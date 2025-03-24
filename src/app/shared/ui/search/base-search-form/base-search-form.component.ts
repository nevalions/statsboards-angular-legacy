import { TuiTextfieldControllerModule, TuiInputModule } from "@taiga-ui/legacy";
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { UpperCasePipe } from '@angular/common';

@Component({
  selector: 'app-base-search-form',
  standalone: true,
  imports: [
    TuiInputModule,
    TuiTextfieldControllerModule,
    ReactiveFormsModule,
    UpperCasePipe,
  ],
  templateUrl: './base-search-form.component.html',
  styleUrl: './base-search-form.component.less',
})
export class BaseSearchFormComponent {
  @Input() placeholder: string = 'item';
  @Output() search = new EventEmitter<string | null>();

  searchForm = new FormGroup({
    searchValue: new FormControl(''),
  });

  constructor() {
    this.searchForm
      .get('searchValue')!
      .valueChanges.pipe(debounceTime(200), distinctUntilChanged())
      .subscribe((searchTerm) => {
        this.search.emit(searchTerm);
      });
  }
}
