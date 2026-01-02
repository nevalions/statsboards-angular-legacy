import { createSelector, createFeature, createReducer, on } from '@ngrx/store';
import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { IPerson } from '../../../type/person.type';
import { personActions } from './actions';

const adapter = createEntityAdapter<IPerson>({
  sortComparer: (a: IPerson, b: IPerson) =>
    a.second_name.localeCompare(b.second_name),
});

export interface PersonState extends EntityState<IPerson> {
  personIsLoading: boolean;
  personIsSubmitting: boolean;
  currentPersonId: number | undefined | null;
  currentPerson: IPerson | undefined | null;
  errors: unknown | null;
}

const initialState: PersonState = adapter.getInitialState({
  personIsLoading: false,
  personIsSubmitting: false,
  currentPersonId: null,
  currentPerson: null,
  errors: null,
});

const personFeature = createFeature({
  name: 'person',
  reducer: createReducer(
    initialState,

    on(
      personActions.getId,
      (state): PersonState => ({
        ...state,
        personIsLoading: true,
      }),
    ),
    on(
      personActions.getPersonIdSuccessfully,
      (state, action): PersonState => ({
        ...state,
        personIsLoading: false,
        currentPersonId: action.personId,
      }),
    ),
    on(
      personActions.getPersonIdFailure,
      (state): PersonState => ({
        ...state,
        personIsLoading: false,
      }),
    ),

    // create actions
    on(
      personActions.create,
      (state): PersonState => ({
        ...state,
        personIsSubmitting: true,
      }),
    ),
    on(personActions.createdSuccessfully, (state, action): PersonState => {
      return adapter.addOne(action.currentPerson, {
        ...state,
        personIsSubmitting: false,
        currentPerson: action.currentPerson,
      });
    }),
    on(
      personActions.createFailure,
      (state, action): PersonState => ({
        ...state,
        personIsSubmitting: false,
        errors: action,
      }),
    ),

    // delete actions
    on(
      personActions.delete,
      (state): PersonState => ({
        ...state,
        personIsSubmitting: true,
      }),
    ),
    on(personActions.deletedSuccessfully, (state, action): PersonState => {
      return adapter.removeOne(action.personId, {
        ...state,
        personIsSubmitting: false,
        errors: null,
      });
    }),
    on(
      personActions.deleteFailure,
      (state, action): PersonState => ({
        ...state,
        personIsSubmitting: false,
        errors: action,
      }),
    ),

    // update actions
    on(
      personActions.update,
      (state): PersonState => ({
        ...state,
        personIsSubmitting: true,
      }),
    ),
    on(personActions.updatedSuccessfully, (state, action): PersonState => {
      return adapter.updateOne(
        { id: action.updatedPerson.id!, changes: action.updatedPerson },
        {
          ...state,
          personIsSubmitting: false,
          currentPerson: action.updatedPerson,
          errors: null,
        },
      );
    }),
    on(
      personActions.updateFailure,
      (state, action): PersonState => ({
        ...state,
        personIsSubmitting: false,
        errors: action,
      }),
    ),

    // get actions
    on(
      personActions.get,
      (state): PersonState => ({
        ...state,
        personIsLoading: true,
      }),
    ),
    on(
      personActions.getItemSuccess,
      (state, action): PersonState => ({
        ...state,
        personIsLoading: false,
        currentPerson: action.person,
      }),
    ),
    on(
      personActions.getItemFailure,
      (state, action): PersonState => ({
        ...state,
        personIsLoading: false,
        errors: action,
      }),
    ),

    on(
      personActions.getAll,
      (state): PersonState => ({
        ...state,
        personIsLoading: true,
      }),
    ),
    on(personActions.getAllItemsSuccess, (state, action): PersonState => {
      return adapter.setAll(action.persons, {
        ...state,
        personIsLoading: false,
      });
    }),
    on(
      personActions.getAllItemsFailure,
      (state, action): PersonState => ({
        ...state,
        personIsLoading: false,
        errors: action,
      }),
    ),
  ),
});

const { selectAll } = adapter.getSelectors();

export const {
  name: personFeatureKey,
  reducer: personReducer,
  selectPersonIsLoading,
  selectPersonIsSubmitting,
  selectCurrentPersonId,
  selectCurrentPerson,
} = personFeature;

export const selectAllPersons = createSelector(
  personFeature.selectPersonState,
  selectAll,
);
