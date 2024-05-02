import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { personActions } from './store/actions';
import { Observable } from 'rxjs';
import { IPerson } from '../../type/person.type';
import { AppState } from '../../store/appstate';

@Injectable({
  providedIn: 'root',
})
export class Person {
  person$: Observable<IPerson | null | undefined>;
  persons$: Observable<IPerson[]>;

  constructor(private store: Store<AppState>) {
    this.person$ = store.select((state) => state.person.currentPerson);
    this.persons$ = store.select((state) => state.person.allPersons);
  }

  createPerson(person: IPerson) {
    this.store.dispatch(personActions.create({ request: person }));
  }

  updatePerson(person: IPerson) {
    this.store.dispatch(
      personActions.update({ id: person.id!, newPersonData: person }),
    );
  }

  loadCurrentPerson() {
    this.store.dispatch(personActions.getId());
  }

  loadAllPersons() {
    this.store.dispatch(personActions.getAll());
  }
}
