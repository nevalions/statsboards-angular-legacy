import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createFeature, createSelector, createReducer, on } from '@ngrx/store';
import { sponsorSponsorLineConnectionActions } from './actions';
import { ISponsorLineConnection } from '../../../../type/sponsor.type';

export interface SponsorSponsorLineConnectionState extends EntityState<ISponsorLineConnection> {
  sponsorSponsorLineConnectionIsLoading: boolean;
  sponsorSponsorLineConnectionIsSubmitting: boolean;
  sponsorSponsorLineConnectionId: number | undefined | null;
  currentSponsorSponsorLineConnection:
    | ISponsorLineConnection
    | undefined
    | null;
  errors: any | undefined | null;
}

const adapter = createEntityAdapter<ISponsorLineConnection>({
  sortComparer: false,
});

const initialState: SponsorSponsorLineConnectionState = adapter.getInitialState(
  {
    sponsorSponsorLineConnectionIsLoading: false,
    sponsorSponsorLineConnectionIsSubmitting: false,
    sponsorSponsorLineConnectionId: null,
    currentSponsorSponsorLineConnection: null,
    errors: null,
  },
);

const sponsorSponsorLineConnectionFeature = createFeature({
  name: 'sponsorSponsorLineConnection',
  reducer: createReducer(
    initialState,
    on(
      sponsorSponsorLineConnectionActions.getId,
      (state): SponsorSponsorLineConnectionState => ({
        ...state,
        sponsorSponsorLineConnectionIsLoading: true,
      }),
    ),
    on(
      sponsorSponsorLineConnectionActions.getSponsorSponsorLineConnectionIdSuccessfully,
      (state, action): SponsorSponsorLineConnectionState => ({
        ...state,
        sponsorSponsorLineConnectionIsLoading: false,
        sponsorSponsorLineConnectionId: action.sponsorSponsorLineConnectionId,
      }),
    ),
    on(
      sponsorSponsorLineConnectionActions.getSponsorSponsorLineConnectionIdFailure,
      (state): SponsorSponsorLineConnectionState => ({
        ...state,
        sponsorSponsorLineConnectionIsLoading: false,
      }),
    ),

    // create actions
    on(
      sponsorSponsorLineConnectionActions.create,
      (state): SponsorSponsorLineConnectionState => ({
        ...state,
        sponsorSponsorLineConnectionIsSubmitting: true,
      }),
    ),
    on(
      sponsorSponsorLineConnectionActions.createdSuccessfully,
      (state, action) =>
        adapter.addOne(action.currentSponsorSponsorLineConnection, {
          ...state,
          sponsorSponsorLineConnectionIsSubmitting: false,
          currentSponsorSponsorLineConnection:
            action.currentSponsorSponsorLineConnection,
        }),
    ),
    on(
      sponsorSponsorLineConnectionActions.createFailure,
      (state, action): SponsorSponsorLineConnectionState => ({
        ...state,
        sponsorSponsorLineConnectionIsSubmitting: false,
        errors: action,
      }),
    ),

    // get actions
    on(
      sponsorSponsorLineConnectionActions.get,
      (state): SponsorSponsorLineConnectionState => ({
        ...state,
        sponsorSponsorLineConnectionIsLoading: true,
      }),
    ),
    on(
      sponsorSponsorLineConnectionActions.getItemSuccess,
      (state, action): SponsorSponsorLineConnectionState => ({
        ...state,
        sponsorSponsorLineConnectionIsLoading: false,
        currentSponsorSponsorLineConnection:
          action.currentSponsorSponsorLineConnection,
      }),
    ),
    on(
      sponsorSponsorLineConnectionActions.getItemFailure,
      (state, action): SponsorSponsorLineConnectionState => ({
        ...state,
        sponsorSponsorLineConnectionIsLoading: false,
        errors: action,
      }),
    ),

    on(
      sponsorSponsorLineConnectionActions.getAll,
      (state): SponsorSponsorLineConnectionState => ({
        ...state,
        sponsorSponsorLineConnectionIsLoading: true,
      }),
    ),
    on(sponsorSponsorLineConnectionActions.getAllSuccess, (state, action) =>
      adapter.setAll(action.allSponsorSponsorLineConnections, {
        ...state,
        sponsorSponsorLineConnectionIsLoading: false,
      }),
    ),
    on(
      sponsorSponsorLineConnectionActions.getAllFailure,
      (state, action): SponsorSponsorLineConnectionState => ({
        ...state,
        sponsorSponsorLineConnectionIsLoading: false,
        errors: action,
      }),
    ),
  ),
});

const { selectAll } = adapter.getSelectors();

export const {
  name: sponsorSponsorLineConnectionFeatureKey,
  reducer: sponsorSponsorLineConnectionReducer,
  selectSponsorSponsorLineConnectionId,
  selectSponsorSponsorLineConnectionIsLoading,
  selectSponsorSponsorLineConnectionIsSubmitting,
  selectCurrentSponsorSponsorLineConnection,
  selectSponsorSponsorLineConnectionState,
} = sponsorSponsorLineConnectionFeature;

export const selectAllSponsorSponsorLineConnections = createSelector(
  selectSponsorSponsorLineConnectionState,
  selectAll,
);
