import { createFeature, createReducer, on } from '@ngrx/store';
import { uiActions } from './ui.actions';

export interface UiState {
  formVisibility: { [formName: string]: boolean };
}

const initialState: UiState = {
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
  },
};

const uiFeature = createFeature({
  name: 'ui',
  reducer: createReducer(
    initialState,
    on(uiActions.toggleForm, (state, { formName }) => ({
      ...state,
      formVisibility: {
        ...state.formVisibility,
        [formName]: !state.formVisibility[formName],
      },
    })),
    on(uiActions.toggleAllForms, (state) => {
      const allVisible = Object.values(state.formVisibility).every((v) => v);
      const formVisibility = Object.fromEntries(
        Object.keys(state.formVisibility).map((formName) => [
          formName,
          !allVisible,
        ]),
      );
      return { ...state, formVisibility };
    }),
  ),
});

export const {
  name: uiFeatureKey,
  reducer: uiReducer,
  selectFormVisibility,
} = uiFeature;
