import { TestBed } from '@angular/core/testing';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { ISeason } from '../../type/season.type';
import { SeasonService } from './season.service';

describe('SeasonService', () => {
  let service: SeasonService;
  let httpMock: HttpTestingController;

  const mockSeasons: ISeason[] = [
    { id: 1, year: 2023, description: 'Season 2023' },
    { id: 2, year: 2024, description: 'Season 2024' },
  ];

  const mockSeason: ISeason = {
    id: 1,
    year: 2024,
    description: 'Test Season',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SeasonService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(SeasonService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('service creation', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should extend BaseApiService', () => {
      expect(service).toBeInstanceOf(SeasonService);
    });
  });

  describe('findAll', () => {
    it('should return array of seasons', (done) => {
      service.findAll().subscribe((seasons) => {
        expect(seasons).toEqual(mockSeasons);
        expect(seasons.length).toBe(2);
        done();
      });

      const req = httpMock.expectOne('seasons');
      expect(req.request.method).toBe('GET');
      req.flush(mockSeasons);
    });

    it('should handle empty response', (done) => {
      service.findAll().subscribe((seasons) => {
        expect(seasons).toEqual([]);
        expect(seasons.length).toBe(0);
        done();
      });

      const req = httpMock.expectOne('seasons');
      req.flush([]);
    });

    it('should handle error', (done) => {
      service.findAll().subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error).toBeTruthy();
          done();
        },
      });

      const req = httpMock.expectOne('seasons');
      req.flush('Error', { status: 500, statusText: 'Server Error' });
    });
  });

  describe('findById', () => {
    it('should return single season by id', (done) => {
      service.findById(1).subscribe((season) => {
        expect(season).toEqual(mockSeason);
        expect(season?.id).toBe(1);
        done();
      });

      const req = httpMock.expectOne('seasons/id/1');
      expect(req.request.method).toBe('GET');
      req.flush(mockSeason);
    });

    it('should handle not found', (done) => {
      service.findById(999).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error).toBeTruthy();
          done();
        },
      });

      const req = httpMock.expectOne('seasons/id/999');
      req.flush('Not Found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('addItem', () => {
    it('should create a new season', (done) => {
      const newSeason: ISeason = {
        year: 2025,
        description: 'New Season',
      } as ISeason;

      service.addItem(newSeason).subscribe((season) => {
        expect(season).toEqual({ ...newSeason, id: 3 });
        done();
      });

      const req = httpMock.expectOne('seasons');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newSeason);
      req.flush({ ...newSeason, id: 3 });
    });

    it('should handle creation error', (done) => {
      const newSeason: ISeason = {
        year: 2025,
        description: 'New Season',
      } as ISeason;

      service.addItem(newSeason).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error).toBeTruthy();
          done();
        },
      });

      const req = httpMock.expectOne('seasons');
      req.flush('Error', { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('editItem', () => {
    it('should update an existing season', (done) => {
      const updatedSeason: ISeason = {
        ...mockSeason,
        description: 'Updated Season',
      };

      service.editItem(1, updatedSeason).subscribe((season) => {
        expect(season).toEqual(updatedSeason);
        done();
      });

      const req = httpMock.expectOne('seasons/1/');
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(updatedSeason);
      req.flush(updatedSeason);
    });

    it('should handle update error', (done) => {
      const updatedSeason: ISeason = {
        ...mockSeason,
        description: 'Updated Season',
      };

      service.editItem(1, updatedSeason).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error).toBeTruthy();
          done();
        },
      });

      const req = httpMock.expectOne('seasons/1/');
      req.flush('Error', { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('deleteItem', () => {
    it('should delete a season', (done) => {
      service.deleteItem(1).subscribe(() => {
        done();
      });

      const req = httpMock.expectOne('seasons/id/1');
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });

    it('should handle delete error', (done) => {
      service.deleteItem(1).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error).toBeTruthy();
          done();
        },
      });

      const req = httpMock.expectOne('seasons/id/1');
      req.flush('Error', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('getSeasonByYear', () => {
    it('should get season by year and update subject', (done) => {
      const year = 2024;

      service.getSeasonByYear(year);
      service.season$.subscribe((season) => {
        if (season && season.year === year) {
          expect(season).toEqual(mockSeason);
          done();
        }
      });

      const req = httpMock.expectOne('seasons/year/2024');
      req.flush(mockSeason);
    });
  });

  describe('getSeasonByYearReturn', () => {
    it('should return observable of season by year', (done) => {
      const year = 2024;

      service.getSeasonByYearReturn(year).subscribe((season) => {
        expect(season).toEqual(mockSeason);
        expect(season?.year).toBe(year);
        done();
      });

      const req = httpMock.expectOne('seasons/year/2024');
      req.flush(mockSeason);
    });

    it('should update season subject when called', (done) => {
      const year = 2024;
      let callCount = 0;

      service.season$.subscribe((season) => {
        callCount++;
        if (callCount === 2) {
          expect(season).toEqual(mockSeason);
          done();
        }
      });

      service.getSeasonByYearReturn(year).subscribe();

      const req = httpMock.expectOne('seasons/year/2024');
      req.flush(mockSeason);
    });
  });

  describe('getSeasonsWithSportId', () => {
    it('should return seasons filtered by sport id', (done) => {
      const sportId = 1;
      const seasonsWithSport: ISeason[] = [...mockSeasons].reverse().map(
        (season) =>
          ({
            ...season,
            sport_id: sportId,
          }) as any,
      );

      service.getSeasonsWithSportId(sportId).subscribe((seasons) => {
        expect(seasons).toEqual(seasonsWithSport);
        expect(seasons.length).toBe(2);
        seasons.forEach((season) => {
          expect((season as any).sport_id).toBe(sportId);
        });
        done();
      });

      const req = httpMock.expectOne('seasons');
      req.flush(mockSeasons);
    });

    it('should handle empty seasons for sport', (done) => {
      service.getSeasonsWithSportId(999).subscribe((seasons) => {
        expect(seasons).toEqual([]);
        seasons.forEach((season) => {
          expect((season as any).sport_id).toBe(999);
        });
        done();
      });

      const req = httpMock.expectOne('seasons');
      req.flush([]);
    });
  });

  describe('subjects', () => {
    it('should expose seasons$ observable', (done) => {
      let seasons: ISeason[] = [];
      service.seasons$.subscribe((s) => {
        seasons = s;
        done();
      });

      expect(seasons).toEqual([]);
    });

    it('should expose season$ observable', (done) => {
      let season: ISeason = {} as ISeason;
      service.season$.subscribe((s) => {
        season = s;
        done();
      });

      expect(season).toEqual({} as ISeason);
    });
  });
});
