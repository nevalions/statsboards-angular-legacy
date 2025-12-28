import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { of } from 'rxjs';
import { ISeason } from '../../type/season.type';
import { SeasonComponent } from './season.component';
import { SeasonService } from './season.service';
import { SortService } from '../../services/sort.service';

describe('SeasonComponent', () => {
  let component: SeasonComponent;
  let fixture: ComponentFixture<SeasonComponent>;
  let seasonServiceSpy: jasmine.SpyObj<SeasonService>;

  const mockSeasons: ISeason[] = [
    { id: 1, year: 2024, description: 'Season 2024' },
    { id: 2, year: 2023, description: 'Season 2023' },
    { id: 3, year: 2025, description: 'Season 2025' },
  ];

  beforeEach(() => {
    seasonServiceSpy = jasmine.createSpyObj('SeasonService', ['findAll']);

    TestBed.configureTestingModule({
      imports: [SeasonComponent],
      providers: [
        { provide: SeasonService, useValue: seasonServiceSpy },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    });

    fixture = TestBed.createComponent(SeasonComponent);
    component = fixture.componentInstance;
  });

  describe('component creation', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should inject SeasonService', () => {
      expect(component['seasonService']).toBeTruthy();
    });
  });

  describe('properties', () => {
    it('should have dataList$ observable', () => {
      expect(component.dataList$).toBeDefined();
    });

    it('should have mapItemToLabel method', () => {
      expect(component.mapItemToLabel).toBeInstanceOf(Function);
    });

    it('should have titleProperty', () => {
      expect(component.titleProperty).toBe('year');
    });

    it('should have seasonRoute method', () => {
      expect(component.seasonRoute).toBeInstanceOf(Function);
    });

    it('should have seasonTournamentRoute method', () => {
      expect(component.seasonTournamentRoute).toBeInstanceOf(Function);
    });

    it('should have seasonHref method', () => {
      expect(component.seasonHref).toBeInstanceOf(Function);
    });
  });

  describe('mapItemToLabel', () => {
    it('should return year as string', () => {
      const item = { year: 2024 };
      const result = component.mapItemToLabel(item as any);
      expect(result).toBe('2024');
    });

    it('should return empty string when year is undefined', () => {
      const item = {};
      const result = component.mapItemToLabel(item as any);
      expect(result).toBe('');
    });

    it('should return empty string when year is null', () => {
      const item = { year: null };
      const result = component.mapItemToLabel(item as any);
      expect(result).toBe('');
    });
  });

  describe('seasonRoute', () => {
    it('should return route array with year', () => {
      const item = { year: 2024 } as any;
      const result = component.seasonRoute(item);
      expect(result).toEqual(['/seasons/year/2024']);
    });

    it('should handle year 0', () => {
      const item = { year: 0 } as any;
      const result = component.seasonRoute(item);
      expect(result).toEqual(['/seasons/year/0']);
    });
  });

  describe('seasonTournamentRoute', () => {
    it('should return route array with year', () => {
      const item = { year: 2024, routeInfo: undefined } as any;
      const result = component.seasonTournamentRoute(item);
      expect(result).toEqual(['/seasons/year/2024']);
    });

    it('should append routeInfo when present', () => {
      const item = {
        year: 2024,
        routeInfo: '/tournaments',
      } as any;
      const result = component.seasonTournamentRoute(item);
      expect(result).toEqual(['/seasons/year/2024/tournaments']);
    });
  });

  describe('seasonHref', () => {
    it('should return href with year', () => {
      const item = { year: 2024 } as any;
      const result = component.seasonHref(item);
      expect(result).toBe('/seasons/year/2024');
    });
  });

  describe('ngOnInit', () => {
    it('should load seasons on init', fakeAsync(() => {
      seasonServiceSpy.findAll.and.returnValue(of(mockSeasons));

      component.ngOnInit();
      tick();

      expect(seasonServiceSpy.findAll).toHaveBeenCalled();
    }));

    it('should sort seasons by year descending', fakeAsync(() => {
      seasonServiceSpy.findAll.and.returnValue(of(mockSeasons));

      component.ngOnInit();
      tick();

      component.dataList$.subscribe((data) => {
        expect(data[0].year).toBe(2025);
        expect(data[1].year).toBe(2024);
        expect(data[2].year).toBe(2023);
      });
    }));

    it('should handle empty seasons list', fakeAsync(() => {
      seasonServiceSpy.findAll.and.returnValue(of([]));

      component.ngOnInit();
      tick();

      component.dataList$.subscribe((data) => {
        expect(data).toEqual([]);
        expect(data.length).toBe(0);
      });
    }));

    it('should handle service error', fakeAsync(() => {
      seasonServiceSpy.findAll.and.returnValue(of([]));

      component.ngOnInit();
      tick();

      expect(seasonServiceSpy.findAll).toHaveBeenCalled();
    }));
  });

  describe('template rendering', () => {
    it('should not crash with no data', () => {
      seasonServiceSpy.findAll.and.returnValue(of([]));

      fixture.detectChanges();
      const element = fixture.nativeElement;
      expect(element).toBeTruthy();
    });

    it('should render seasons when data available', fakeAsync(() => {
      seasonServiceSpy.findAll.and.returnValue(of(mockSeasons));

      component.ngOnInit();
      tick();
      fixture.detectChanges();

      const element = fixture.nativeElement;
      expect(element).toBeTruthy();
    }));
  });
});
