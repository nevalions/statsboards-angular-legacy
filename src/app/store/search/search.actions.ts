import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { ITeam } from '../../type/team.type';
import { ITournament } from '../../type/tournament.type';
import { AnyObjectWithTitle } from '../../type/base.type';
import { IPerson } from '../../type/person.type';

export const searchActions = createActionGroup({
  source: 'search',
  events: {
    // Actions for list search with title key
    SearchOnList: props<{
      context: string;
      term: string;
      list: AnyObjectWithTitle;
    }>(),
    ListSearchSuccess: props<{
      context: string;
      results: any[];
    }>(),

    // Actions for person search
    UpdatePersonSearchTerm: props<{ term: string | null }>(),
    PersonSearchSuccess: props<{ persons: IPerson[] }>(),
    PersonSearchFailure: emptyProps(),

    // Actions for team search
    UpdateTeamSearchTerm: props<{ term: string }>(),
    TeamSearchSuccess: props<{ teams: ITeam[] }>(),
    TeamSearchFailure: emptyProps(),

    // Actions for team in sport search
    UpdateTeamInSportSearchTerm: props<{ term: string | null }>(),
    TeamInSportSearchSuccess: props<{ teams: ITeam[] }>(),
    TeamInSportSearchFailure: emptyProps(),

    // Actions for tournament search
    UpdateTournamentSearchTerm: props<{ term: string }>(),
    TournamentSearchSuccess: props<{ tournaments: ITournament[] }>(),
    TournamentSearchFailure: emptyProps(),
  },
});
