import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideEffects } from '@ngrx/effects';
import { Actions } from '@ngrx/effects';
import { provideMockStore } from '@ngrx/store/testing';
import { Store } from '@ngrx/store';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { take } from 'rxjs/operators';
import { ISeason } from '../../../type/season.type';
import { SeasonEffects } from './effects';
import * as SeasonActions from './actions';
import { SeasonService } from '../season.service';

describe('SeasonEffects', () => {
  let effects: SeasonEffects;
  let seasonServiceSpy: jasmine.SpyObj<SeasonService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let actions$: Actions;
  let store: Store;

  const mockSeason: ISeason = {
    id: 1,
    year: 2024,
    description: 'Test Season',
  };

  const mockSeasons: ISeason[] = [
    mockSeason,
    {
      id: 2,
      year: 2023,
      description: 'Season 2023',
    },
  ];

  beforeEach(() => {
    seasonServiceSpy = jasmine.createSpyObj('SeasonService', [
      'addItem',
      'findAll',
      'findById',
      'deleteItem',
      'editItem',
      'getSeasonByYearReturn',
      'getSeasonsWithSportId',
    ]);

    routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);

    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        SeasonEffects,
        provideMockStore(),
        {
          provide: Router,
          useValue: routerSpy,
        },
        {
          provide: SeasonService,
          useValue: seasonServiceSpy,
        },
      ],
    });

    effects = TestBed.inject(SeasonEffects);
    store = TestBed.inject(Store);
  });

  describe('createSeasonEffect', () => {
    it('should create a new season and dispatch success action', fakeAsync(() => {
      seasonServiceSpy.addItem.and.returnValue(of(mockSeason));

      const action = SeasonActions.seasonActions.create({
        request: mockSeason,
      });
      store.dispatch(action);

      tick();

      expect(seasonServiceSpy.addItem).toHaveBeenCalledWith(mockSeason);
      // Success action will be dispatched automatically
    }));

    it('should handle creation errors', fakeAsync(() => {
      const error = new Error('Creation failed');
      seasonServiceSpy.addItem.and.returnValue(throwError(() => error));

      const action = SeasonActions.seasonActions.create({
        request: mockSeason,
      });
      store.dispatch(action);

      tick();

      expect(seasonServiceSpy.addItem).toHaveBeenCalledWith(mockSeason);
    }));
  });

  describe('getAllSeasons', () => {
    it('should load all seasons and dispatch success action', fakeAsync(() => {
      seasonServiceSpy.findAll.and.returnValue(of(mockSeasons));

      const action = SeasonActions.seasonActions.getAll();
      store.dispatch(action);

      tick();

      expect(seasonServiceSpy.findAll).toHaveBeenCalled();
    }));

    it('should handle load errors', fakeAsync(() => {
      const error = new Error('Load failed');
      seasonServiceSpy.findAll.and.returnValue(throwError(() => error));

      const action = SeasonActions.seasonActions.getAll();
      store.dispatch(action);

      tick();

      expect(seasonServiceSpy.findAll).toHaveBeenCalled();
    }));
  });

  describe('getSeasonByIdEffect', () => {
    it('should load season by id and dispatch success action', fakeAsync(() => {
      seasonServiceSpy.findById.and.returnValue(of(mockSeason));

      const action = SeasonActions.seasonActions.get({ id: 1 });
      store.dispatch(action);

      tick();

      expect(seasonServiceSpy.findById).toHaveBeenCalledWith(1);
    }));

    it('should handle load errors', fakeAsync(() => {
      const error = new Error('Load failed');
      seasonServiceSpy.findById.and.returnValue(throwError(() => error));

      const action = SeasonActions.seasonActions.get({ id: 1 });
      store.dispatch(action);

      tick();

      expect(seasonServiceSpy.findById).toHaveBeenCalledWith(1);
    }));
  });

  describe('getSeasonByIdSuccessEffect', () => {
    it('should load season by id from route and dispatch success action', fakeAsync(() => {
      seasonServiceSpy.findById.and.returnValue(of(mockSeason));

      const action = SeasonActions.seasonActions.getSeasonIdSuccessfully({
        seasonId: 1,
      });
      store.dispatch(action);

      tick();

      expect(seasonServiceSpy.findById).toHaveBeenCalledWith(1);
    }));

    it('should handle load errors', fakeAsync(() => {
      const error = new Error('Load failed');
      seasonServiceSpy.findById.and.returnValue(throwError(() => error));

      const action = SeasonActions.seasonActions.getSeasonIdSuccessfully({
        seasonId: 1,
      });
      store.dispatch(action);

      tick();

      expect(seasonServiceSpy.findById).toHaveBeenCalledWith(1);
    }));
  });

  describe('getSeasonByYearEffect', () => {
    it('should load season by year and dispatch success action', fakeAsync(() => {
      seasonServiceSpy.getSeasonByYearReturn.and.returnValue(of(mockSeason));

      const action = SeasonActions.seasonActions.getSeasonByYear({
        year: 2024,
      });
      store.dispatch(action);

      tick();

      expect(seasonServiceSpy.getSeasonByYearReturn).toHaveBeenCalledWith(2024);
    }));

    it('should handle load errors', fakeAsync(() => {
      const error = new Error('Load failed');
      seasonServiceSpy.getSeasonByYearReturn.and.returnValue(
        throwError(() => error),
      );

      const action = SeasonActions.seasonActions.getSeasonByYear({
        year: 2024,
      });
      store.dispatch(action);

      tick();

      expect(seasonServiceSpy.getSeasonByYearReturn).toHaveBeenCalledWith(2024);
    }));
  });

  describe('getSeasonsWithSportIdEffect', () => {
    it('should load seasons by sport id and dispatch success action', fakeAsync(() => {
      seasonServiceSpy.getSeasonsWithSportId.and.returnValue(of(mockSeasons));

      const action = SeasonActions.seasonActions.getSeasonsWithSportId({
        sportId: 1,
      });
      store.dispatch(action);

      tick();

      expect(seasonServiceSpy.getSeasonsWithSportId).toHaveBeenCalledWith(1);
    }));

    it('should handle load errors', fakeAsync(() => {
      const error = new Error('Load failed');
      seasonServiceSpy.getSeasonsWithSportId.and.returnValue(
        throwError(() => error),
      );

      const action = SeasonActions.seasonActions.getSeasonsWithSportId({
        sportId: 1,
      });
      store.dispatch(action);

      tick();

      expect(seasonServiceSpy.getSeasonsWithSportId).toHaveBeenCalledWith(1);
    }));
  });

  describe('deleteSeasonEffect', () => {
    it('should delete season and dispatch success action', fakeAsync(() => {
      seasonServiceSpy.deleteItem.and.returnValue(of(mockSeason));

      const action = SeasonActions.seasonActions.delete({ id: 1 });
      store.dispatch(action);

      tick();

      expect(seasonServiceSpy.deleteItem).toHaveBeenCalledWith(1);
    }));

    it('should handle delete errors', fakeAsync(() => {
      const error = new Error('Delete failed');
      seasonServiceSpy.deleteItem.and.returnValue(throwError(() => error));

      const action = SeasonActions.seasonActions.delete({ id: 1 });
      store.dispatch(action);

      tick();

      expect(seasonServiceSpy.deleteItem).toHaveBeenCalledWith(1);
    }));
  });

  describe('navigateOnSeasonDeletion$', () => {
    it('should navigate to root on successful deletion', fakeAsync(() => {
      const action = SeasonActions.seasonActions.deletedSuccessfully({ id: 1 });
      store.dispatch(action);

      tick();

      expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/');
    }));
  });
});
