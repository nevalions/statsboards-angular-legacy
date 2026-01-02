import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { personActions } from './store/actions';
import { Observable } from 'rxjs';
import { IPerson } from '../../type/person.type';
import { selectAvailablePersonsForSport } from '../player/store/selectors';
import { selectAllPersons, selectCurrentPerson } from './store/reducers';

@Injectable({
  providedIn: 'root',
})
export class Person {
  private store = inject(Store);

  currentPerson$: Observable<IPerson | null | undefined>;
  allPersons$: Observable<IPerson[]>;
  availablePersonsForSport$: Observable<IPerson[]>;

  constructor() {
    const store = this.store;

    this.currentPerson$ = store.select(selectCurrentPerson);
    this.allPersons$ = store.select(selectAllPersons);
    this.availablePersonsForSport$ = store.select(
      selectAvailablePersonsForSport,
    );
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

  deletePerson() {
    this.store.dispatch(personActions.delete());
  }
}
