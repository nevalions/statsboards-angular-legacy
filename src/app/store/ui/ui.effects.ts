import { concatLatestFrom } from '@ngrx/operators';import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { uiActions } from './ui.actions';
import { filter, withLatestFrom } from 'rxjs';
import { selectFormVisibility } from './ui.reducers';
import { tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AppState } from '../appstate';

@Injectable()
export class UiEffects {
  persist$ = createEffect(
    () =>
      { return this.actions$.pipe(
        ofType(uiActions.toggleForm, uiActions.toggleAllForms),
        filter((action: any) => action.meta?.persist),
        concatLatestFrom(() => this.store.select(selectFormVisibility)),
        tap(([action, formVisibility]) =>
          localStorage.setItem(
            'formVisibility',
            JSON.stringify(formVisibility),
          ),
        ),
      ) },
    { dispatch: false },
  );

  constructor(
    private actions$: Actions,
    private store: Store<AppState>,
  ) {}
}
