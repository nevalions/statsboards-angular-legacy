import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { take } from 'rxjs/operators';
import { ISeason } from '../../type/season.type';
import { Season } from './season';
import * as SeasonActions from './store/actions';

describe('Season', () => {
  let service: Season;
  let store: jasmine.SpyObj<Store>;

  const mockSeason: ISeason = {
    id: 1,
    year: 2024,
    description: 'Test Season',
  };

  beforeEach(() => {
    store = jasmine.createSpyObj('Store', ['dispatch', 'select']);

    TestBed.configureTestingModule({
      providers: [
        Season,
        {
          provide: Store,
          useValue: store,
        },
      ],
    });

    service = TestBed.inject(Season);
  });

  describe('service creation', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should have season$ observable', () => {
      expect(service.season$).toBeDefined();
      expect(service.season$).toBeInstanceOf(Observable);
    });
  });

  describe('season$', () => {
    it('should emit current season from store', (done) => {
      store.select.and.returnValue(of(mockSeason));

      service.season$.pipe(take(1)).subscribe((season) => {
        expect(season).toEqual(mockSeason);
        expect(store.select).toHaveBeenCalled();
        done();
      });
    });

    it('should select current season from state', () => {
      store.select.and.returnValue(of(mockSeason));

      service.season$.subscribe();

      expect(store.select).toHaveBeenCalled();
    });

    it('should emit null when season is null', (done) => {
      store.select.and.returnValue(of(null));

      service.season$.pipe(take(1)).subscribe((season) => {
        expect(season).toBeNull();
        done();
      });
    });

    it('should emit undefined when season is undefined', (done) => {
      store.select.and.returnValue(of(undefined));

      service.season$.pipe(take(1)).subscribe((season) => {
        expect(season).toBeUndefined();
        done();
      });
    });
  });

  describe('loadCurrentSeason', () => {
    it('should dispatch getId action', () => {
      service.loadCurrentSeason();

      expect(store.dispatch).toHaveBeenCalledWith(
        SeasonActions.seasonActions.getId(),
      );
    });

    it('should dispatch action only once when called', () => {
      service.loadCurrentSeason();
      service.loadCurrentSeason();

      expect(store.dispatch).toHaveBeenCalledTimes(1);
    });
  });

  describe('store selector', () => {
    it('should select from season slice of state', (done) => {
      const mockState = {
        season: {
          currentSeason: mockSeason,
          isLoading: false,
          isSubmitting: false,
          errors: null,
          currentSeasonId: 1,
          currentSeasonYear: 2024,
          allSeasons: [mockSeason],
        },
      };

      const selector = jasmine
        .createSpy('selector')
        .and.returnValue(mockSeason);
      store.select.and.returnValue(of(mockSeason));

      service.season$.pipe(take(1)).subscribe((season) => {
        expect(season).toEqual(mockSeason);
        done();
      });
    });
  });
});
