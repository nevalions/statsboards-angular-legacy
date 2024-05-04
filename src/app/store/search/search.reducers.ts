import { createFeature, createReducer, on } from '@ngrx/store';
import { searchActions } from './search.actions';
import { ITeam } from '../../type/team.type';
import { ITournament } from '../../type/tournament.type';

export interface SearchState {
  listSearchResults: {
    [context: string]: any[];
  };

  teamSearchTerm: string;
  teamSearchResults: ITeam[];
  teamInSportSearchTerm: string | null;
  teamInSportSearchResults: ITeam[];

  tournamentSearchTerm: string;
  tournamentSearchResults: ITournament[];
}

const initialState: SearchState = {
  listSearchResults: {},

  teamSearchTerm: '',
  teamSearchResults: [],
  teamInSportSearchTerm: null,
  teamInSportSearchResults: [],

  tournamentSearchTerm: '',
  tournamentSearchResults: [],
};

export const searchFeature = createFeature({
  name: 'search',
  reducer: createReducer(
    initialState,
    on(searchActions.listSearchSuccess, (state, { context, results }) => ({
      ...state,
      listSearchResults: {
        ...state.listSearchResults,
        [context]: results,
      },
    })),

    // TEAMS
    on(searchActions.updateTeamSearchTerm, (state, { term }) => ({
      ...state,
      teamSearchTerm: term,
    })),
    on(searchActions.teamSearchSuccess, (state, { teams }) => ({
      ...state,
      teamSearchResults: teams,
    })),
    on(searchActions.teamSearchFailure, (state) => ({
      ...state,
    })),

    on(searchActions.updateTeamInSportSearchTerm, (state, { term }) => ({
      ...state,
      teamInSportSearchTerm: term,
    })),
    on(searchActions.teamInSportSearchSuccess, (state, { teams }) => ({
      ...state,
      teamInSportSearchResults: teams,
    })),
    on(searchActions.teamInSportSearchFailure, (state) => ({
      ...state,
    })),

    // TOURNAMENTS
    on(searchActions.updateTournamentSearchTerm, (state, { term }) => ({
      ...state,
      tournamentSearchTerm: term,
    })),
    on(searchActions.tournamentSearchSuccess, (state, { tournaments }) => ({
      ...state,
      tournamentSearchResults: tournaments,
    })),
    on(searchActions.tournamentSearchFailure, (state) => ({
      ...state,
    })),
  ),
});

export const {
  name: searchFeatureKey,
  reducer: searchReducer,
  selectListSearchResults,

  selectTeamSearchTerm,
  selectTeamSearchResults,
  selectTeamInSportSearchTerm,
  selectTeamInSportSearchResults,

  selectTournamentSearchTerm,
  selectTournamentSearchResults,
} = searchFeature;
