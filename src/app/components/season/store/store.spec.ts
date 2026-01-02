import { TestBed } from '@angular/core/testing';
import { seasonReducer, SeasonState } from './reducers';
import { seasonActions } from './actions';
import { ISeason } from '../../../type/season.type';
import { getDefaultCrudStore } from '../../../type/store.intarface';
import { createEntityAdapter, EntityState } from '@ngrx/entity';

const adapter = createEntityAdapter<ISeason>();

describe('Season Reducer', () => {
  const mockSeason: ISeason = {
    id: 1,
    year: 2024,
    description: 'Test Season',
  };

  const mockSeason2: ISeason = {
    id: 2,
    year: 2023,
    description: 'Test Season 2',
  };

  const initialState: SeasonState = {
    ...getDefaultCrudStore(),
    currentSeasonId: null,
    currentSeasonYear: null,
    currentSeason: null,
    ids: [],
    entities: {},
  };

  describe('initial state', () => {
    it('should return initial state', () => {
      const action = { type: 'NOOP' } as any;
      const state = seasonReducer(undefined, action);

      expect(state).toEqual(initialState);
    });

    it('should have correct initial values', () => {
      expect(initialState.isLoading).toBe(false);
      expect(initialState.isSubmitting).toBe(false);
      expect(initialState.errors).toBe(null);
      expect(initialState.currentSeasonId).toBe(null);
      expect(initialState.currentSeasonYear).toBe(null);
      expect(initialState.ids).toEqual([]);
      expect(initialState.currentSeason).toBe(null);
    });
  });

  describe('Get Season ID actions', () => {
    it('should set isLoading to true on getId', () => {
      const action = seasonActions.getId();
      const state = seasonReducer(initialState, action);

      expect(state.isLoading).toBe(true);
    });

    it('should set season ID and isLoading to false on success', () => {
      const action = seasonActions.getSeasonIdSuccessfully({ seasonId: 1 });
      const state = seasonReducer(initialState, action);

      expect(state.currentSeasonId).toBe(1);
      expect(state.isLoading).toBe(false);
    });

    it('should set isLoading to false on failure', () => {
      const action = seasonActions.getSeasonIdFailure();
      const state = seasonReducer(initialState, action);

      expect(state.isLoading).toBe(false);
    });
  });

  describe('Create actions', () => {
    it('should set isSubmitting to true on create', () => {
      const action = seasonActions.create({ request: mockSeason });
      const state = seasonReducer(initialState, action);

      expect(state.isSubmitting).toBe(true);
    });

    it('should add season and set current on success', () => {
      const existingState: SeasonState = {
        ...initialState,
        ids: [2],
        entities: { 2: mockSeason2 },
      };
      const action = seasonActions.createdSuccessfully({
        currentSeason: mockSeason,
      });
      const state = seasonReducer(existingState, action);

      expect(state.isSubmitting).toBe(false);
      expect(state.currentSeason).toEqual(mockSeason);
      const allSeasons = adapter.getSelectors().selectAll(state);
      expect(allSeasons.length).toBe(2);
      expect(allSeasons).toContain(mockSeason);
      expect(allSeasons).toContain(mockSeason2);
      expect(state.errors).toBeNull();
    });

    it('should set error and isSubmitting to false on failure', () => {
      const error = { message: 'Creation failed' };
      const action = seasonActions.createFailure();
      const state = seasonReducer(initialState, action);

      expect(state.isSubmitting).toBe(false);
      expect(state.errors).toBeNull();
    });
  });

  describe('Get Item actions', () => {
    it('should set isLoading to true on get', () => {
      const action = seasonActions.get({ id: 1 });
      const state = seasonReducer(initialState, action);

      expect(state.isLoading).toBe(true);
    });

    it('should set current season, year, and isLoading to false on success', () => {
      const action = seasonActions.getItemSuccess({ season: mockSeason });
      const state = seasonReducer(initialState, action);

      expect(state.currentSeason).toEqual(mockSeason);
      expect(state.currentSeasonYear).toBe(mockSeason.year);
      expect(state.currentSeasonId).toBe(mockSeason.id);
      expect(state.isLoading).toBe(false);
    });

    it('should set error and isLoading to false on failure', () => {
      const error = { message: 'Get failed' };
      const action = seasonActions.getItemFailure();
      const state = seasonReducer(initialState, action);

      expect(state.isLoading).toBe(false);
      expect(state.errors).toBeNull();
    });
  });

  describe('Get All actions', () => {
    it('should set isLoading to true on getAll', () => {
      const action = seasonActions.getAll();
      const state = seasonReducer(initialState, action);

      expect(state.isLoading).toBe(true);
    });

    it('should set all seasons and isLoading to false on success', () => {
      const seasons = [mockSeason, mockSeason2];
      const action = seasonActions.getAllItemsSuccess({ seasons });
      const state = seasonReducer(initialState, action);

      const allSeasons = adapter.getSelectors().selectAll(state);
      expect(allSeasons).toEqual(seasons);
      expect(state.isLoading).toBe(false);
    });

    it('should set error and isLoading to false on failure', () => {
      const error = { message: 'Get all failed' };
      const action = seasonActions.getAllItemsFailure();
      const state = seasonReducer(initialState, action);

      expect(state.isLoading).toBe(false);
      expect(state.errors).toBeNull();
    });
  });

  describe('Get Season by Year actions', () => {
    it('should set isLoading to true on getSeasonByYear', () => {
      const action = seasonActions.getSeasonByYear({ year: 2024 });
      const state = seasonReducer(initialState, action);

      expect(state.isLoading).toBe(true);
    });

    it('should set current season and isLoading to false on success', () => {
      const action = seasonActions.getSeasonByYearSuccess({
        season: mockSeason,
      });
      const state = seasonReducer(initialState, action);

      expect(state.currentSeason).toEqual(mockSeason);
      expect(state.isLoading).toBe(false);
    });

    it('should set error and isLoading to false on failure', () => {
      const error = { message: 'Get by year failed' };
      const action = seasonActions.getSeasonByYearFailure();
      const state = seasonReducer(initialState, action);

      expect(state.isLoading).toBe(false);
      expect(state.errors).toBeNull();
    });
  });

  describe('Get Seasons with Sport ID actions', () => {
    it('should set isLoading to true on getSeasonsWithSportId', () => {
      const action = seasonActions.getSeasonsWithSportId({ sportId: 1 });
      const state = seasonReducer(initialState, action);

      expect(state.isLoading).toBe(true);
    });

    it('should set isLoading to false on success', () => {
      const seasons = [mockSeason, mockSeason2];
      const action = seasonActions.getAllSeasonsWithSportIDSuccess({
        seasons,
      });
      const state = seasonReducer(initialState, action);

      expect(state.isLoading).toBe(false);
    });

    it('should set error and isLoading to false on failure', () => {
      const error = { message: 'Get by sport failed' };
      const action = seasonActions.getAllSeasonsWithSportIDFailure();
      const state = seasonReducer(initialState, action);

      expect(state.isLoading).toBe(false);
      expect(state.errors).toBeNull();
    });
  });

  describe('Update actions', () => {
    it('should set isSubmitting to true on update', () => {
      const action = seasonActions.update({
        id: 1,
        newSeasonData: { ...mockSeason, description: 'Updated' },
      });
      const state = seasonReducer(initialState, action);

      expect(state.isSubmitting).toBe(true);
    });

    it('should update season and set current on success', () => {
      const updatedSeason: ISeason = {
        ...mockSeason,
        description: 'Updated Season',
      };
      const existingState: SeasonState = {
        ...initialState,
        ids: [1, 2],
        entities: { 1: mockSeason, 2: mockSeason2 },
      };
      const action = seasonActions.updatedSuccessfully({
        updatedSeason,
      });
      const state = seasonReducer(existingState, action);

      expect(state.isSubmitting).toBe(false);
      expect(state.currentSeason).toEqual(updatedSeason);
      const allSeasons = adapter.getSelectors().selectAll(state);
      expect(allSeasons.length).toBe(2);
      expect(allSeasons.find((s) => s.id === 1)).toEqual(updatedSeason);
      expect(allSeasons.find((s) => s.id === 2)).toEqual(mockSeason2);
      expect(state.errors).toBeNull();
    });

    it('should set error and isSubmitting to false on failure', () => {
      const error = { message: 'Update failed' };
      const action = seasonActions.updateFailure();
      const state = seasonReducer(initialState, action);

      expect(state.isSubmitting).toBe(false);
      expect(state.errors).toBeNull();
    });
  });

  describe('Delete actions', () => {
    it('should set isSubmitting to true on delete', () => {
      const action = seasonActions.delete({ id: 1 });
      const state = seasonReducer(initialState, action);

      expect(state.isSubmitting).toBe(true);
    });

    it('should remove season on success', () => {
      const existingState: SeasonState = {
        ...initialState,
        ids: [1, 2],
        entities: { 1: mockSeason, 2: mockSeason2 },
      };
      const action = seasonActions.deletedSuccessfully({ id: 1 });
      const state = seasonReducer(existingState, action);

      expect(state.isSubmitting).toBe(false);
      const allSeasons = adapter.getSelectors().selectAll(state);
      expect(allSeasons.length).toBe(1);
      expect(allSeasons).not.toContain(mockSeason);
      expect(allSeasons).toContain(mockSeason2);
      expect(state.errors).toBeNull();
    });

    it('should set error and isSubmitting to false on failure', () => {
      const error = { message: 'Delete failed' };
      const action = seasonActions.deleteFailure();
      const state = seasonReducer(initialState, action);

      expect(state.isSubmitting).toBe(false);
      expect(state.errors).toBeNull();
    });
  });

  describe('state immutability', () => {
    it('should return new state reference on action', () => {
      const action = seasonActions.getAll();
      const state = seasonReducer(initialState, action);

      expect(state).not.toBe(initialState);
    });

    it('should not mutate existing state', () => {
      const existingState: SeasonState = {
        ...initialState,
        ids: [1, 2],
        entities: { 1: mockSeason, 2: mockSeason2 },
      };
      const action = seasonActions.deletedSuccessfully({ id: 1 });
      const originalIds = [...existingState.ids] as any[];
      const originalEntities = { ...existingState.entities };

      seasonReducer(existingState, action);

      expect(existingState.ids).toEqual(originalIds);
      expect(existingState.entities).toEqual(originalEntities);
    });
  });

  describe('unknown action', () => {
    it('should return current state for unknown action', () => {
      const action = { type: 'UNKNOWN_ACTION' } as any;
      const existingState: SeasonState = {
        ...initialState,
        ids: [1],
        entities: { 1: mockSeason },
      };
      const state = seasonReducer(existingState, action);

      expect(state).toBe(existingState);
    });
  });
});
