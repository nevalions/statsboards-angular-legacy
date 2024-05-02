import { createFeature, createReducer, on } from '@ngrx/store';
import { SortService } from '../../../services/sort.service';
import { IPerson } from '../../../type/person.type';
import { personActions } from './actions';

export interface PersonState {
  personIsLoading: boolean;
  personIsSubmitting: boolean;
  currentPersonId: number | undefined | null;
  currentPerson: IPerson | undefined | null;
  allPersons: IPerson[];
}

const initialState: PersonState = {
  personIsLoading: false,
  personIsSubmitting: false,
  currentPersonId: null,
  allPersons: [],
  currentPerson: null,
};

const personFeature = createFeature({
  name: 'person',
  reducer: createReducer(
    initialState,

    on(personActions.getId, (state) => ({
      ...state,
      personIsLoading: true,
    })),
    on(personActions.getPersonIdSuccessfully, (state, action) => ({
      ...state,
      personIsLoading: false,
      currentPersonId: action.personId,
    })),
    on(personActions.getPersonIdFailure, (state) => ({
      ...state,
      personIsLoading: false,
    })),

    // create actions
    on(personActions.create, (state) => ({
      ...state,
      personIsSubmitting: true,
    })),
    on(personActions.createdSuccessfully, (state, action) => {
      const newList = [...state.allPersons, action.currentPerson];
      const sortedTournaments = SortService.sort(newList, 'second_name');
      return {
        ...state,
        personIsSubmitting: false,
        currentPerson: action.currentPerson,
        allPersons: sortedTournaments, // sorted list
      };
    }),
    on(personActions.createFailure, (state, action) => ({
      ...state,
      personIsSubmitting: false,
      errors: action,
    })),

    // delete actions
    on(personActions.delete, (state) => ({
      ...state,
      personIsSubmitting: true,
    })),
    on(personActions.deletedSuccessfully, (state, action) => ({
      ...state,
      personIsSubmitting: false,
      allPersons: (state.allPersons || []).filter(
        (item) => item.id !== action.personId,
      ),
      errors: null,
    })),
    on(personActions.deleteFailure, (state, action) => ({
      ...state,
      personIsSubmitting: false,
      errors: action,
    })),

    // update actions
    on(personActions.update, (state) => ({
      ...state,
      personIsSubmitting: true,
    })),
    on(personActions.updatedSuccessfully, (state, action) => ({
      ...state,
      personIsSubmitting: false,
      currentPerson: action.updatedPerson,
      allPersons: state.allPersons.map((item) =>
        item.id === action.updatedPerson.id ? action.updatedPerson : item,
      ),
      errors: null,
    })),
    on(personActions.updateFailure, (state, action) => ({
      ...state,
      personIsSubmitting: false,
      errors: action,
    })),

    // get actions
    on(personActions.get, (state) => ({
      ...state,
      personIsLoading: true,
    })),
    on(personActions.getItemSuccess, (state, action) => ({
      ...state,
      personIsLoading: false,
      currentPerson: action.person,
    })),
    on(personActions.getItemFailure, (state, action) => ({
      ...state,
      personIsLoading: false,
      errors: action,
    })),

    on(personActions.getAll, (state) => ({
      ...state,
      personIsLoading: true,
    })),
    on(personActions.getAllItemsSuccess, (state, action) => {
      const sortedTournaments = SortService.sort(action.persons, 'second_name');
      return {
        ...state,
        personIsLoading: false,
        allPersons: sortedTournaments,
      };
    }),
    on(personActions.getAllItemsFailure, (state, action) => ({
      ...state,
      personIsLoading: false,
      errors: action,
    })),
  ),
});

export const {
  name: personFeatureKey,
  reducer: personReducer,
  selectPersonIsLoading,
  selectPersonIsSubmitting,
  selectCurrentPersonId,
  selectCurrentPerson,
  selectAllPersons,
} = personFeature;
