import { TournamentState } from '../../components/tournament/store/reducers';
import { SeasonState } from '../../components/season/store/reducers';
import { SportState } from '../../components/sport/store/reducers';
import { TeamState } from '../../components/team/store/reducers';
import { TeamTournamentState } from '../../components/team-tournament/store/reducers';

export interface AppState {
  season: SeasonState;
  sport: SportState;
  tournament: TournamentState;
  team: TeamState;
  teamTournament: TeamTournamentState;
}
