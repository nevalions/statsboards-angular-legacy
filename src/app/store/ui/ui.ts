import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '../appstate';
import { selectFormVisibility } from './ui.reducers';
import { uiActions } from './ui.actions';

@Injectable({
  providedIn: 'root',
})
export class Ui {
  formVisibility$: Observable<{ [formName: string]: boolean }>;

  constructor(private store: Store<AppState>) {
    this.formVisibility$ = this.store.select(selectFormVisibility);

    // Load UI state from localstorage.
    this.store.dispatch(uiActions.loadStateFromLocalStorage());
  }

  toggleFormVisibility(formName: string) {
    this.store.dispatch(uiActions.toggleForm({ formName }));
  }

  toggleAllFormsVisibility() {
    this.store.dispatch(uiActions.toggleAllForms());
  }
}
