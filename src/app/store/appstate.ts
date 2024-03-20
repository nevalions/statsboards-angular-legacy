import { TournamentState } from '../components/tournament/store/reducers';
import { SeasonState } from '../components/season/store/reducers';
import { SportState } from '../components/sport/store/reducers';
import { TeamState } from '../components/team/store/reducers';
import { TeamTournamentState } from '../components/team-tournament/store/reducers';
import { MatchState } from '../components/match/store/reducers';
import { MatchWithFullDataState } from '../components/match-with-full-data/store/reducers';
import { BreadcrumbState } from './breadcrumbs/breadcrumbs.reducers';
import { MatchDataState } from '../components/match/store/match-data/reducers';
import { WebSocketState } from './websocket/websocket.reducers';
import { ScoreboardData } from '../components/scoreboard-data/scoreboard-data';
import { UiState } from './ui/ui.reducers';
import { PlayclockState } from '../components/playclock/store/reducers';
import { FileState } from './file/file.reducers';

export interface AppState {
  breadcrumb: BreadcrumbState;
  file: FileState;
  match: MatchState;
  matchData: MatchDataState;
  matchWithFullData: MatchWithFullDataState;
  playclock: PlayclockState;
  scoreboard: ScoreboardData;
  season: SeasonState;
  sport: SportState;
  team: TeamState;
  teamTournament: TeamTournamentState;
  tournament: TournamentState;
  ui: UiState;
  webSocket: WebSocketState;
}
