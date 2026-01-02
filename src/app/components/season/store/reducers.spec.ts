import { seasonReducer } from './reducers';
import { seasonActions } from './actions';
import { ISeason } from '../../../type/season.type';

describe('Season Reducer', () => {
  const mockSeason: ISeason = {
    id: 1,
    year: 2024,
    description: 'Test season',
  };

  const mockSeason2: ISeason = {
    id: 2,
    year: 2023,
    description: 'Test season 2',
  };

  const getInitialState = () =>
    seasonReducer(undefined, { type: 'INIT' as any });

  it('should return initial state', () => {
    const initialState = getInitialState();
    expect(initialState.isLoading).toBe(false);
    expect(initialState.isSubmitting).toBe(false);
    expect(initialState.currentSeasonId).toBe(null);
    expect(initialState.currentSeasonYear).toBe(null);
    expect(initialState.currentSeason).toBe(null);
  });

  it('should set isLoading on getId', () => {
    const initialState = getInitialState();
    const action = seasonActions.getId();
    const state = seasonReducer(initialState, action);
    expect(state.isLoading).toBe(true);
  });

  it('should handle getSeasonIdSuccessfully', () => {
    const initialState = getInitialState();
    const action = seasonActions.getSeasonIdSuccessfully({ seasonId: 1 });
    const state = seasonReducer(initialState, action);
    expect(state.isLoading).toBe(false);
    expect(state.currentSeasonId).toBe(1);
  });

  it('should handle getSeasonIdFailure', () => {
    const initialState = getInitialState();
    const action = seasonActions.getSeasonIdFailure();
    const state = seasonReducer(initialState, action);
    expect(state.isLoading).toBe(false);
  });

  it('should set isSubmitting on create', () => {
    const initialState = getInitialState();
    const action = seasonActions.create({ request: mockSeason });
    const state = seasonReducer(initialState, action);
    expect(state.isSubmitting).toBe(true);
  });

  it('should add season on createdSuccessfully', () => {
    const initialState = getInitialState();
    const action = seasonActions.createdSuccessfully({
      currentSeason: mockSeason,
    });
    const state = seasonReducer(initialState, action);
    expect(state.entities[mockSeason.id!]).toEqual(mockSeason);
    expect(state.isSubmitting).toBe(false);
    expect(state.currentSeason).toEqual(mockSeason);
    expect(state.errors).toBe(null);
  });

  it('should handle createFailure', () => {
    const initialState = getInitialState();
    const error = { message: 'Error' };
    const action = seasonActions.createFailure();
    const state = seasonReducer(initialState, action);
    expect(state.isSubmitting).toBe(false);
    // No error prop set on failure actions
  });

  it('should set isSubmitting on delete', () => {
    const initialState = getInitialState();
    const action = seasonActions.delete({ id: 1 });
    const state = seasonReducer(initialState, action);
    expect(state.isSubmitting).toBe(true);
  });

  it('should remove season on deletedSuccessfully', () => {
    const stateWithSeason = seasonReducer(
      getInitialState(),
      seasonActions.createdSuccessfully({ currentSeason: mockSeason }),
    );
    const action = seasonActions.deletedSuccessfully({ id: mockSeason.id! });
    const state = seasonReducer(stateWithSeason, action);
    expect(state.entities[mockSeason.id!]).toBeUndefined();
    expect(state.isSubmitting).toBe(false);
    expect(state.errors).toBe(null);
  });

  it('should handle deleteFailure', () => {
    const initialState = getInitialState();
    const error = { message: 'Error' };
    const action = seasonActions.deleteFailure();
    const state = seasonReducer(initialState, action);
    expect(state.isSubmitting).toBe(false);
    // No error prop set on failure actions
  });

  it('should set isSubmitting on update', () => {
    const initialState = getInitialState();
    const action = seasonActions.update({
      id: 1,
      newSeasonData: mockSeason,
    });
    const state = seasonReducer(initialState, action);
    expect(state.isSubmitting).toBe(true);
  });

  it('should update season on updatedSuccessfully', () => {
    const stateWithSeason = seasonReducer(
      getInitialState(),
      seasonActions.createdSuccessfully({ currentSeason: mockSeason }),
    );
    const updatedSeason: ISeason = {
      ...mockSeason,
      year: 2025,
    };
    const action = seasonActions.updatedSuccessfully({ updatedSeason });
    const state = seasonReducer(stateWithSeason, action);
    expect(state.entities[mockSeason.id!].year).toBe(2025);
    expect(state.isSubmitting).toBe(false);
    expect(state.currentSeason).toEqual(updatedSeason);
    expect(state.errors).toBe(null);
  });

  it('should handle updateFailure', () => {
    const initialState = getInitialState();
    const error = { message: 'Error' };
    const action = seasonActions.updateFailure();
    const state = seasonReducer(initialState, action);
    expect(state.isSubmitting).toBe(false);
    // No error prop set on failure actions
  });

  it('should set isLoading on get', () => {
    const initialState = getInitialState();
    const action = seasonActions.get({ id: 1 });
    const state = seasonReducer(initialState, action);
    expect(state.isLoading).toBe(true);
  });

  it('should handle getItemSuccess', () => {
    const initialState = getInitialState();
    const action = seasonActions.getItemSuccess({ season: mockSeason });
    const state = seasonReducer(initialState, action);
    expect(state.isLoading).toBe(false);
    expect(state.currentSeason).toEqual(mockSeason);
    expect(state.currentSeasonYear).toBe(mockSeason.year);
  });

  it('should handle getItemFailure', () => {
    const initialState = getInitialState();
    const error = { message: 'Error' };
    const action = seasonActions.getItemFailure();
    const state = seasonReducer(initialState, action);
    expect(state.isLoading).toBe(false);
    // No error prop set on failure actions
  });

  it('should set isLoading on getAll', () => {
    const initialState = getInitialState();
    const action = seasonActions.getAll();
    const state = seasonReducer(initialState, action);
    expect(state.isLoading).toBe(true);
  });

  it('should add all seasons on getAllItemsSuccess', () => {
    const initialState = getInitialState();
    const seasons = [mockSeason, mockSeason2];
    const action = seasonActions.getAllItemsSuccess({ seasons });
    const state = seasonReducer(initialState, action);
    expect(state.entities[mockSeason.id!]).toEqual(mockSeason);
    expect(state.entities[mockSeason2.id!]).toEqual(mockSeason2);
    expect(state.isLoading).toBe(false);
  });

  it('should handle getAllItemsFailure', () => {
    const initialState = getInitialState();
    const error = { message: 'Error' };
    const action = seasonActions.getAllItemsFailure();
    const state = seasonReducer(initialState, action);
    expect(state.isLoading).toBe(false);
    // No error prop set on failure actions
  });

  it('should set isLoading on getSeasonsWithSportId', () => {
    const initialState = getInitialState();
    const action = seasonActions.getSeasonsWithSportId({ sportId: 1 });
    const state = seasonReducer(initialState, action);
    expect(state.isLoading).toBe(true);
  });

  it('should handle getAllSeasonsWithSportIDSuccess', () => {
    const initialState = getInitialState();
    const seasons = [mockSeason];
    const action = seasonActions.getAllSeasonsWithSportIDSuccess({ seasons });
    const state = seasonReducer(initialState, action);
    expect(state.entities[mockSeason.id!]).toEqual(mockSeason);
    expect(state.isLoading).toBe(false);
  });

  it('should handle getAllSeasonsWithSportIDFailure', () => {
    const initialState = getInitialState();
    const error = { message: 'Error' };
    const action = seasonActions.getAllSeasonsWithSportIDFailure();
    const state = seasonReducer(initialState, action);
    expect(state.isLoading).toBe(false);
    // No error prop set on failure actions
  });

  it('should set isLoading on getSeasonByYear', () => {
    const initialState = getInitialState();
    const action = seasonActions.getSeasonByYear({ year: 2024 });
    const state = seasonReducer(initialState, action);
    expect(state.isLoading).toBe(true);
  });

  it('should handle getSeasonByYearSuccess', () => {
    const initialState = getInitialState();
    const action = seasonActions.getSeasonByYearSuccess({
      season: mockSeason,
    });
    const state = seasonReducer(initialState, action);
    expect(state.isLoading).toBe(false);
    expect(state.currentSeason).toEqual(mockSeason);
  });

  it('should handle getSeasonByYearFailure', () => {
    const initialState = getInitialState();
    const error = { message: 'Error' };
    const action = seasonActions.getSeasonByYearFailure();
    const state = seasonReducer(initialState, action);
    expect(state.isLoading).toBe(false);
    // No error prop set on failure actions
  });

  it('should sort seasons by year descending', () => {
    const initialState = getInitialState();
    const seasons = [mockSeason2, mockSeason];
    const action = seasonActions.getAllItemsSuccess({ seasons });
    const state = seasonReducer(initialState, action);

    const sortedSeasons = Object.values(state.entities).map((s) => s.year);
    expect(sortedSeasons).toEqual([2024, 2023]);
  });
});
