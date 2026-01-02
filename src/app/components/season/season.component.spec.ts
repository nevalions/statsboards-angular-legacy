import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { SeasonComponent } from './season.component';
import { SeasonService } from './season.service';
import { ISeason } from '../../type/season.type';

describe('SeasonComponent', () => {
  let component: SeasonComponent;
  let mockSeasonService: any;

  const mockSeasons: ISeason[] = [
    { id: 1, year: 2024, description: '2024 Season' },
    { id: 2, year: 2023, description: '2023 Season' },
    { id: 3, year: 2022, description: '2022 Season' },
  ];

  beforeEach(async () => {
    mockSeasonService = {
      findAll: vi.fn().mockReturnValue(of(mockSeasons)),
    };

    await TestBed.configureTestingModule({
      imports: [SeasonComponent],
      providers: [
        { provide: SeasonService, useValue: mockSeasonService },
        provideRouter([]),
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(SeasonComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should load seasons', async () => {
      component.ngOnInit();

      expect(mockSeasonService.findAll).toHaveBeenCalled();
    });

    it('should handle empty season list', () => {
      mockSeasonService.findAll.mockReturnValue(of([]));
      component.ngOnInit();

      expect(mockSeasonService.findAll).toHaveBeenCalled();
    });
  });

  describe('mapItemToLabel', () => {
    it('should return year as string', () => {
      const item = { id: 1, year: 2024, description: '2024 Season' };

      const result = component.mapItemToLabel(item);

      expect(result).toBe('2024');
    });

    it('should return empty string when year is null', () => {
      const item = { id: 1, year: null as any, description: 'Season' };

      const result = component.mapItemToLabel(item);

      expect(result).toBe('');
    });

    it('should return empty string when year is undefined', () => {
      const item = { id: 1, year: undefined as any, description: 'Season' };

      const result = component.mapItemToLabel(item);

      expect(result).toBe('');
    });
  });

  describe('seasonRoute', () => {
    it('should return route with year', () => {
      const item = { id: 1, year: 2024, description: '2024 Season' };

      const result = component.seasonRoute(item);

      expect(result).toEqual(['/seasons/year/2024']);
    });
  });

  describe('seasonTournamentRoute', () => {
    it('should return base route when no routeInfo', () => {
      const item = { id: 1, year: 2024, description: '2024 Season' };

      const result = component.seasonTournamentRoute(item);

      expect(result).toEqual(['/seasons/year/2024']);
    });

    it('should return route with routeInfo', () => {
      const item = {
        id: 1,
        year: 2024,
        description: '2024 Season',
        routeInfo: '/tournament/1',
      };

      const result = component.seasonTournamentRoute(item);

      expect(result).toEqual(['/seasons/year/2024/tournament/1']);
    });
  });

  describe('seasonHref', () => {
    it('should return href with year', () => {
      const item = { id: 1, year: 2024, description: '2024 Season' };

      const result = component.seasonHref(item);

      expect(result).toBe('/seasons/year/2024');
    });
  });
});
