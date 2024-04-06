import { createFeature, createReducer, on } from '@ngrx/store';
import { ISponsor } from '../../../../type/sponsor.type';
import { sponsorActions } from './actions';
import { SortService } from '../../../../services/sort.service';

export interface SponsorState {
  sponsorIsLoading: boolean;
  sponsorIsSubmitting: boolean;
  currentSponsorId: number | undefined | null;
  currentSponsor: ISponsor | undefined | null;
  allSponsors: ISponsor[];
  errors: any | undefined | null;
}

const initialState: SponsorState = {
  sponsorIsLoading: false,
  sponsorIsSubmitting: false,
  currentSponsorId: null,
  allSponsors: [],
  currentSponsor: null,
  errors: null,
};

const sponsorFeature = createFeature({
  name: 'sponsor',
  reducer: createReducer(
    initialState,
    on(sponsorActions.getId, (state) => ({
      ...state,
      sponsorIsLoading: true,
    })),
    on(sponsorActions.getSponsorIdSuccessfully, (state, action) => ({
      ...state,
      sponsorIsLoading: false,
      currentTournamentId: action.sponsorId,
    })),
    on(sponsorActions.getSponsorIdFailure, (state) => ({
      ...state,
      sponsorIsLoading: false,
    })),

    // create actions
    on(sponsorActions.create, (state) => ({
      ...state,
      sponsorIsSubmitting: true,
    })),
    on(sponsorActions.createdSuccessfully, (state, action) => {
      const newList = [...state.allSponsors, action.currentSponsor];
      const sortedTournaments = SortService.sort(newList, 'title');
      return {
        ...state,
        sponsorIsSubmitting: false,
        currentSponsor: action.currentSponsor,
        allSponsors: sortedTournaments,
      };
    }),
    on(sponsorActions.createFailure, (state, action) => ({
      ...state,
      sponsorIsSubmitting: false,
      errors: action,
    })),

    // // delete actions
    // on(sponsorActions.delete, (state) => ({
    //   ...state,
    //   sponsorIsSubmitting: true,
    // })),
    // on(sponsorActions.deletedSuccessfully, (state, action) => ({
    //   ...state,
    //   sponsorIsSubmitting: false,
    //   itemsList: (state.allSponsors || []).filter((item) => item.id !== action.id),
    //   errors: null,
    // })),
    // on(sponsorActions.deleteFailure, (state, action) => ({
    //   ...state,
    //   sponsorIsSubmitting: false,
    //   errors: action,
    // })),
    //
    // // update actions
    // on(sponsorActions.update, (state) => ({
    //   ...state,
    //   sponsorIsSubmitting: true,
    // })),
    // on(sponsorActions.updatedSuccessfully, (state, action) => ({
    //   ...state,
    //   sponsorIsSubmitting: false,
    //   currentSponsor: action.updatedSponsor,
    //   allSponsors: state.allSponsors.map((item) =>
    //     item.id === action.updatedSponsor.id ? action.updatedSponsor : item,
    //   ),
    //   errors: null,
    // })),
    // on(sponsorActions.updateFailure, (state, action) => ({
    //   ...state,
    //   sponsorIsSubmitting: false,
    //   errors: action,
    // })),
    // on(sponsorActions.updateAllSponsorsInSport, (state, { newSponsor }) => {
    //   const newList = [...state.allSponsorsInSport, newSponsor];
    //   const sortedSponsors = SortService.sort(newList, 'title');
    //   return {
    //     ...state,
    //     allSponsorsInSport: sortedSponsors,
    //   };
    // }),
    //
    // get actions
    on(sponsorActions.get, (state) => ({
      ...state,
      sponsorIsLoading: true,
    })),
    on(sponsorActions.getItemSuccess, (state, action) => ({
      ...state,
      sponsorIsLoading: false,
      currentSponsor: action.currentSponsor,
    })),
    on(sponsorActions.getItemFailure, (state, action) => ({
      ...state,
      sponsorIsLoading: false,
      errors: action,
    })),

    on(sponsorActions.getAll, (state) => ({
      ...state,
      sponsorIsLoading: true,
    })),
    on(sponsorActions.getAllSuccess, (state, action) => {
      const sortedSponsors = SortService.sort(action.allSponsors, 'title');
      return {
        ...state,
        sponsorIsLoading: false,
        allSponsors: sortedSponsors,
      };
    }),
    on(sponsorActions.getAllFailure, (state, action) => ({
      ...state,
      sponsorIsLoading: false,
      errors: action,
    })),
    //
    // on(sponsorActions.getSponsorsBySportId, (state) => ({
    //   ...state,
    //   sponsorIsLoading: true,
    // })),
    // on(sponsorActions.getSponsorsBySportIDSuccess, (state, action) => {
    //   const sortedTournaments = SortService.sort(action.sponsors, 'title');
    //   return {
    //     ...state,
    //     sponsorIsLoading: false,
    //     allSponsorsInSport: sortedTournaments,
    //   };
    // }),
    // on(sponsorActions.getSponsorsBySportIDFailure, (state, action) => ({
    //   ...state,
    //   sponsorIsLoading: false,
    //   errors: action,
    // })),
    //
    // on(sponsorActions.getSponsorsByTournamentId, (state) => ({
    //   ...state,
    //   sponsorIsLoading: true,
    // })),
    // on(sponsorActions.getSponsorsByTournamentIDSuccess, (state, action) => {
    //   const sortedSponsors = SortService.sort(action.sponsors, 'title');
    //   return {
    //     ...state,
    //     sponsorIsLoading: false,
    //     allSponsorsInTournament: sortedSponsors,
    //   };
    // }),
    // on(sponsorActions.getSponsorsByTournamentIDFailure, (state, action) => ({
    //   ...state,
    //   sponsorIsLoading: false,
    //   errors: action,
    // })),
    //
    // on(sponsorActions.addSponsorToTournament, (state, { sponsor_id }) => {
    //   const sponsorToAdd = state.allSponsorsInSport.find(
    //     (store) => store.id === sponsor_id,
    //   );
    //   if (!sponsorToAdd) {
    //     // console.log(store.allSponsorsInSport);
    //     console.log(`No store found with id: ${sponsor_id}`);
    //     return state;
    //   }
    //   // console.log(`Sponsor with id: ${sponsor_id} added to the tournament.`);
    //   const newList = [...state.allSponsorsInTournament, sponsorToAdd];
    //   const sortedList = SortService.sort(newList, 'title');
    //   return {
    //     ...state,
    //     allSponsorsInTournament: sortedList,
    //   };
    // }),
    //
    // on(sponsorActions.removeSponsorFromTournament, (state, action) => ({
    //   ...state,
    //   allSponsorsInTournament: state.allSponsorsInTournament.filter(
    //     (store) => store.id !== action.id,
    //   ),
    // })),
  ),
});

export const {
  name: sponsorFeatureKey,
  reducer: sponsorReducer,
  selectSponsorIsLoading,
  selectSponsorIsSubmitting,
  selectCurrentSponsorId,
  selectCurrentSponsor,
  selectAllSponsors,
} = sponsorFeature;
