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
import { UiState } from './ui/ui.reducers';
import { PlayclockState } from '../components/playclock/store/reducers';
import { FileState } from './file/file.reducers';
import { SponsorState } from '../components/adv/sponsor/store/reducers';
import { SponsorLineState } from '../components/adv/sponsor-line/store/reducers';
import { SponsorSponsorLineConnectionState } from '../components/adv/sponsor-sponsor-line-connection/store/reducers';
import { PersonState } from '../components/person/store/reducers';
import { ScoreboardDataState } from '../components/scoreboard-data/store/reducers';

export interface AppState {
  breadcrumb: BreadcrumbState;
  file: FileState;
  match: MatchState;
  matchData: MatchDataState;
  matchWithFullData: MatchWithFullDataState;
  person: PersonState;
  playclock: PlayclockState;
  scoreboard: ScoreboardDataState;
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
