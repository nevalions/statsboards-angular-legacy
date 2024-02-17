import { createFeature, createReducer, on } from '@ngrx/store';
import {
  crudStoreInterface,
  getDefaultCrudStore,
} from '../../../type/store.intarface';
import { tournamentActions } from './actions';
import { ITournament } from '../../../type/tournament.type';
import { SortService } from '../../../services/sort.service';

export interface TournamentState extends crudStoreInterface<ITournament> {}

const initialState: TournamentState = getDefaultCrudStore<ITournament>();

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
      const newList = [...state.itemsList, action.currentTournament];
      const sortedTournaments = SortService.sort(newList, 'title');
      return {
        ...state,
        isSubmitting: false,
        currentItem: action.currentTournament,
        itemsList: sortedTournaments, // sorted list
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
      itemsList: (state.itemsList || []).filter(
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
      currentItem: action.updatedTournament,
      itemsList: state.itemsList.map((item) =>
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
      currentItem: action.tournament,
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
      itemsList: action.tournaments,
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
          itemsList: sortedTournaments,
        };
      },
    ),
    on(
      tournamentActions.getTournamentsBySportAndSeasonSuccess,
      (state, action) => ({
        ...state,
        isLoading: false,
        itemsList: action.tournaments,
      }),
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
  selectCurrentItem,
  selectItemsList,
} = tournamentFeature;
