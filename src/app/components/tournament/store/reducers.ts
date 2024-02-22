import { createFeature, createReducer, on } from '@ngrx/store';
import {
  crudStoreInterface,
  getDefaultCrudStore,
} from '../../../type/store.intarface';
import { tournamentActions } from './actions';
import { ITournament } from '../../../type/tournament.type';
import { SortService } from '../../../services/sort.service';

export interface TournamentState extends crudStoreInterface {
  currentTournament: ITournament | undefined | null;
  allTournaments: ITournament[];
  allSeasonSportTournaments: ITournament[];
}

const initialState: TournamentState = {
  ...getDefaultCrudStore(),
  allTournaments: [],
  allSeasonSportTournaments: [],
  currentTournament: null,
};

const tournamentFeature = createFeature({
  name: 'tournament',
  reducer: createReducer(
    initialState,

    // create actions
    on(tournamentActions.create, (state) => ({
      ...state,
      isSubmitting: true,
    })),
    on(tournamentActions.createdSuccessfully, (state, action) => {
      const newList = [...state.allTournaments, action.currentTournament];
      const sortedTournaments = SortService.sort(newList, 'title');
      return {
        ...state,
        isSubmitting: false,
        currentTournament: action.currentTournament,
        allTournaments: sortedTournaments, // sorted list
      };
    }),
    on(tournamentActions.createFailure, (state, action) => ({
      ...state,
      isSubmitting: false,
      errors: action,
    })),

    // delete actions
    on(tournamentActions.delete, (state) => ({
      ...state,
      isSubmitting: true,
    })),
    on(tournamentActions.deletedSuccessfully, (state, action) => ({
      ...state,
      isSubmitting: false,
      allTournaments: (state.allTournaments || []).filter(
        (item) => item.id !== action.id,
      ),
      errors: null,
    })),
    on(tournamentActions.deleteFailure, (state, action) => ({
      ...state,
      isSubmitting: false,
      errors: action,
    })),

    // update actions
    on(tournamentActions.update, (state) => ({
      ...state,
      isSubmitting: true,
    })),
    on(tournamentActions.updatedSuccessfully, (state, action) => ({
      ...state,
      isSubmitting: false,
      currentTournament: action.updatedTournament,
      allTournaments: state.allTournaments.map((item) =>
        item.id === action.updatedTournament.id
          ? action.updatedTournament
          : item,
      ),
      errors: null,
    })),
    on(tournamentActions.updateFailure, (state, action) => ({
      ...state,
      isSubmitting: false,
      errors: action,
    })),

    // get actions
    on(tournamentActions.get, (state) => ({
      ...state,
      isLoading: true,
    })),
    on(tournamentActions.getItemSuccess, (state, action) => ({
      ...state,
      isLoading: false,
      currentTournament: action.tournament,
    })),
    on(tournamentActions.getItemFailure, (state, action) => ({
      ...state,
      isLoading: false,
      errors: action,
    })),

    on(tournamentActions.getAll, (state) => ({
      ...state,
      isLoading: true,
    })),
    on(tournamentActions.getAllItemsSuccess, (state, action) => ({
      ...state,
      isLoading: false,
      allTournaments: action.tournaments,
    })),
    on(tournamentActions.getAllItemsFailure, (state, action) => ({
      ...state,
      isLoading: false,
      errors: action,
    })),

    on(tournamentActions.getTournamentsBySportAndSeason, (state) => ({
      ...state,
      isLoading: true,
    })),
    on(
      tournamentActions.getTournamentsBySportAndSeasonSuccess,
      (state, action) => {
        const sortedTournaments = SortService.sort(action.tournaments, 'title');
        return {
          ...state,
          isLoading: false,
          allSeasonSportTournaments: sortedTournaments,
        };
      },
    ),
    on(
      tournamentActions.getTournamentsBySportAndSeasonFailure,
      (state, action) => ({
        ...state,
        isLoading: false,
        errors: action,
      }),
    ),
  ),
});

export const {
  name: tournamentFeatureKey,
  reducer: tournamentReducer,
  selectIsSubmitting,
  selectIsLoading,
  selectCurrentTournament,
  selectAllTournaments,
  selectAllSeasonSportTournaments,
} = tournamentFeature;
