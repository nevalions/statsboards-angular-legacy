import { IPerson } from './person.type';
import { IPosition } from './position.type';

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
  position_id?: number | null;
  team_id?: number | null;
  tournament_id?: number | null;
  player_number?: string;
}

export interface IPlayerInTeamTournamentWithPersonWithSportWithPosition {
  player: IPlayer | null;
  person: IPerson | null;
  playerInSport: IPlayerInSport | null;
  playerInTeamTournament: IPlayerInTeamTournament;
  position?: IPosition | null;
}

// export interface IFormPlayerInTeam {
//   playerId: number;
//   sportId: number;
//   fullName: string;
//   position: IPosition | null;
//   number: string; // This is a string based on your example, adjust if needed
// }

// export interface IPlayerInTeamTournamentWithPerson {
//   person: IPerson;
//   playerInTeamTournament: IPlayerInTeamTournament;
//   position: IPosition;
// }
