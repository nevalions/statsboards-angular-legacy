import {Component, Input, inject, OnInit, OnDestroy, ChangeDetectionStrategy} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {debounceTime, distinctUntilChanged, Observable, of, Subscription, take} from "rxjs";
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
  styleUrl: './pagination-with-items-per-page.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class paginationWithItemsPerPage implements OnInit, OnDestroy {
  paginationService = inject(PaginationService)
  private valueChangeSubscription!: Subscription;

  @Input() items$: Observable<any[]> = of([]);

  itemPerPageForm: FormGroup = new FormGroup({
  itemPerPageValue: new FormControl(
    {value: 4, disabled: false},
    [
      Validators.min(1),
      Validators.max(1)
    ]),
  });

  ngOnInit() {
    this.valueChangeSubscription = this.itemPerPageForm.get('itemPerPageValue')!.valueChanges
      .pipe(
        debounceTime(50),
        distinctUntilChanged()
      ).subscribe(newValue => {
        if (Number(newValue)) {
          this.paginationService.itemsPerPage.next(Number(newValue));
        }
      });

    this.paginationService.totalPages$.subscribe(totalPages => {
    // Update the max validator dynamically when totalPages$ changes
    this.itemPerPageForm.get('itemPerPageValue')?.setValidators([
      Validators.min(1),
      Validators.max(totalPages),
    ]);

    // Trigger revalidation to ensure current value complies with the new max
    this.itemPerPageForm.get('itemPerPageValue')?.setValue(this.paginationService.itemsPerPage.value);
  });

  //   this.paginationService.totalPages$
  //     .pipe(take(1))
  //     .subscribe(totalPages => {
  //   const initialPerPageValue = Math.max(
  //     1, Math.min(this.paginationService.itemsPerPage.value, totalPages - 1)
  //   );
  //   this.itemPerPageForm.get('itemPerPageValue')?.setValue(initialPerPageValue);
  // });
  }

  setCurrentPage(pageIndex: number) {
    this.paginationService.setPage(pageIndex + 1);
  }

  ngOnDestroy() {
    this.valueChangeSubscription.unsubscribe();
  }
}
