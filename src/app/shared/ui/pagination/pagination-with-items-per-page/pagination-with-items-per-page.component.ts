import {Component, Input, inject, OnInit, OnDestroy} from '@angular/core';
import {FormGroup, ReactiveFormsModule} from '@angular/forms';
import {debounceTime, distinctUntilChanged, Observable, of, Subscription} from "rxjs";
import { PaginationService } from "../../../../services/pagination.service"
import {TuiInputNumberModule, TuiPaginationModule} from "@taiga-ui/kit";
import {TuiValueChangesModule} from "@taiga-ui/cdk";
import {AsyncPipe} from "@angular/common";

@Component({
  selector: 'app-pagination-with-items-per-page',
  templateUrl: './pagination-with-items-per-page.component.html',
  standalone: true,
  imports: [
    TuiPaginationModule,
    TuiInputNumberModule,
    TuiValueChangesModule,
    AsyncPipe,
    ReactiveFormsModule
  ],
  styleUrl: './pagination-with-items-per-page.component.less'
})

export class paginationWithItemsPerPage implements OnInit, OnDestroy {
  paginationService = inject(PaginationService)

  @Input() items$: Observable<any[]> = of([]);
  @Input() itemPerPageForm!: FormGroup;

  private valueChangeSubscription!: Subscription;

  ngOnInit() {
    this.valueChangeSubscription = this.itemPerPageForm.get('itemPerPageValue')!.valueChanges.pipe(
      debounceTime(100),
      distinctUntilChanged()
    ).subscribe(newValue => {
      if (Number(newValue)) {
        this.paginationService.itemsPerPage.next(Number(newValue));
      }
    });
  }

  setCurrentPage(pageIndex: number) {
    this.paginationService.setPage(pageIndex + 1);
  }

  ngOnDestroy() {
    this.valueChangeSubscription.unsubscribe();
  }
}
