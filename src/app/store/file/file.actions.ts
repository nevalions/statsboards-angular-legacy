import { createActionGroup, props } from '@ngrx/store';

export const fileActions = createActionGroup({
  source: 'file',
  events: {
    UploadFile: props<{ file: File }>(),
    UploadFileSuccess: props<{ filePathUrl: string }>(),
    UploadFileFailure: props<{ error: any }>(),

    UploadTeamLogo: props<{ file: File }>(),
    UploadTeamLogoSuccess: props<{ filePathUrl: string }>(),
    UploadTeamLogoFailure: props<{ error: any }>(),
  },
});
