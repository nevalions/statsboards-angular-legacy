import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, filter, map, of, switchMap } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { PersonService } from '../person.service';
import { IPerson } from '../../../type/person.type';
import { personActions } from './actions';
import { Store } from '@ngrx/store';
import { getRouterSelectors, routerNavigatedAction } from '@ngrx/router-store';
import { getAllRouteParameters } from '../../../router/router.selector';

@Injectable()
export class PersonEffects {
  getPersonIdFromRouteEffect = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(routerNavigatedAction),
        switchMap(({ payload }) => {
          let params = getAllRouteParameters(payload.routerState);
          let personId = params.get('person_id');
          return of(personId).pipe(
            filter((id: string | undefined): id is string => !!id),
            switchMap((id: string) => [
              personActions.getPersonIdSuccessfully({ personId: Number(id) }),
            ]),
            catchError(() => of(personActions.getPersonIdFailure())),
          );
        }),
      );
    },
    { functional: false },
  );

  createPersonEffect = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(personActions.create),
        switchMap(({ request }) => {
          return this.personService.addItem(request).pipe(
            map((currentPerson: IPerson) => {
              return personActions.createdSuccessfully({
                currentPerson,
              });
            }),
            catchError(() => {
              return of(personActions.createFailure());
            }),
          );
        }),
      );
    },
    { functional: true },
  );

  getAllPersons = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(personActions.getAll),
        switchMap(() => {
          return this.personService.findAll().pipe(
            map((persons: IPerson[]) => {
              return personActions.getAllItemsSuccess({
                persons,
              });
            }),
            catchError(() => {
              return of(personActions.getAllItemsFailure());
            }),
          );
        }),
      );
    },
    { functional: true },
  );

  getPersonByIdSuccessEffect = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(personActions.getPersonIdSuccessfully),
        switchMap(({ personId }) =>
          this.personService.findById(personId).pipe(
            map((person: IPerson) => personActions.getItemSuccess({ person })),
            catchError(() => of(personActions.getItemFailure())),
          ),
        ),
      );
    },
    { functional: true },
  );

  getPersonByIdEffect = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(personActions.get),
        switchMap(({ id }) =>
          this.personService.findById(id).pipe(
            map((person: IPerson) => personActions.getItemSuccess({ person })),
            catchError(() => of(personActions.getItemFailure())),
          ),
        ),
      );
    },
    { functional: true },
  );

  deletePersonEffect = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(personActions.delete),
        switchMap(({ id }) => {
          // const _id = typeof id === 'string' ? Number(id) : id;
          return this.personService.deleteItem(id).pipe(
            map(() => {
              return personActions.deletedSuccessfully({ id: id });
            }),
            catchError(() => {
              return of(personActions.deleteFailure());
            }),
          );
        }),
      );
    },
    { functional: true },
  );

  navigateOnPersonDeletion$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(personActions.deletedSuccessfully),
        tap(() => this.router.navigateByUrl('/')),
      );
    },
    { dispatch: false },
  );

  constructor(
    private router: Router,
    private actions$: Actions,
    private personService: PersonService,
    private store: Store,
  ) {}
}
