import { TestBed } from '@angular/core/testing';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { MatchContextService } from './match-context.service';
import {
  IMatchFullContext,
  IEventsWithPlayers,
  ITeamRosters,
} from '../type/backend-api.type';
import { IMatchWithFullData } from '../type/match.type';
import { IPlayerInMatchFullData } from '../type/player.type';
import { IPerson } from '../type/person.type';
import { IPosition } from '../type/position.type';

describe('MatchContextService', () => {
  let service: MatchContextService;
  let httpTesting: HttpTestingController;

  const mockPerson: IPerson = {
    id: 1,
    first_name: 'John',
    second_name: 'Doe',
    person_photo_url: null,
    person_photo_icon_url: null,
    person_photo_web_url: null,
    person_dob: null,
    person_eesl_id: null,
  };

  const mockPosition: IPosition = {
    id: 1,
    title: 'Quarterback',
    sport_id: 1,
  };

  const mockMatch: IMatchWithFullData = {
    id: 1,
    match_id: 1,
    status_code: 0,
    match: {
      id: 1,
      match_date: new Date('2024-01-01'),
      week: 1,
      team_a_id: 1,
      team_b_id: 2,
      tournament_id: 1,
      main_sponsor_id: null,
      sponsor_line_id: null,
    },
  };

  const mockPlayer: IPlayerInMatchFullData = {
    match_player: {
      id: 1,
      player_match_eesl_id: null,
      player_team_tournament_id: 1,
      match_position_id: null,
      match_id: 1,
      match_number: '10',
      team_id: 1,
      is_start: true,
    },
    player_team_tournament: {
      id: 1,
      player_id: 1,
      position_id: 1,
      team_id: 1,
      tournament_id: 1,
      player_number: '10',
    },
    person: mockPerson,
    position: mockPosition,
  };

  const mockFullContext: IMatchFullContext = {
    match: mockMatch,
    teams: {
      home: { id: 1, name: 'Home Team', logo_url: '/home-logo.png' },
      away: { id: 2, name: 'Away Team', logo_url: '/away-logo.png' },
    },
    sport: {
      id: 1,
      name: 'Football',
      positions: [
        { id: 1, name: 'Quarterback', category: 'offense' },
        { id: 2, name: 'Running Back', category: 'offense' },
      ],
    },
    tournament: { id: 1, name: 'Championship' },
    players: {
      home_roster: [mockPlayer],
      away_roster: [mockPlayer],
      available_home: [mockPlayer],
      available_away: [mockPlayer],
    },
  };

  const mockEventsWithPlayers: IEventsWithPlayers = {
    match_id: 1,
    events: [
      { id: 1, event_type: 'touchdown', player_id: 1, minute: 10 },
      { id: 2, event_type: 'field_goal', player_id: 2, minute: 25 },
    ],
  };

  const mockTeamRosters: ITeamRosters = {
    match_id: 1,
    home_roster: [mockPlayer],
    away_roster: [mockPlayer],
    available_home: [mockPlayer],
    available_away: [mockPlayer],
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MatchContextService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(MatchContextService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  describe('creation', () => {
    it('should create service', () => {
      expect(service).toBeTruthy();
    });
  });

  describe('getMatchFullContext', () => {
    it('should send GET request to correct endpoint', () => {
      service.getMatchFullContext(1).subscribe();

      const req = httpTesting.expectOne((request) =>
        request.url.includes('/matches/1/full-context/'),
      );

      expect(req.request.method).toBe('GET');
      req.flush(mockFullContext);
    });

    it('should return IMatchFullContext observable', () => {
      let receivedData: IMatchFullContext | undefined;

      service.getMatchFullContext(1).subscribe((data) => {
        receivedData = data;
      });

      const req = httpTesting.expectOne((request) =>
        request.url.includes('/matches/1/full-context/'),
      );
      req.flush(mockFullContext);

      expect(receivedData).toEqual(mockFullContext);
    });

    it('should include match_id in URL', () => {
      const matchId = 42;

      service.getMatchFullContext(matchId).subscribe();

      const req = httpTesting.expectOne((request) =>
        request.url.includes(`/matches/${matchId}/full-context/`),
      );

      expect(req.request.url).toContain(matchId.toString());
      req.flush(mockFullContext);
    });

    it('should handle error response', () => {
      const errorResponse = {
        status: 500,
        statusText: 'Internal Server Error',
      };

      let errorThrown = false;
      let errorData: any;

      service.getMatchFullContext(1).subscribe({
        next: () => {},
        error: (error) => {
          errorThrown = true;
          errorData = error;
        },
      });

      const req = httpTesting.expectOne((request) =>
        request.url.includes('/matches/1/full-context/'),
      );
      req.flush('Server error', errorResponse);

      expect(errorThrown).toBe(true);
      expect(errorData).toBeTruthy();
    });
  });

  describe('getEventsWithPlayers', () => {
    it('should send GET request to correct endpoint', () => {
      service.getEventsWithPlayers(1).subscribe();

      const req = httpTesting.expectOne((request) =>
        request.url.includes('/matches/1/events-with-players/'),
      );

      expect(req.request.method).toBe('GET');
      req.flush(mockEventsWithPlayers);
    });

    it('should return IEventsWithPlayers observable', () => {
      let receivedData: IEventsWithPlayers | undefined;

      service.getEventsWithPlayers(1).subscribe((data) => {
        receivedData = data;
      });

      const req = httpTesting.expectOne((request) =>
        request.url.includes('/matches/1/events-with-players/'),
      );
      req.flush(mockEventsWithPlayers);

      expect(receivedData).toEqual(mockEventsWithPlayers);
      expect(receivedData?.match_id).toBe(1);
      expect(receivedData?.events.length).toBe(2);
    });

    it('should include match_id in URL', () => {
      const matchId = 99;

      service.getEventsWithPlayers(matchId).subscribe();

      const req = httpTesting.expectOne((request) =>
        request.url.includes(`/matches/${matchId}/events-with-players/`),
      );

      expect(req.request.url).toContain(matchId.toString());
      req.flush(mockEventsWithPlayers);
    });

    it('should handle empty events array', () => {
      const emptyResponse: IEventsWithPlayers = {
        match_id: 1,
        events: [],
      };

      let receivedData: IEventsWithPlayers | undefined;

      service.getEventsWithPlayers(1).subscribe((data) => {
        receivedData = data;
      });

      const req = httpTesting.expectOne((request) =>
        request.url.includes('/matches/1/events-with-players/'),
      );
      req.flush(emptyResponse);

      expect(receivedData?.events.length).toBe(0);
    });

    it('should handle error response', () => {
      const errorResponse = {
        status: 404,
        statusText: 'Not Found',
      };

      let errorThrown = false;
      let errorData: any;

      service.getEventsWithPlayers(1).subscribe({
        next: () => {},
        error: (error) => {
          errorThrown = true;
          errorData = error;
        },
      });

      const req = httpTesting.expectOne((request) =>
        request.url.includes('/matches/1/events-with-players/'),
      );
      req.flush('Not found', errorResponse);

      expect(errorThrown).toBe(true);
      expect(errorData).toBeTruthy();
    });
  });

  describe('getTeamRosters', () => {
    it('should send GET request to correct endpoint', () => {
      service.getTeamRosters(1).subscribe();

      const req = httpTesting.expectOne((request) =>
        request.url.includes('/matches/1/team-rosters/'),
      );

      expect(req.request.method).toBe('GET');
      req.flush(mockTeamRosters);
    });

    it('should return ITeamRosters observable', () => {
      let receivedData: ITeamRosters | undefined;

      service.getTeamRosters(1).subscribe((data) => {
        receivedData = data;
      });

      const req = httpTesting.expectOne((request) =>
        request.url.includes('/matches/1/team-rosters/'),
      );
      req.flush(mockTeamRosters);

      expect(receivedData).toEqual(mockTeamRosters);
      expect(receivedData?.match_id).toBe(1);
      expect(receivedData?.home_roster.length).toBe(1);
      expect(receivedData?.away_roster.length).toBe(1);
      expect(receivedData?.available_home.length).toBe(1);
      expect(receivedData?.available_away.length).toBe(1);
    });

    it('should include match_id in URL', () => {
      const matchId = 77;

      service.getTeamRosters(matchId).subscribe();

      const req = httpTesting.expectOne((request) =>
        request.url.includes(`/matches/${matchId}/team-rosters/`),
      );

      expect(req.request.url).toContain(matchId.toString());
      req.flush(mockTeamRosters);
    });

    it('should handle empty rosters', () => {
      const emptyResponse: ITeamRosters = {
        match_id: 1,
        home_roster: [],
        away_roster: [],
        available_home: [],
        available_away: [],
      };

      let receivedData: ITeamRosters | undefined;

      service.getTeamRosters(1).subscribe((data) => {
        receivedData = data;
      });

      const req = httpTesting.expectOne((request) =>
        request.url.includes('/matches/1/team-rosters/'),
      );
      req.flush(emptyResponse);

      expect(receivedData?.home_roster.length).toBe(0);
      expect(receivedData?.away_roster.length).toBe(0);
      expect(receivedData?.available_home.length).toBe(0);
      expect(receivedData?.available_away.length).toBe(0);
    });

    it('should handle error response', () => {
      const errorResponse = {
        status: 403,
        statusText: 'Forbidden',
      };

      let errorThrown = false;
      let errorData: any;

      service.getTeamRosters(1).subscribe({
        next: () => {},
        error: (error) => {
          errorThrown = true;
          errorData = error;
        },
      });

      const req = httpTesting.expectOne((request) =>
        request.url.includes('/matches/1/team-rosters/'),
      );
      req.flush('Access denied', errorResponse);

      expect(errorThrown).toBe(true);
      expect(errorData).toBeTruthy();
    });
  });

  describe('service verification', () => {
    it('should make no unexpected requests', () => {
      service.getMatchFullContext(1).subscribe();
      service.getEventsWithPlayers(1).subscribe();
      service.getTeamRosters(1).subscribe();

      httpTesting.expectOne((request) =>
        request.url.includes('/matches/1/full-context/'),
      );
      httpTesting.expectOne((request) =>
        request.url.includes('/matches/1/events-with-players/'),
      );
      httpTesting.expectOne((request) =>
        request.url.includes('/matches/1/team-rosters/'),
      );

      httpTesting.verify();
    });
  });
});
