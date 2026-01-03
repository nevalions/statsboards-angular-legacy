import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { urlWithProtocol } from '../base/constants';
import { IMatchWithFullData } from '../type/match.type';
import { IPlayerInMatchFullData } from '../type/player.type';

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

@Injectable({ providedIn: 'root' })
export class MatchContextService {
  private http = inject(HttpClient);

  getMatchFullContext(matchId: number): Observable<IMatchFullContext> {
    return this.http.get<IMatchFullContext>(
      `${urlWithProtocol}/matches/${matchId}/full-context/`,
    );
  }

  getEventsWithPlayers(matchId: number): Observable<IEventsWithPlayers> {
    return this.http.get<IEventsWithPlayers>(
      `${urlWithProtocol}/matches/${matchId}/events-with-players/`,
    );
  }

  getTeamRosters(matchId: number): Observable<ITeamRosters> {
    return this.http.get<ITeamRosters>(
      `${urlWithProtocol}/matches/${matchId}/team-rosters/`,
    );
  }
}
