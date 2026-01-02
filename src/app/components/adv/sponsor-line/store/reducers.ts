import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createFeature, createSelector, createReducer, on } from '@ngrx/store';
import {
  ISponsorLine,
  ISponsorLineFullData,
} from '../../../../type/sponsor.type';
import { sponsorLineActions } from './actions';

export interface SponsorLineState extends EntityState<ISponsorLine> {
  sponsorLineIsLoading: boolean;
  sponsorLineIsSubmitting: boolean;
  currentSponsorLineId: number | undefined | null;
  currentSponsorLine: ISponsorLine | undefined | null;
  currentSponsorLineWithFullData: ISponsorLineFullData | undefined | null;
  currentMatchSponsorLineWithFullData: ISponsorLineFullData | undefined | null;
  errors: any | undefined | null;
}

const adapter = createEntityAdapter<ISponsorLine>({
  sortComparer: (a, b) => a.title.localeCompare(b.title),
});

const initialState: SponsorLineState = adapter.getInitialState({
  sponsorLineIsLoading: false,
  sponsorLineIsSubmitting: false,
  currentSponsorLineId: null,
  currentSponsorLine: null,
  currentSponsorLineWithFullData: null,
  currentMatchSponsorLineWithFullData: null,
  errors: null,
});

const sponsorLineFeature = createFeature({
  name: 'sponsorLine',
  reducer: createReducer(
    initialState,
    on(
      sponsorLineActions.getId,
      (state): SponsorLineState => ({
        ...state,
        sponsorLineIsLoading: true,
      }),
    ),
    on(
      sponsorLineActions.getSponsorLineIdSuccessfully,
      (state, action): SponsorLineState => ({
        ...state,
        sponsorLineIsLoading: false,
        currentSponsorLineId: action.sponsorLineId,
      }),
    ),
    on(
      sponsorLineActions.getSponsorLineIdFailure,
      (state): SponsorLineState => ({
        ...state,
        sponsorLineIsLoading: false,
      }),
    ),

    // create actions
    on(
      sponsorLineActions.create,
      (state): SponsorLineState => ({
        ...state,
        sponsorLineIsSubmitting: true,
      }),
    ),
    on(sponsorLineActions.createdSuccessfully, (state, action) =>
      adapter.addOne(action.currentSponsorLine, {
        ...state,
        sponsorLineIsSubmitting: false,
        currentSponsorLine: action.currentSponsorLine,
      }),
    ),
    on(
      sponsorLineActions.createFailure,
      (state, action): SponsorLineState => ({
        ...state,
        sponsorLineIsSubmitting: false,
        errors: action,
      }),
    ),

    // // delete actions
    // on(sponsorLineActions.delete, (state): SponsorLineState => ({
    //   ...state,
    //   sponsorLineIsSubmitting: true,
    // })),
    // on(sponsorLineActions.deletedSuccessfully, (state, action): SponsorLineState => ({
    //   ...state,
    //   sponsorLineIsSubmitting: false,
    //   itemsList: (state.allSponsorLines || []).filter((item) => item.id !== action.id),
    //   errors: null,
    // })),
    // on(sponsorLineActions.deleteFailure, (state, action): SponsorLineState => ({
    //   ...state,
    //   sponsorLineIsSubmitting: false,
    //   errors: action,
    // })),
    //
    // // update actions
    // on(sponsorLineActions.update, (state): SponsorLineState => ({
    //   ...state,
    //   sponsorLineIsSubmitting: true,
    // })),
    // on(sponsorLineActions.updatedSuccessfully, (state, action): SponsorLineState => ({
    //   ...state,
    //   sponsorLineIsSubmitting: false,
    //   currentSponsorLine: action.updatedSponsorLine,
    //   allSponsorLines: state.allSponsorLines.map((item) =>
    //     item.id === action.updatedSponsorLine.id ? action.updatedSponsorLine : item,
    //   ),
    //   errors: null,
    // })),
    // on(sponsorLineActions.updateFailure, (state, action): SponsorLineState => ({
    //   ...state,
    //   sponsorLineIsSubmitting: false,
    //   errors: action,
    // })),
    // on(sponsorLineActions.updateAllSponsorLinesInSport, (state, { newSponsorLine }) => {
    //   const newList = [...state.allSponsorLinesInSport, newSponsorLine];
    //   const sortedSponsorLines = SortService.sort(newList, 'title');
    //   return {
    //     ...state,
    //     allSponsorLinesInSport: sortedSponsorLines,
    //   };
    // }),
    //
    // get actions
    on(
      sponsorLineActions.get,
      (state): SponsorLineState => ({
        ...state,
        sponsorLineIsLoading: true,
      }),
    ),
    on(
      sponsorLineActions.getItemSuccess,
      (state, action): SponsorLineState => ({
        ...state,
        sponsorLineIsLoading: false,
        currentSponsorLine: action.currentSponsorLine,
      }),
    ),
    on(
      sponsorLineActions.getItemFailure,
      (state, action): SponsorLineState => ({
        ...state,
        sponsorLineIsLoading: false,
        errors: action,
      }),
    ),

    on(
      sponsorLineActions.getFullDataSponsorLine,
      (state): SponsorLineState => ({
        ...state,
        sponsorLineIsLoading: true,
      }),
    ),
    on(
      sponsorLineActions.getFullDataSponsorLineSuccess,
      (state, action): SponsorLineState => ({
        ...state,
        sponsorLineIsLoading: false,
        currentSponsorLine: action.currentSponsorLineWithFullData.sponsor_line,
        currentSponsorLineWithFullData: action.currentSponsorLineWithFullData,
      }),
    ),
    on(
      sponsorLineActions.getFullDataSponsorLineFailure,
      (state, action): SponsorLineState => ({
        ...state,
        sponsorLineIsLoading: false,
        errors: action,
      }),
    ),

    //Match Sponsor Line
    on(
      sponsorLineActions.getFullDataMatchSponsorLine,
      (state): SponsorLineState => ({
        ...state,
        sponsorLineIsLoading: true,
      }),
    ),
    on(
      sponsorLineActions.getFullDataMatchSponsorLineSuccess,
      (state, action): SponsorLineState => ({
        ...state,
        sponsorLineIsLoading: false,
        currentMatchSponsorLineWithFullData:
          action.currentMatchSponsorLineWithFullData,
      }),
    ),
    on(
      sponsorLineActions.getFullDataMatchSponsorLineFailure,
      (state, action): SponsorLineState => ({
        ...state,
        sponsorLineIsLoading: false,
        errors: action,
      }),
    ),

    on(
      sponsorLineActions.getAll,
      (state): SponsorLineState => ({
        ...state,
        sponsorLineIsLoading: true,
      }),
    ),
    on(sponsorLineActions.getAllSuccess, (state, action) =>
      adapter.setAll(action.allSponsorLines, {
        ...state,
        sponsorLineIsLoading: false,
      }),
    ),
    on(
      sponsorLineActions.getAllFailure,
      (state, action): SponsorLineState => ({
        ...state,
        sponsorLineIsLoading: false,
        errors: action,
      }),
    ),
    //
    // on(sponsorLineActions.getSponsorLinesBySportId, (state): SponsorLineState => ({
    //   ...state,
    //   sponsorLineIsLoading: true,
    // })),
    // on(sponsorLineActions.getSponsorLinesBySportIDSuccess, (state, action) => {
    //   const sortedTournaments = SortService.sort(action.sponsorLines, 'title');
    //   return {
    //     ...state,
    //     sponsorLineIsLoading: false,
    //     allSponsorLinesInSport: sortedTournaments,
    //   };
    // }),
    // on(sponsorLineActions.getSponsorLinesBySportIDFailure, (state, action): SponsorLineState => ({
    //   ...state,
    //   sponsorLineIsLoading: false,
    //   errors: action,
    // })),
    //
    // on(sponsorLineActions.getSponsorLinesByTournamentId, (state): SponsorLineState => ({
    //   ...state,
    //   sponsorLineIsLoading: true,
    // })),
    // on(sponsorLineActions.getSponsorLinesByTournamentIDSuccess, (state, action) => {
    //   const sortedSponsorLines = SortService.sort(action.sponsorLines, 'title');
    //   return {
    //     ...state,
    //     sponsorLineIsLoading: false,
    //     allSponsorLinesInTournament: sortedSponsorLines,
    //   };
    // }),
    // on(sponsorLineActions.getSponsorLinesByTournamentIDFailure, (state, action): SponsorLineState => ({
    //   ...state,
    //   sponsorLineIsLoading: false,
    //   errors: action,
    // })),
    //
    // on(sponsorLineActions.addSponsorLineToTournament, (state, { sponsorLine_id }) => {
    //   const sponsorLineToAdd = state.allSponsorLinesInSport.find(
    //     (store) => store.id === sponsorLine_id,
    //   );
    //   if (!sponsorLineToAdd) {
    //     // console.log(store.allSponsorLinesInSport);
    //     console.log(`No store found with id: ${sponsorLine_id}`);
    //     return state;
    //   }
    //   // console.log(`SponsorLine with id: ${sponsorLine_id} added to the tournament.`);
    //   const newList = [...state.allSponsorLinesInTournament, sponsorLineToAdd];
    //   const sortedList = SortService.sort(newList, 'title');
    //   return {
    //     ...state,
    //     allSponsorLinesInTournament: sortedList,
    //   };
    // }),
    //
    // on(sponsorLineActions.removeSponsorLineFromTournament, (state, action): SponsorLineState => ({
    //   ...state,
    //   allSponsorLinesInTournament: state.allSponsorLinesInTournament.filter(
    //     (store) => store.id !== action.id,
    //   ),
    // })),
  ),
});

const { selectAll } = adapter.getSelectors();

export const {
  name: sponsorLineFeatureKey,
  reducer: sponsorLineReducer,
  selectSponsorLineIsLoading,
  selectSponsorLineIsSubmitting,
  selectCurrentSponsorLineId,
  selectCurrentSponsorLine,
  selectSponsorLineState,
} = sponsorLineFeature;

export const selectAllSponsorLines = createSelector(
  selectSponsorLineState,
  selectAll,
);
