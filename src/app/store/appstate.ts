import { SponsorLineState } from '../components/adv/sponsor-line/store/reducers';
import { SponsorSponsorLineConnectionState } from '../components/adv/sponsor-sponsor-line-connection/store/reducers';
import { SponsorState } from '../components/adv/sponsor/store/reducers';
import { MatchWithFullDataState } from '../components/match-with-full-data/store/reducers';
import { MatchDataState } from '../components/match/store/match-data/reducers';
import { MatchState } from '../components/match/store/reducers';
import { PersonState } from '../components/person/store/reducers';
import { PlayclockState } from '../components/playclock/store/reducers';
import { PlayerInMatch } from '../components/player-match/player-match';
import { PlayerInTeamTournamentState } from '../components/player-team-tournament/store/reducers';
import { PlayerState } from '../components/player/store/reducers';
import { PositionState } from '../components/position/store/reducers';
import { ScoreboardDataState } from '../components/scoreboard-data/store/reducers';
import { SeasonState } from '../components/season/store/reducers';
import { SportState } from '../components/sport/store/reducers';
import { TeamTournamentState } from '../components/team-tournament/store/reducers';
import { TeamState } from '../components/team/store/reducers';
import { TournamentState } from '../components/tournament/store/reducers';
import { BreadcrumbState } from './breadcrumbs/breadcrumbs.reducers';
import { FileState } from './file/file.reducers';
import { PaginationState } from './pagination/pagination.reducers';
import { SearchState } from './search/search.reducers';
import { UiState } from './ui/ui.reducers';
import { WebSocketState } from './websocket/websocket.reducers';
import { FootballEventState } from '../components/match-event/football-event/store/reducers';

export interface AppState {
  breadcrumb: BreadcrumbState;
  file: FileState;
  match: MatchState;
  matchData: MatchDataState;
  matchWithFullData: MatchWithFullDataState;
  footballEvent: FootballEventState;
  pagination: PaginationState;
  person: PersonState;
  player: PlayerState;
  playerInTeamTournament: PlayerInTeamTournamentState;
  playerInMatch: PlayerInMatch;
  playclock: PlayclockState;
  position: PositionState;
  scoreboard: ScoreboardDataState;
  search: SearchState;
  season: SeasonState;
  sponsor: SponsorState;
  sponsorLine: SponsorLineState;
  sponsorSponsorLineConnection: SponsorSponsorLineConnectionState;
  sport: SportState;
  team: TeamState;
  teamTournament: TeamTournamentState;
  tournament: TournamentState;
  ui: UiState;
  webSocket: WebSocketState;
}
