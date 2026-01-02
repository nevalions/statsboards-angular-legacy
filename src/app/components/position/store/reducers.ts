import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { IPosition } from '../../../type/position.type';
import { positionActions } from './actions';
import { createFeature, createReducer, on, createSelector } from '@ngrx/store';

export interface PositionState extends EntityState<IPosition> {
  positionIsLoading: boolean;
  positionIsSubmitting: boolean;
  currentPositionId: number | undefined | null;
  currentPosition: IPosition | undefined | null;
  errors: any | null;
}

const adapter = createEntityAdapter<IPosition>({
  sortComparer: (a, b) => (a.title || '').localeCompare(b.title || ''),
});

const initialState: PositionState = adapter.getInitialState({
  positionIsLoading: false,
  positionIsSubmitting: false,
  currentPositionId: null,
  currentPosition: null,
  errors: null,
});

const positionFeature = createFeature({
  name: 'position',
  reducer: createReducer(
    initialState,

    on(
      positionActions.getId,
      (state): PositionState => ({
        ...state,
        positionIsLoading: true,
      }),
    ),
    on(
      positionActions.getPositionIdSuccessfully,
      (state, action): PositionState => ({
        ...state,
        positionIsLoading: false,
        currentPositionId: action.positionId,
      }),
    ),
    on(
      positionActions.getPositionIdFailure,
      (state): PositionState => ({
        ...state,
        positionIsLoading: false,
      }),
    ),

    on(
      positionActions.create,
      (state): PositionState => ({
        ...state,
        positionIsSubmitting: true,
      }),
    ),
    on(
      positionActions.createdSuccessfully,
      (state, action): PositionState =>
        adapter.addOne(action.currentPosition, {
          ...state,
          positionIsSubmitting: false,
          currentPosition: action.currentPosition,
        }),
    ),
    on(
      positionActions.createFailure,
      (state, action): PositionState => ({
        ...state,
        positionIsSubmitting: false,
        errors: action,
      }),
    ),

    on(
      positionActions.delete,
      (state): PositionState => ({
        ...state,
        positionIsSubmitting: true,
      }),
    ),
    on(
      positionActions.deletedSuccessfully,
      (state, action): PositionState =>
        adapter.removeOne(action.positionId, {
          ...state,
          positionIsSubmitting: false,
          errors: null,
        }),
    ),
    on(
      positionActions.deleteFailure,
      (state, action): PositionState => ({
        ...state,
        positionIsSubmitting: false,
        errors: action,
      }),
    ),

    on(
      positionActions.deleteById,
      (state): PositionState => ({
        ...state,
        positionIsSubmitting: true,
      }),
    ),
    on(
      positionActions.deletedByIdSuccessfully,
      (state, action): PositionState =>
        adapter.removeOne(action.positionId, {
          ...state,
          positionIsSubmitting: false,
          errors: null,
        }),
    ),
    on(
      positionActions.deleteByIdFailure,
      (state, action): PositionState => ({
        ...state,
        positionIsSubmitting: false,
        errors: action,
      }),
    ),

    on(
      positionActions.update,
      (state): PositionState => ({
        ...state,
        positionIsSubmitting: true,
      }),
    ),
    on(
      positionActions.updatedSuccessfully,
      (state, action): PositionState =>
        adapter.updateOne(
          { id: action.updatedPosition.id!, changes: action.updatedPosition },
          {
            ...state,
            positionIsSubmitting: false,
            currentPosition: action.updatedPosition,
            errors: null,
          },
        ),
    ),
    on(
      positionActions.updateFailure,
      (state, action): PositionState => ({
        ...state,
        positionIsSubmitting: false,
        errors: action,
      }),
    ),

    on(
      positionActions.get,
      (state): PositionState => ({
        ...state,
        positionIsLoading: true,
      }),
    ),
    on(
      positionActions.getItemSuccess,
      (state, action): PositionState => ({
        ...state,
        positionIsLoading: false,
        currentPosition: action.position,
      }),
    ),
    on(
      positionActions.getItemFailure,
      (state, action): PositionState => ({
        ...state,
        positionIsLoading: false,
        errors: action,
      }),
    ),

    on(
      positionActions.getAll,
      (state): PositionState => ({
        ...state,
        positionIsLoading: true,
      }),
    ),
    on(
      positionActions.getAllItemsSuccess,
      (state, action): PositionState =>
        adapter.setAll(action.positions, {
          ...state,
          positionIsLoading: false,
        }),
    ),
    on(
      positionActions.getAllItemsFailure,
      (state, action): PositionState => ({
        ...state,
        positionIsLoading: false,
        errors: action,
      }),
    ),

    on(
      positionActions.getAllPositionsBySportId,
      (state): PositionState => ({
        ...state,
        positionIsLoading: true,
      }),
    ),
    on(
      positionActions.getAllPositionsBySportIdSuccess,
      (state): PositionState => ({
        ...state,
        positionIsLoading: false,
      }),
    ),
    on(
      positionActions.getAllItemsFailure,
      (state, action): PositionState => ({
        ...state,
        positionIsLoading: false,
        errors: action,
      }),
    ),
  ),
});

const { selectAll, selectEntities, selectTotal } = adapter.getSelectors();

export const {
  name: positionFeatureKey,
  reducer: positionReducer,
  selectPositionIsLoading,
  selectPositionIsSubmitting,
  selectCurrentPositionId,
  selectCurrentPosition,
} = positionFeature;

export const selectAllPositions = createSelector(
  positionFeature.selectPositionState,
  selectAll,
);
export const selectPositionEntities = createSelector(
  positionFeature.selectPositionState,
  selectEntities,
);
export const selectPositionTotal = createSelector(
  positionFeature.selectPositionState,
  selectTotal,
);

export const selectAllSportPositions = selectAllPositions;

export const selectPositionsBySportId = (sportId: number) =>
  createSelector(selectAllPositions, (positions) =>
    positions.filter((position) => position.sport_id === sportId),
  );
