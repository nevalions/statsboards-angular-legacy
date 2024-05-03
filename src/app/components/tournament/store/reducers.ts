import { createFeature, createReducer, on } from '@ngrx/store';
import { tournamentActions } from './actions';
import { ITournament } from '../../../type/tournament.type';
import { SortService } from '../../../services/sort.service';
import { ISponsor } from '../../../type/sponsor.type';

export interface TournamentState {
  isTournamentSubmitting: boolean;
  isTournamentLoading: boolean;
  currentTournamentId: number | undefined | null;
  currentTournament: ITournament | undefined | null;
  currentTournamentMainSponsor: ISponsor | undefined | null;
  currentTournamentSponsorLineId: number | undefined | null;
  allTournaments: ITournament[];
  allSeasonSportTournaments: ITournament[];
  errors: any;
}

const initialState: TournamentState = {
  isTournamentSubmitting: false,
  isTournamentLoading: false,
  currentTournamentId: null,
  allTournaments: [],
  allSeasonSportTournaments: [],
  currentTournamentSponsorLineId: null,
  currentTournament: null,
  currentTournamentMainSponsor: null,
  errors: null,
};

const tournamentFeature = createFeature({
  name: 'tournament',
  reducer: createReducer(
    initialState,
    on(tournamentActions.getId, (state) => ({
      ...state,
      isTournamentLoading: true,
    })),
    on(tournamentActions.getTournamentIdSuccessfully, (state, action) => ({
      ...state,
      isTournamentLoading: false,
      currentTournamentId: action.tournamentId,
    })),
    on(tournamentActions.getTournamentIdFailure, (state) => ({
      ...state,
      isTournamentLoading: false,
    })),

    on(tournamentActions.getMainSponsorByTournamentId, (state) => ({
      ...state,
      isTournamentLoading: true,
    })),
    on(tournamentActions.getMainSponsorSuccess, (state, action) => ({
      ...state,
      isTournamentLoading: false,
      currentTournamentMainSponsor: action.mainSponsor,
    })),
    on(tournamentActions.getMainSponsorFailure, (state) => ({
      ...state,
      isTournamentLoading: false,
    })),

    // create actions
    on(tournamentActions.create, (state) => ({
      ...state,
      isTournamentSubmitting: true,
    })),
    on(tournamentActions.createdSuccessfully, (state, action) => {
      const newList = [...state.allTournaments, action.currentTournament];
      const sortedTournaments = SortService.sort(newList, 'title');
      const newListSeasonSportTournaments = [
        ...state.allSeasonSportTournaments,
        action.currentTournament,
      ];
      const sorterSeasonSportTournaments = SortService.sort(
        newListSeasonSportTournaments,
        'title',
      );
      return {
        ...state,
        isTournamentSubmitting: false,
        currentTournament: action.currentTournament,
        allTournaments: sortedTournaments,
        allSeasonSportTournaments: sorterSeasonSportTournaments,
      };
    }),
    on(tournamentActions.createFailure, (state, action) => ({
      ...state,
      isTournamentSubmitting: false,
      errors: action,
    })),

    // delete actions
    on(tournamentActions.delete, (state) => ({
      ...state,
      isTournamentSubmitting: true,
    })),
    on(tournamentActions.deletedSuccessfully, (state, action) => ({
      ...state,
      isTournamentSubmitting: false,
      allTournaments: (state.allTournaments || []).filter(
        (item) => item.id !== action.tournamentId,
      ),
      allSeasonSportTournaments: (state.allSeasonSportTournaments || []).filter(
        (item) => item.id !== action.tournamentId,
      ),
      errors: null,
    })),
    on(tournamentActions.deleteFailure, (state, action) => ({
      ...state,
      isTournamentSubmitting: false,
      errors: action,
    })),

    // update actions
    on(tournamentActions.update, (state) => ({
      ...state,
      isTournamentSubmitting: true,
    })),
    on(tournamentActions.updatedSuccessfully, (state, action) => ({
      ...state,
      isTournamentSubmitting: false,
      currentTournament: action.updatedTournament,
      allTournaments: state.allTournaments.map((item) =>
        item.id === action.updatedTournament.id
          ? action.updatedTournament
          : item,
      ),
      allSeasonSportTournaments: state.allSeasonSportTournaments.map((item) =>
        item.id === action.updatedTournament.id
          ? action.updatedTournament
          : item,
      ),
      errors: null,
    })),
    on(tournamentActions.updateFailure, (state, action) => ({
      ...state,
      isTournamentSubmitting: false,
      errors: action,
    })),
    on(
      tournamentActions.updateSportSeasonTournaments,
      (state, { newTournament }) => {
        const newList = [...state.allSeasonSportTournaments, newTournament];
        const sortedTournaments = SortService.sort(newList, 'title');
        return {
          ...state,
          allSeasonSportTournaments: sortedTournaments,
        };
      },
    ),

    // get actions
    on(tournamentActions.get, (state) => ({
      ...state,
      isTournamentLoading: true,
    })),
    on(tournamentActions.getItemSuccess, (state, action) => ({
      ...state,
      isTournamentLoading: false,
      currentTournament: action.tournament,
      currentTournamentId: action.tournament.id,
      currentTournamentSponsorLineId: action.tournament.sponsor_line_id,
    })),
    on(tournamentActions.getItemFailure, (state, action) => ({
      ...state,
      isTournamentLoading: false,
      errors: action,
    })),

    on(tournamentActions.getAll, (state) => ({
      ...state,
      isTournamentLoading: true,
    })),
    on(tournamentActions.getAllItemsSuccess, (state, action) => ({
      ...state,
      isTournamentLoading: false,
      allTournaments: action.tournaments,
    })),
    on(tournamentActions.getAllItemsFailure, (state, action) => ({
      ...state,
      isTournamentLoading: false,
      errors: action,
    })),

    on(tournamentActions.getTournamentsBySportAndSeason, (state) => ({
      ...state,
      isTournamentLoading: true,
    })),
    on(
      tournamentActions.getTournamentsBySportAndSeasonSuccess,
      (state, action) => {
        const sortedTournaments = SortService.sort(action.tournaments, 'title');
        return {
          ...state,
          isTournamentLoading: false,
          allSeasonSportTournaments: sortedTournaments,
        };
      },
    ),
    on(
      tournamentActions.getTournamentsBySportAndSeasonFailure,
      (state, action) => ({
        ...state,
        isTournamentLoading: false,
        errors: action,
      }),
    ),
  ),
});

export const {
  name: tournamentFeatureKey,
  reducer: tournamentReducer,
  selectIsTournamentSubmitting,
  selectIsTournamentLoading,
  selectCurrentTournamentSponsorLineId,
  selectCurrentTournamentId,
  selectCurrentTournament,
  selectAllTournaments,
  selectAllSeasonSportTournaments,
} = tournamentFeature;
