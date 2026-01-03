import { IMatchWithFullData } from './match.type';
import { IPlayerInMatchFullData } from './player.type';

export interface IMatchFullContext {
  match: IMatchWithFullData;
  teams: {
    home: { id: number; name: string; logo_url: string };
    away: { id: number; name: string; logo_url: string };
  };
  sport: {
    id: number;
    name: string;
    positions: Array<{ id: number; name: string; category: string }>;
  };
  tournament: { id: number; name: string };
  players: {
    home_roster: IPlayerInMatchFullData[];
    away_roster: IPlayerInMatchFullData[];
    available_home: IPlayerInMatchFullData[];
    available_away: IPlayerInMatchFullData[];
  };
}

export interface IEventsWithPlayers {
  match_id: number;
  events: any[];
}

export interface ITeamRosters {
  match_id: number;
  home_roster: IPlayerInMatchFullData[];
  away_roster: IPlayerInMatchFullData[];
  available_home: IPlayerInMatchFullData[];
  available_away: IPlayerInMatchFullData[];
}
