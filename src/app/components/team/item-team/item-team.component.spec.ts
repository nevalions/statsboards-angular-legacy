import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { ItemTeamComponent } from './item-team.component';
import { Team } from '../team';
import { Sport } from '../../sport/sport';
import { Person } from '../../person/person';
import { Tournament } from '../../tournament/tournament';
import { Player } from '../../player/player';
import { PlayerInTeamTournament } from '../../player-team-tournament/player-team-tournament';
import { Position } from '../../position/postion';
import { Sponsor } from '../../adv/sponsor/sponsor';
import { SponsorLine } from '../../adv/sponsor-line/sponsorLine';
import { of } from 'rxjs';

describe('ItemTeamComponent', () => {
  let component: ItemTeamComponent;
  let fixture: ComponentFixture<ItemTeamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemTeamComponent],
      providers: [
        {
          provide: Team,
          useValue: {
            team$: of(null),
            homeTeam$: of(null),
            awayTeam$: of(null),
            teamsInSport$: of([]),
            teamsInTournament$: of([]),
            availableTeamsToAddToTournament$: of([]),
            loadCurrentTeam: vi.fn(),
            loadAllTeamsInSport: vi.fn(),
            loadAllTeamsInTournament: vi.fn(),
            createTeam: vi.fn(),
            loadMatchTeams: vi.fn(),
            updateTeam: vi.fn(),
            deleteTeam: vi.fn(),
          },
        },
        {
          provide: Sport,
          useValue: {
            currentSport$: of(null),
            allSports$: of([]),
            loadCurrentSport: vi.fn(),
            loadAllSports: vi.fn(),
          },
        },
        {
          provide: Person,
          useValue: {
            currentPerson$: of(null),
            allPersons$: of([]),
            availablePersonsForSport$: of([]),
            createPerson: vi.fn(),
            updatePerson: vi.fn(),
            loadCurrentPerson: vi.fn(),
            loadAllPersons: vi.fn(),
            deletePerson: vi.fn(),
          },
        },
        {
          provide: Tournament,
          useValue: {
            currentTournament$: of(null),
            loadCurrentTournament: vi.fn(),
          },
        },
        {
          provide: Player,
          useValue: {
            currentPlayer$: of(null),
            allPlayers$: of([]),
            allSportPlayers$: of([]),
            allPlayersWithPerson$: of([]),
            allSportPlayersWithPerson$: of([]),
            createPlayer: vi.fn(),
            updatePlayer: vi.fn(),
            loadCurrentPlayer: vi.fn(),
            loadAllPlayers: vi.fn(),
            loadAllPlayersBySportId: vi.fn(),
            deletePlayer: vi.fn(),
          },
        },
        {
          provide: PlayerInTeamTournament,
          useValue: {
            playerInTeamTournamentIsLoading$: of(false),
            allAvailableTournamentPlayersForTeamTournament$: of([]),
            allPlayersInTeamTournamentFullData$: of([]),
            loadAllPlayersInTeamTournament: vi.fn(),
            loadAllPlayersInTournament: vi.fn(),
            parsPlayersFromEESL: vi.fn(),
          },
        },
        {
          provide: Position,
          useValue: {
            allSportPositions$: of([]),
            loadAllPositionsBySportId: vi.fn(),
          },
        },
        {
          provide: Sponsor,
          useValue: {
            currentSponsor$: of(null),
            allSponsors$: of([]),
            loadAllSponsors: vi.fn(),
          },
        },
        {
          provide: SponsorLine,
          useValue: {
            sponsorLineWithFullData$: of(null),
            allSponsorLines$: of([]),
            loadAllSponsorLines: vi.fn(),
            loadAllSponsors: vi.fn(),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ItemTeamComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
