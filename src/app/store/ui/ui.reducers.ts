import { createFeature, createReducer, on } from '@ngrx/store';
import { uiActions } from './ui.actions';

export interface UiState {
  formVisibility: { [formName: string]: boolean };
}

let initialState: UiState = {
  formVisibility: {
    showHideAll: true,
    scoreInputs: true,
    scoreButtons: true,
    qtrForm: true,
    downAndDistanceForm: true,
    timeoutBtns: true,
    timeForms: true,
    changeTeamsForms: true,
    changeScoreBoardForms: true,
    sponsorsForms: true,
  },
};

let localStorageState = localStorage.getItem('ui');

if (localStorageState) {
  try {
    initialState = { ...initialState, ...JSON.parse(localStorageState) };
  } catch (e) {
    console.error(
      'Error parsing state from local storage, fallback to initial state',
      e,
    );
  }
}

const uiFeature = createFeature({
  name: 'ui',
  reducer: createReducer(
    initialState,
    on(uiActions.toggleForm, (state, { formName }) => {
      const newState = {
        ...state,
        formVisibility: {
          ...state.formVisibility,
          [formName]: !state.formVisibility[formName],
        },
      };
      localStorage.setItem('ui', JSON.stringify(newState));
      return newState;
    }),
    on(uiActions.toggleAllForms, (state) => {
      const allVisible = Object.values(state.formVisibility).every((v) => v);
      const formVisibility = Object.fromEntries(
        Object.keys(state.formVisibility).map((formName) => [
          formName,
          !allVisible,
        ]),
      );
      const newState = { ...state, formVisibility };
      localStorage.setItem('ui', JSON.stringify(newState));
      return newState;
    }),
    on(uiActions.loadStateFromLocalStorage, (state) => {
      let localStorageState = localStorage.getItem('ui');

      if (localStorageState) {
        try {
          return { ...state, ...JSON.parse(localStorageState) };
        } catch (e) {
          console.error('Error parsing state from local storage', e);
        }
      }

      return state;
    }),
  ),
});

export const {
  name: uiFeatureKey,
  reducer: uiReducer,
  selectFormVisibility,
} = uiFeature;
