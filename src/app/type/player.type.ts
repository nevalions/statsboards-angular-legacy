import { IPerson } from './person.type';

export interface IPlayer {
  id?: number | null;
  sport_id?: number;
  person_id: number | null;
  player_eesl_id?: number | null;
}

export interface IPlayerInSport {
  player: IPlayer;
  person: IPerson | null;
}

export interface IPlayerInTeamTournament {
  id?: number | null;
  player_team_tournament_eesl_id?: number | null;
  player_id?: number;
  team_id?: number | null;
  tournament_id?: number | null;
  player_number: string;
  player_position: string;
}

export interface IPlayerInTeamTournamentWithPerson {
  person: IPerson;
  playerInTeamTournament: IPlayerInTeamTournament;
}

export interface IPlayerInTeamTournamentWithPersonWithSport {
  player: IPlayerInSport;
  person: IPerson;
  playerInTeamTournament: IPlayerInTeamTournament;
}
