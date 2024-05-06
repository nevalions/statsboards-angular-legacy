import { createFeature, createReducer, on } from '@ngrx/store';
import { SortService } from '../../../services/sort.service';
import { IPosition } from '../../../type/position.type';
import { positionActions } from './actions';

export interface PositionState {
  positionIsLoading: boolean;
  positionIsSubmitting: boolean;
  currentPositionId: number | undefined | null;
  currentPosition: IPosition | undefined | null;
  allPositions: IPosition[];
  allSportPositions: IPosition[];
}

const initialState: PositionState = {
  positionIsLoading: false,
  positionIsSubmitting: false,
  currentPositionId: null,
  allPositions: [],
  allSportPositions: [],
  currentPosition: null,
};

const positionFeature = createFeature({
  name: 'position',
  reducer: createReducer(
    initialState,

    on(positionActions.getId, (state) => ({
      ...state,
      positionIsLoading: true,
    })),
    on(positionActions.getPositionIdSuccessfully, (state, action) => ({
      ...state,
      positionIsLoading: false,
      currentPositionId: action.positionId,
    })),
    on(positionActions.getPositionIdFailure, (state) => ({
      ...state,
      positionIsLoading: false,
    })),

    // create actions
    on(positionActions.create, (state) => ({
      ...state,
      positionIsSubmitting: true,
    })),
    on(positionActions.createdSuccessfully, (state, action) => {
      const newList = [...state.allPositions, action.currentPosition];
      const newSportList = [...state.allSportPositions, action.currentPosition];

      return {
        ...state,
        positionIsSubmitting: false,
        currentPosition: action.currentPosition,
        allPositions: newList,
        allSportPositions: newSportList,
      };
    }),
    on(positionActions.createFailure, (state, action) => ({
      ...state,
      positionIsSubmitting: false,
      errors: action,
    })),

    // delete actions
    on(positionActions.delete, (state) => ({
      ...state,
      positionIsSubmitting: true,
    })),
    on(positionActions.deletedSuccessfully, (state, action) => ({
      ...state,
      positionIsSubmitting: false,
      allPositions: (state.allPositions || []).filter(
        (item) => item.id !== action.positionId,
      ),
      allSportPositions: (state.allPositions || []).filter(
        (item) => item.id !== action.positionId,
      ),
      errors: null,
    })),
    on(positionActions.deleteFailure, (state, action) => ({
      ...state,
      positionIsSubmitting: false,
      errors: action,
    })),

    // update actions
    on(positionActions.update, (state) => ({
      ...state,
      positionIsSubmitting: true,
    })),
    on(positionActions.updatedSuccessfully, (state, action) => ({
      ...state,
      positionIsSubmitting: false,
      currentPosition: action.updatedPosition,
      allPositions: state.allPositions.map((item) =>
        item.id === action.updatedPosition.id ? action.updatedPosition : item,
      ),
      allSportPositions: state.allSportPositions.map((item) =>
        item.id === action.updatedPosition.id ? action.updatedPosition : item,
      ),

      errors: null,
    })),
    on(positionActions.updateFailure, (state, action) => ({
      ...state,
      positionIsSubmitting: false,
      errors: action,
    })),

    // get actions
    on(positionActions.get, (state) => ({
      ...state,
      positionIsLoading: true,
    })),
    on(positionActions.getItemSuccess, (state, action) => ({
      ...state,
      positionIsLoading: false,
      currentPosition: action.position,
    })),
    on(positionActions.getItemFailure, (state, action) => ({
      ...state,
      positionIsLoading: false,
      errors: action,
    })),

    on(positionActions.getAll, (state) => ({
      ...state,
      positionIsLoading: true,
    })),
    on(positionActions.getAllItemsSuccess, (state, action) => {
      const sortedTournaments = SortService.sort(
        action.positions,
        'second_name',
      );
      return {
        ...state,
        positionIsLoading: false,
        allPositions: sortedTournaments,
      };
    }),
    on(positionActions.getAllItemsFailure, (state, action) => ({
      ...state,
      positionIsLoading: false,
      errors: action,
    })),

    on(positionActions.getAllPositionsBySportId, (state) => ({
      ...state,
      positionIsLoading: true,
    })),
    on(positionActions.getAllPositionsBySportIdSuccess, (state, action) => {
      const sortedPositions = SortService.sort(action.positions, 'id');
      return {
        ...state,
        positionIsLoading: false,
        allSportPositions: sortedPositions,
      };
    }),
    on(positionActions.getAllItemsFailure, (state, action) => ({
      ...state,
      positionIsLoading: false,
      errors: action,
    })),
  ),
});

export const {
  name: positionFeatureKey,
  reducer: positionReducer,
  selectPositionIsLoading,
  selectPositionIsSubmitting,
  selectCurrentPositionId,
  selectCurrentPosition,
  selectAllPositions,
  selectAllSportPositions,
} = positionFeature;
