import { createFeature, createReducer, on } from '@ngrx/store';
import { fileActions } from './file.actions';

export interface FileState {
  isFileLoading: boolean;
  uploadedFile: File | null;
  uploadedTeamLogo: File | null;
  filePathUrl: string;
  teamLogoUrl: string;
  error: any;
}

export const initialState: FileState = {
  isFileLoading: false,
  uploadedFile: null,
  uploadedTeamLogo: null,
  filePathUrl: '',
  teamLogoUrl: '',
  error: null,
};

const fileFeature = createFeature({
  name: 'file',
  reducer: createReducer(
    initialState,
    on(fileActions.uploadFile, (state) => ({
      ...state,
      isFileLoading: true,
    })),
    on(fileActions.uploadFileSuccess, (state, action) => ({
      ...state,
      isFileLoading: false,
      filePathUrl: action.filePathUrl,
    })),
    on(fileActions.uploadFileFailure, (state) => ({
      ...state,
      isFileLoading: false,
    })),

    on(fileActions.uploadTeamLogo, (state, { file }) => ({
      ...state,
      uploadedFile: file,
      isFileLoading: true,
    })),
    on(fileActions.uploadTeamLogoSuccess, (state, action) => ({
      ...state,
      isFileLoading: false,
      teamLogoUrl: action.filePathUrl,
    })),
    on(fileActions.uploadTeamLogoFailure, (state) => ({
      ...state,
      isFileLoading: false,
    })),
  ),
});

export const {
  name: fileFeatureKey,
  reducer: fileReducer,
  selectTeamLogoUrl,
  selectIsFileLoading,
  selectUploadedTeamLogo,
  selectUploadedFile,
  selectFilePathUrl,
} = fileFeature;
