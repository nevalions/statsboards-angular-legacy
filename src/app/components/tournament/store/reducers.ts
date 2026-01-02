import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createSelector, createFeature, createReducer, on } from '@ngrx/store';
import { ITournament } from '../../../type/tournament.type';
import { ISponsor } from '../../../type/sponsor.type';
import { tournamentActions } from './actions';

export interface TournamentState extends EntityState<ITournament> {
  isTournamentSubmitting: boolean;
  isTournamentLoading: boolean;
  currentTournamentId: number | undefined | null;
  currentTournament: ITournament | undefined | null;
  currentTournamentMainSponsor: ISponsor | undefined | null;
  currentTournamentSponsorLineId: number | undefined | null;
  allSeasonSportTournaments: ITournament[];
  errors: any;
}

const adapter = createEntityAdapter<ITournament>({
  sortComparer: (a: ITournament, b: ITournament) =>
    a.title.localeCompare(b.title),
});

const initialState: TournamentState = adapter.getInitialState({
  isTournamentSubmitting: false,
  isTournamentLoading: false,
  currentTournamentId: null,
  allSeasonSportTournaments: [],
  currentTournamentSponsorLineId: null,
  currentTournament: null,
  currentTournamentMainSponsor: null,
  errors: null,
});

const tournamentFeature = createFeature({
  name: 'tournament',
  reducer: createReducer(
    initialState,
    on(
      tournamentActions.getId,
      (state): TournamentState => ({
        ...state,
        isTournamentLoading: true,
      }),
    ),
    on(
      tournamentActions.getTournamentIdSuccessfully,
      (state, action): TournamentState => ({
        ...state,
        isTournamentLoading: false,
        currentTournamentId: action.tournamentId,
      }),
    ),
    on(
      tournamentActions.getTournamentIdFailure,
      (state): TournamentState => ({
        ...state,
        isTournamentLoading: false,
      }),
    ),

    on(
      tournamentActions.getMainSponsorByTournamentId,
      (state): TournamentState => ({
        ...state,
        isTournamentLoading: true,
      }),
    ),
    on(
      tournamentActions.getMainSponsorSuccess,
      (state, action): TournamentState => ({
        ...state,
        isTournamentLoading: false,
        currentTournamentMainSponsor: action.mainSponsor,
      }),
    ),
    on(
      tournamentActions.getMainSponsorFailure,
      (state): TournamentState => ({
        ...state,
        isTournamentLoading: false,
      }),
    ),

    on(
      tournamentActions.create,
      (state): TournamentState => ({
        ...state,
        isTournamentSubmitting: true,
      }),
    ),
    on(tournamentActions.createdSuccessfully, (state, action) =>
      adapter.addOne(action.currentTournament, {
        ...state,
        isTournamentSubmitting: false,
        currentTournament: action.currentTournament,
      }),
    ),
    on(
      tournamentActions.createFailure,
      (state, action): TournamentState => ({
        ...state,
        isTournamentSubmitting: false,
        errors: action,
      }),
    ),

    on(
      tournamentActions.delete,
      (state): TournamentState => ({
        ...state,
        isTournamentSubmitting: true,
      }),
    ),
    on(tournamentActions.deletedSuccessfully, (state, action) => {
      if (action.tournamentId !== null && action.tournamentId !== undefined) {
        return adapter.removeOne(action.tournamentId, {
          ...state,
          isTournamentSubmitting: false,
          allSeasonSportTournaments: state.allSeasonSportTournaments.filter(
            (item) => item.id !== action.tournamentId,
          ),
          errors: null,
        });
      }
      return {
        ...state,
        isTournamentSubmitting: false,
        errors: null,
      };
    }),
    on(
      tournamentActions.deleteFailure,
      (state, action): TournamentState => ({
        ...state,
        isTournamentSubmitting: false,
        errors: action,
      }),
    ),

    on(
      tournamentActions.update,
      (state): TournamentState => ({
        ...state,
        isTournamentSubmitting: true,
      }),
    ),
    on(tournamentActions.updatedSuccessfully, (state, action) => {
      if (action.updatedTournament.id) {
        return adapter.updateOne(
          {
            id: action.updatedTournament.id,
            changes: action.updatedTournament,
          },
          {
            ...state,
            isTournamentSubmitting: false,
            currentTournament: action.updatedTournament,
            allSeasonSportTournaments: state.allSeasonSportTournaments.map(
              (item) =>
                item.id === action.updatedTournament.id
                  ? action.updatedTournament
                  : item,
            ),
            errors: null,
          },
        );
      }
      return {
        ...state,
        isTournamentSubmitting: false,
        currentTournament: action.updatedTournament,
        allSeasonSportTournaments: state.allSeasonSportTournaments.map(
          (item) =>
            item.id === action.updatedTournament.id
              ? action.updatedTournament
              : item,
        ),
        errors: null,
      };
    }),
    on(
      tournamentActions.updateFailure,
      (state, action): TournamentState => ({
        ...state,
        isTournamentSubmitting: false,
        errors: action,
      }),
    ),
    on(
      tournamentActions.updateSportSeasonTournaments,
      (state, { newTournament }) => {
        const newList = [...state.allSeasonSportTournaments, newTournament];
        return {
          ...state,
          allSeasonSportTournaments: newList,
        };
      },
    ),

    on(
      tournamentActions.get,
      (state): TournamentState => ({
        ...state,
        isTournamentLoading: true,
      }),
    ),
    on(
      tournamentActions.getItemSuccess,
      (state, action): TournamentState => ({
        ...state,
        isTournamentLoading: false,
        currentTournament: action.tournament,
        currentTournamentId: action.tournament.id,
        currentTournamentSponsorLineId: action.tournament.sponsor_line_id,
      }),
    ),
    on(
      tournamentActions.getItemFailure,
      (state, action): TournamentState => ({
        ...state,
        isTournamentLoading: false,
        errors: action,
      }),
    ),

    on(
      tournamentActions.getAll,
      (state): TournamentState => ({
        ...state,
        isTournamentLoading: true,
      }),
    ),
    on(tournamentActions.getAllItemsSuccess, (state, action) =>
      adapter.setAll(action.tournaments, {
        ...state,
        isTournamentLoading: false,
      }),
    ),
    on(
      tournamentActions.getAllItemsFailure,
      (state, action): TournamentState => ({
        ...state,
        isTournamentLoading: false,
        errors: action,
      }),
    ),

    on(
      tournamentActions.getTournamentsBySportAndSeason,
      (state): TournamentState => ({
        ...state,
        isTournamentLoading: true,
      }),
    ),
    on(
      tournamentActions.getTournamentsBySportAndSeasonSuccess,
      (state, action) => {
        return {
          ...state,
          isTournamentLoading: false,
          allSeasonSportTournaments: action.tournaments,
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

const { selectAll } = adapter.getSelectors();

export const {
  name: tournamentFeatureKey,
  reducer: tournamentReducer,
  selectIsTournamentSubmitting,
  selectIsTournamentLoading,
  selectCurrentTournamentSponsorLineId,
  selectCurrentTournamentId,
  selectCurrentTournament,
  selectAllSeasonSportTournaments,
  selectTournamentState,
} = tournamentFeature;

export const selectAllTournaments = createSelector(
  selectTournamentState,
  selectAll,
);
