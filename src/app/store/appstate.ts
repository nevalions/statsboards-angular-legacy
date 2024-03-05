import { TournamentState } from '../components/tournament/store/reducers';
import { SeasonState } from '../components/season/store/reducers';
import { SportState } from '../components/sport/store/reducers';
import { TeamState } from '../components/team/store/reducers';
import { TeamTournamentState } from '../components/team-tournament/store/reducers';
import { MatchState } from '../components/match/store/reducers';
import { MatchWithFullDataState } from '../components/match-with-full-data/store/reducers';
import { BreadcrumbState } from './breadcrumbs/breadcrumbs.reducers';

export interface AppState {
  breadcrumb: BreadcrumbState;
  match: MatchState;
  matchWithFullData: MatchWithFullDataState;
  season: SeasonState;
  sport: SportState;
  team: TeamState;
  teamTournament: TeamTournamentState;
  tournament: TournamentState;
}
