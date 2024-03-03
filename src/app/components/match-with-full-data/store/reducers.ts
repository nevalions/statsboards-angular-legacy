import { createFeature, createReducer, on } from '@ngrx/store';
import { SortService } from '../../../services/sort.service';
import {
  crudStoreInterface,
  getDefaultCrudStore,
} from '../../../type/store.intarface';
import { IMatchWithFullData } from '../../../type/match.type';
import { matchWithFullDataActions } from './actions';

export interface MatchWithFullDataState extends crudStoreInterface {
  currentMatchWithFullDataId: number | undefined | null;
  currentMatchWithFullData: IMatchWithFullData | undefined | null;
  allMatchesWithFullData: IMatchWithFullData[];
  allMatchesWithFullDataInSport: IMatchWithFullData[];
  allMatchesWithFullDataInTournament: IMatchWithFullData[];
}

const initialState: MatchWithFullDataState = {
  ...getDefaultCrudStore(),
  currentMatchWithFullDataId: null,
  allMatchesWithFullData: [],
  allMatchesWithFullDataInSport: [],
  allMatchesWithFullDataInTournament: [],
  currentMatchWithFullData: null,
  errors: null,
};

const matchWithFullDataFeature = createFeature({
  name: 'matchWithFullData',
  reducer: createReducer(
    initialState,
    on(matchWithFullDataActions.getId, (state) => ({
      ...state,
      isLoading: true,
    })),
    on(
      matchWithFullDataActions.getMatchWithFullDataIdSuccessfully,
      (state, action) => ({
        ...state,
        isLoading: false,
        currentMatchWithFullDataId: action.matchWithFullDataId,
      }),
    ),
    on(matchWithFullDataActions.getMatchWithFullDataIdFailure, (state) => ({
      ...state,
      isLoading: false,
    })),

    // create actions
    on(matchWithFullDataActions.create, (state) => ({
      ...state,
      isSubmitting: true,
    })),
    on(matchWithFullDataActions.createdSuccessfully, (state, action) => {
      const newList = [
        ...state.allMatchesWithFullData,
        action.currentMatchWithFullData,
      ];
      const sortedTournaments = SortService.sort(
        newList,
        'match.week',
        '-match.date',
      );
      return {
        ...state,
        isSubmitting: false,
        currentMatchWithFullData: action.currentMatchWithFullData,
        allMatchesWithFullData: sortedTournaments,
      };
    }),
    on(matchWithFullDataActions.createFailure, (state, action) => ({
      ...state,
      isSubmitting: false,
      errors: action,
    })),

    // delete actions
    on(matchWithFullDataActions.delete, (state) => ({
      ...state,
      isSubmitting: true,
    })),
    on(matchWithFullDataActions.deletedSuccessfully, (state, action) => ({
      ...state,
      isSubmitting: false,
      itemsList: (state.allMatchesWithFullData || []).filter(
        (item) => item.id !== action.id,
      ),
      errors: null,
    })),
    on(matchWithFullDataActions.deleteFailure, (state, action) => ({
      ...state,
      isSubmitting: false,
      errors: action,
    })),

    // update actions
    on(matchWithFullDataActions.update, (state) => ({
      ...state,
      isSubmitting: true,
    })),
    on(matchWithFullDataActions.updatedSuccessfully, (state, action) => ({
      ...state,
      isSubmitting: false,
      currentMatchWithFullData: action.updatedMatchWithFullData,
      allMatchesWithFullData: state.allMatchesWithFullData.map((item) =>
        item.id === action.updatedMatchWithFullData.id
          ? action.updatedMatchWithFullData
          : item,
      ),
      errors: null,
    })),
    on(matchWithFullDataActions.updateFailure, (state, action) => ({
      ...state,
      isSubmitting: false,
      errors: action,
    })),

    on(
      matchWithFullDataActions.updateAllMatchesWithFullDataInTournament,
      (state, { newMatchWithFullData }) => {
        const newList = [
          ...state.allMatchesWithFullDataInTournament,
          newMatchWithFullData,
        ];
        const sortedMatches = SortService.sort(
          newList,
          'match.week',
          '-match.date',
        );
        return {
          ...state,
          allMatchesWithFullDataInTournament: sortedMatches,
        };
      },
    ),
    on(
      matchWithFullDataActions.updateMatchWithFullData,
      (state, { newMatchWithFullData }) => {
        return {
          ...state,
          currentMatchWithFullData: newMatchWithFullData,
        };
      },
    ),

    // on(
    //   matchWithFullDataActions.updateAllMatchesWithFullDataOnDelete,
    //   (state, { newMatchesWithFullData }) => {
    //     const sortedMatches = SortService.sort(
    //       newMatchesWithFullData, // should be an array, not an object
    //       'match.week',
    //       '-match.date',
    //     );
    //     return {
    //       ...state,
    //       allMatchesWithFullDataInTournament: sortedMatches,
    //     };
    //   },
    // ),

    on(matchWithFullDataActions.removeMatchFromTournament, (state, action) => ({
      ...state,
      allMatchesWithFullDataInTournament:
        state.allMatchesWithFullDataInTournament.filter(
          (match) => match.id !== action.id,
        ),
    })),

    // get actions
    on(matchWithFullDataActions.get, (state) => ({
      ...state,
      isLoading: true,
    })),
    on(matchWithFullDataActions.getItemSuccess, (state, action) => ({
      ...state,
      isLoading: false,
      currentMatchWithFullData: action.matchWithFullData,
    })),
    on(matchWithFullDataActions.getItemFailure, (state, action) => ({
      ...state,
      isLoading: false,
      errors: action,
    })),

    on(matchWithFullDataActions.getAll, (state) => ({
      ...state,
      isLoading: true,
    })),
    on(matchWithFullDataActions.getAllItemsSuccess, (state, action) => {
      const sortedMatchesWithFullData = SortService.sort(
        action.matchesWithFullData,
        '-match.date',
      );
      return {
        ...state,
        isLoading: false,
        allMatches: sortedMatchesWithFullData,
      };
    }),
    on(matchWithFullDataActions.getAllItemsFailure, (state, action) => ({
      ...state,
      isLoading: false,
      errors: action,
    })),

    on(matchWithFullDataActions.getMatchesWithFullDataBySportId, (state) => ({
      ...state,
      isLoading: true,
    })),
    on(
      matchWithFullDataActions.getMatchesWithFullDataBySportIDSuccess,
      (state, action) => {
        const sortedMatches = SortService.sort(
          action.matchesWithFullData,
          '-match.date',
        );
        return {
          ...state,
          isLoading: false,
          allMatchesWithFullDataInSport: sortedMatches,
        };
      },
    ),
    on(
      matchWithFullDataActions.getMatchesWithFullDataBySportIDFailure,
      (state, action) => ({
        ...state,
        isLoading: false,
        errors: action,
      }),
    ),

    on(
      matchWithFullDataActions.getMatchesWithFullDataByTournamentId,
      (state) => ({
        ...state,
        isLoading: true,
      }),
    ),
    on(
      matchWithFullDataActions.getMatchesWithFullDataByTournamentIDSuccess,
      (state, action) => {
        const sortedMatches = SortService.sort(
          action.matchesWithFullData,
          'match.week',
          '-match.date',
        );
        return {
          ...state,
          isLoading: false,
          allMatchesWithFullDataInTournament: sortedMatches,
        };
      },
    ),
    on(
      matchWithFullDataActions.getMatchesWithFullDataByTournamentIDFailure,
      (state, action) => ({
        ...state,
        isLoading: false,
        errors: action,
      }),
    ),

    // on(matchWithFullDataActions.addMatchToTournament, (state, { team_id }) => {
    //   const teamToAdd = state.allMatchsInSport.find(
    //     (team) => team.id === team_id,
    //   );
    //   if (!teamToAdd) {
    //     // console.log(store.allMatchsInSport);
    //     console.log(`No team found with id: ${team_id}`);
    //     return state;
    //   }
    //   // console.log(`Match with id: ${team_id} added to the tournament.`);
    //   const newList = [...state.allMatchsInTournament, teamToAdd];
    //   const sortedList = SortService.sort(newList, 'title');
    //   return {
    //     ...state,
    //     allMatchsInTournament: sortedList,
    //   };
    // }),
    //
    // on(matchWithFullDataActions.removeMatchFromTournament, (state, action) => ({
    //   ...state,
    //   allMatchsInTournament: state.allMatchsInTournament.filter(
    //     (team) => team.id !== action.id,
    //   ),
    // })),
  ),
});

export const {
  name: matchWithFullDataFeatureKey,
  reducer: matchWithFullDataReducer,
  selectIsSubmitting,
  selectIsLoading,
  selectCurrentMatchWithFullDataId,
  selectCurrentMatchWithFullData,
  selectAllMatchesWithFullData,
  selectAllMatchesWithFullDataInSport,
  selectAllMatchesWithFullDataInTournament,
} = matchWithFullDataFeature;
