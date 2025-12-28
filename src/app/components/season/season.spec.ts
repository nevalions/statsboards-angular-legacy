import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { Store } from '@ngrx/store';
import { Observable, of, Subject } from 'rxjs';
import { take } from 'rxjs/operators';
import { ISeason } from '../../type/season.type';
import { Season } from './season';
import * as SeasonActions from './store/actions';

describe('Season', () => {
  let service: Season;
  let store: jasmine.SpyObj<Store>;
  let seasonSubject: Subject<ISeason | null | undefined>;

  const mockSeason: ISeason = {
    id: 1,
    year: 2024,
    description: 'Test Season',
  };

  beforeEach(() => {
    seasonSubject = new Subject();
    store = jasmine.createSpyObj('Store', ['dispatch', 'select']);
    store.select.and.returnValue(seasonSubject.asObservable());

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
      service.season$.pipe(take(1)).subscribe((season) => {
        expect(season).toEqual(mockSeason);
        expect(store.select).toHaveBeenCalled();
        done();
      });

      seasonSubject.next(mockSeason);
    });

    it('should select current season from state', () => {
      seasonSubject.next(mockSeason);

      service.season$.subscribe();

      expect(store.select).toHaveBeenCalled();
    });

    it('should emit null when season is null', (done) => {
      service.season$.pipe(take(1)).subscribe((season) => {
        expect(season).toBeNull();
        done();
      });

      seasonSubject.next(null);
    });

    it('should emit undefined when season is undefined', (done) => {
      service.season$.pipe(take(1)).subscribe((season) => {
        expect(season).toBeUndefined();
        done();
      });

      seasonSubject.next(undefined);
    });
  });

  describe('loadCurrentSeason', () => {
    it('should dispatch getId action', () => {
      service.loadCurrentSeason();

      expect(store.dispatch).toHaveBeenCalledWith(
        SeasonActions.seasonActions.getId(),
      );
    });

    it('should dispatch action each time called', () => {
      service.loadCurrentSeason();
      service.loadCurrentSeason();

      expect(store.dispatch).toHaveBeenCalledTimes(2);
    });
  });

  describe('store selector', () => {
    it('should select from season slice of state', (done) => {
      service.season$.pipe(take(1)).subscribe((season) => {
        expect(season).toEqual(mockSeason);
        done();
      });

      seasonSubject.next(mockSeason);
    });
  });
});
