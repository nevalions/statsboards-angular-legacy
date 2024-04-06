import { createFeature, createReducer, on } from '@ngrx/store';
import { SortService } from '../../../../services/sort.service';
import { sponsorLineActions } from './actions';
import {
  ISponsorLine,
  ISponsorLineFullData,
} from '../../../../type/sponsor.type';

export interface SponsorLineState {
  sponsorLineIsLoading: boolean;
  sponsorLineIsSubmitting: boolean;
  currentSponsorLineId: number | undefined | null;
  currentSponsorLine: ISponsorLine | undefined | null;
  currentSponsorLineWithFullData: ISponsorLineFullData | undefined | null;
  allSponsorLines: ISponsorLine[];
  errors: any | undefined | null;
}

const initialState: SponsorLineState = {
  sponsorLineIsLoading: false,
  sponsorLineIsSubmitting: false,
  currentSponsorLineId: null,
  allSponsorLines: [],
  currentSponsorLine: null,
  currentSponsorLineWithFullData: null,
  errors: null,
};

const sponsorLineFeature = createFeature({
  name: 'sponsorLine',
  reducer: createReducer(
    initialState,
    on(sponsorLineActions.getId, (state) => ({
      ...state,
      sponsorLineIsLoading: true,
    })),
    on(sponsorLineActions.getSponsorLineIdSuccessfully, (state, action) => ({
      ...state,
      sponsorLineIsLoading: false,
      currentSponsorLineId: action.sponsorLineId,
    })),
    on(sponsorLineActions.getSponsorLineIdFailure, (state) => ({
      ...state,
      sponsorLineIsLoading: false,
    })),

    // create actions
    on(sponsorLineActions.create, (state) => ({
      ...state,
      sponsorLineIsSubmitting: true,
    })),
    on(sponsorLineActions.createdSuccessfully, (state, action) => {
      const newList = [...state.allSponsorLines, action.currentSponsorLine];
      const sortedTournaments = SortService.sort(newList, 'title');
      return {
        ...state,
        sponsorLineIsSubmitting: false,
        currentSponsorLine: action.currentSponsorLine,
        allSponsorLines: sortedTournaments,
      };
    }),
    on(sponsorLineActions.createFailure, (state, action) => ({
      ...state,
      sponsorLineIsSubmitting: false,
      errors: action,
    })),

    // // delete actions
    // on(sponsorLineActions.delete, (state) => ({
    //   ...state,
    //   sponsorLineIsSubmitting: true,
    // })),
    // on(sponsorLineActions.deletedSuccessfully, (state, action) => ({
    //   ...state,
    //   sponsorLineIsSubmitting: false,
    //   itemsList: (state.allSponsorLines || []).filter((item) => item.id !== action.id),
    //   errors: null,
    // })),
    // on(sponsorLineActions.deleteFailure, (state, action) => ({
    //   ...state,
    //   sponsorLineIsSubmitting: false,
    //   errors: action,
    // })),
    //
    // // update actions
    // on(sponsorLineActions.update, (state) => ({
    //   ...state,
    //   sponsorLineIsSubmitting: true,
    // })),
    // on(sponsorLineActions.updatedSuccessfully, (state, action) => ({
    //   ...state,
    //   sponsorLineIsSubmitting: false,
    //   currentSponsorLine: action.updatedSponsorLine,
    //   allSponsorLines: state.allSponsorLines.map((item) =>
    //     item.id === action.updatedSponsorLine.id ? action.updatedSponsorLine : item,
    //   ),
    //   errors: null,
    // })),
    // on(sponsorLineActions.updateFailure, (state, action) => ({
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
    on(sponsorLineActions.get, (state) => ({
      ...state,
      sponsorLineIsLoading: true,
    })),
    on(sponsorLineActions.getItemSuccess, (state, action) => ({
      ...state,
      sponsorLineIsLoading: false,
      currentSponsorLine: action.currentSponsorLine,
    })),
    on(sponsorLineActions.getItemFailure, (state, action) => ({
      ...state,
      sponsorLineIsLoading: false,
      errors: action,
    })),

    on(sponsorLineActions.getFullDataSponsorLine, (state) => ({
      ...state,
      sponsorLineIsLoading: true,
    })),
    on(sponsorLineActions.getFullDataSponsorLineSuccess, (state, action) => ({
      ...state,
      sponsorLineIsLoading: false,
      currentSponsorLine: action.currentSponsorLineWithFullData.sponsor_line,
      currentSponsorLineWithFullData: action.currentSponsorLineWithFullData,
    })),
    on(sponsorLineActions.getFullDataSponsorLineFailure, (state, action) => ({
      ...state,
      sponsorLineIsLoading: false,
      errors: action,
    })),

    on(sponsorLineActions.getAll, (state) => ({
      ...state,
      sponsorLineIsLoading: true,
    })),
    on(sponsorLineActions.getAllSuccess, (state, action) => {
      const sortedSponsorLines = SortService.sort(
        action.allSponsorLines,
        'title',
      );
      return {
        ...state,
        sponsorLineIsLoading: false,
        allSponsorLines: sortedSponsorLines,
      };
    }),
    on(sponsorLineActions.getAllFailure, (state, action) => ({
      ...state,
      sponsorLineIsLoading: false,
      errors: action,
    })),
    //
    // on(sponsorLineActions.getSponsorLinesBySportId, (state) => ({
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
    // on(sponsorLineActions.getSponsorLinesBySportIDFailure, (state, action) => ({
    //   ...state,
    //   sponsorLineIsLoading: false,
    //   errors: action,
    // })),
    //
    // on(sponsorLineActions.getSponsorLinesByTournamentId, (state) => ({
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
    // on(sponsorLineActions.getSponsorLinesByTournamentIDFailure, (state, action) => ({
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
    // on(sponsorLineActions.removeSponsorLineFromTournament, (state, action) => ({
    //   ...state,
    //   allSponsorLinesInTournament: state.allSponsorLinesInTournament.filter(
    //     (store) => store.id !== action.id,
    //   ),
    // })),
  ),
});

export const {
  name: sponsorLineFeatureKey,
  reducer: sponsorLineReducer,
  selectSponsorLineIsLoading,
  selectSponsorLineIsSubmitting,
  selectCurrentSponsorLineId,
  selectCurrentSponsorLine,
  selectAllSponsorLines,
  selectCurrentSponsorLineWithFullData,
} = sponsorLineFeature;
