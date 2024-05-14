import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { ITeam } from '../../type/team.type';
import { ITournament } from '../../type/tournament.type';
import { AnyObjectWithTitle } from '../../type/base.type';
import { IPerson } from '../../type/person.type';
import { IPlayerInSport } from '../../type/player.type';
import { IMatchWithFullData } from '../../type/match.type';

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

    // Actions for list search with person second name
    // SearchOnListOfPerson: props<{
    //   context: string;
    //   term: string;
    //   list: IPerson;
    // }>(),
    // ListOfPersonSuccess: props<{
    //   context: string;
    //   results: any[];
    // }>(),

    // Actions for person search
    UpdatePersonSearchTerm: props<{ term: string | null }>(),
    PersonSearchSuccess: props<{ persons: IPerson[] }>(),
    PersonSearchFailure: emptyProps(),

    // Actions for play in sport search
    UpdatePlayerInSportSearchTerm: props<{ term: string | null }>(),
    PlayerInSportSearchSuccess: props<{ player: IPlayerInSport[] }>(),
    PlayerInSportSearchFailure: emptyProps(),

    // Actions for team search
    UpdateTeamSearchTerm: props<{ term: string }>(),
    TeamSearchSuccess: props<{ teams: ITeam[] }>(),
    TeamSearchFailure: emptyProps(),

    // Actions for team in sport search
    UpdateTeamInSportSearchTerm: props<{ term: string | null }>(),
    TeamInSportSearchSuccess: props<{ teams: ITeam[] }>(),
    TeamInSportSearchFailure: emptyProps(),

    // Actions for tournament search
    UpdateTournamentSearchTerm: props<{ term: string | null }>(),
    TournamentSearchSuccess: props<{ tournaments: ITournament[] }>(),
    TournamentSearchFailure: emptyProps(),

    // Actions for match search
    UpdateMatchSearchTerm: props<{ term: string | null }>(),
    MatchSearchSuccess: props<{ matches: IMatchWithFullData[] }>(),
    MatchSearchFailure: emptyProps(),
    // search by week
    UpdateMatchSearchWeek: props<{ week: string | null }>(),
    MatchSearchWeekSuccess: props<{ matches: IMatchWithFullData[] }>(),
    MatchSearchWeekFailure: emptyProps(),
  },
});
