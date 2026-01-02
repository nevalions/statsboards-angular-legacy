import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { Store } from '@ngrx/store';
import { Observable, of, Subject, firstValueFrom } from 'rxjs';
import { take } from 'rxjs/operators';
import { vi } from 'vitest';
import { ISeason } from '../../type/season.type';
import { Season } from './season';
import * as SeasonActions from './store/actions';

describe('Season', () => {
  let service: Season;
  let store: any;
  let seasonSubject: Subject<ISeason | null | undefined>;

  const mockSeason: ISeason = {
    id: 1,
    year: 2024,
    description: 'Test Season',
  };

  beforeEach(() => {
    seasonSubject = new Subject();
    store = {
      dispatch: vi.fn(),
      select: vi.fn().mockReturnValue(seasonSubject.asObservable()),
    };

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
    it('should emit current season from store', async () => {
      const promise = firstValueFrom(service.season$.pipe(take(1)));
      seasonSubject.next(mockSeason);

      const season = await promise;
      expect(season).toEqual(mockSeason);
      expect(store.select).toHaveBeenCalled();
    });

    it('should select current season from state', () => {
      seasonSubject.next(mockSeason);
      service.season$.subscribe();

      expect(store.select).toHaveBeenCalled();
    });

    it('should emit null when season is null', async () => {
      const promise = firstValueFrom(service.season$.pipe(take(1)));
      seasonSubject.next(null);

      const season = await promise;
      expect(season).toBeNull();
    });

    it('should emit undefined when season is undefined', async () => {
      const promise = firstValueFrom(service.season$.pipe(take(1)));
      seasonSubject.next(undefined);

      const season = await promise;
      expect(season).toBeUndefined();
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
    it('should select from season slice of state', async () => {
      const promise = firstValueFrom(service.season$.pipe(take(1)));
      seasonSubject.next(mockSeason);

      const season = await promise;
      expect(season).toEqual(mockSeason);
    });
  });
});
