import { createFeature, createReducer, on } from '@ngrx/store';
import { SortService } from '../../../../services/sort.service';
import { sponsorSponsorLineConnectionActions } from './actions';
import { ISponsorLineConnection } from '../../../../type/sponsor.type';

export interface SponsorSponsorLineConnectionState {
  sponsorSponsorLineConnectionIsLoading: boolean;
  sponsorSponsorLineConnectionIsSubmitting: boolean;
  sponsorSponsorLineConnectionId: number | undefined | null;
  currentSponsorSponsorLineConnection:
    | ISponsorLineConnection
    | undefined
    | null;
  allSponsorSponsorLineConnections: ISponsorLineConnection[];
  errors: any | undefined | null;
}

const initialState: SponsorSponsorLineConnectionState = {
  sponsorSponsorLineConnectionIsLoading: false,
  sponsorSponsorLineConnectionIsSubmitting: false,
  sponsorSponsorLineConnectionId: null,
  allSponsorSponsorLineConnections: [],
  currentSponsorSponsorLineConnection: null,
  errors: null,
};

const sponsorSponsorLineConnectionFeature = createFeature({
  name: 'sponsorSponsorLineConnection',
  reducer: createReducer(
    initialState,
    on(sponsorSponsorLineConnectionActions.getId, (state) => ({
      ...state,
      sponsorSponsorLineConnectionIsLoading: true,
    })),
    on(
      sponsorSponsorLineConnectionActions.getSponsorSponsorLineConnectionIdSuccessfully,
      (state, action) => ({
        ...state,
        sponsorSponsorLineConnectionIsLoading: false,
        sponsorSponsorLineConnectionId: action.sponsorSponsorLineConnectionId,
      }),
    ),
    on(
      sponsorSponsorLineConnectionActions.getSponsorSponsorLineConnectionIdFailure,
      (state) => ({
        ...state,
        sponsorSponsorLineConnectionIsLoading: false,
      }),
    ),

    // create actions
    on(sponsorSponsorLineConnectionActions.create, (state) => ({
      ...state,
      sponsorSponsorLineConnectionIsSubmitting: true,
    })),
    on(
      sponsorSponsorLineConnectionActions.createdSuccessfully,
      (state, action) => {
        const newList = [
          ...state.allSponsorSponsorLineConnections,
          action.currentSponsorSponsorLineConnection,
        ];
        const sortedConnections = SortService.sort(newList, 'title');
        return {
          ...state,
          sponsorSponsorLineConnectionIsSubmitting: false,
          currentSponsorSponsorLineConnection:
            action.currentSponsorSponsorLineConnection,
          allSponsorSponsorLineConnections: sortedConnections,
        };
      },
    ),
    on(sponsorSponsorLineConnectionActions.createFailure, (state, action) => ({
      ...state,
      sponsorSponsorLineConnectionIsSubmitting: false,
      errors: action,
    })),

    // get actions
    on(sponsorSponsorLineConnectionActions.get, (state) => ({
      ...state,
      sponsorSponsorLineConnectionIsLoading: true,
    })),
    on(sponsorSponsorLineConnectionActions.getItemSuccess, (state, action) => ({
      ...state,
      sponsorSponsorLineConnectionIsLoading: false,
      currentSponsorSponsorLineConnection:
        action.currentSponsorSponsorLineConnection,
    })),
    on(sponsorSponsorLineConnectionActions.getItemFailure, (state, action) => ({
      ...state,
      sponsorSponsorLineConnectionIsLoading: false,
      errors: action,
    })),

    on(sponsorSponsorLineConnectionActions.getAll, (state) => ({
      ...state,
      sponsorSponsorLineConnectionIsLoading: true,
    })),
    on(sponsorSponsorLineConnectionActions.getAllSuccess, (state, action) => {
      const sortedConnections = SortService.sort(
        action.allSponsorSponsorLineConnections,
        'title',
      );
      return {
        ...state,
        sponsorSponsorLineConnectionIsLoading: false,
        allSponsorSponsorLineConnections: sortedConnections,
      };
    }),
    on(sponsorSponsorLineConnectionActions.getAllFailure, (state, action) => ({
      ...state,
      sponsorSponsorLineConnectionIsLoading: false,
      errors: action,
    })),
  ),
});

export const {
  name: sponsorSponsorLineConnectionFeatureKey,
  reducer: sponsorLineReducer,
  selectSponsorSponsorLineConnectionId,
  selectSponsorSponsorLineConnectionIsLoading,
  selectSponsorSponsorLineConnectionIsSubmitting,
  selectCurrentSponsorSponsorLineConnection,
  selectAllSponsorSponsorLineConnections,
} = sponsorSponsorLineConnectionFeature;
