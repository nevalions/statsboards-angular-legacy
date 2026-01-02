import {
  TuiInputModule,
  TuiInputNumberModule,
  TuiInputSliderModule,
} from '@taiga-ui/legacy';
import { TuiValueChanges } from '@taiga-ui/cdk';
import { TuiError } from '@taiga-ui/core';
import { Component, Input, OnChanges, SimpleChanges, inject } from '@angular/core';
import { catchError, finalize, map, Observable, of, Subject } from 'rxjs';
import { IMatchFullDataWithScoreboard } from '../../../../type/match.type';
import { AsyncPipe } from '@angular/common';
import { ToggleVisibleButtonComponent } from '../../../ui/buttons/toggle-visible-button/toggle-visible-button.component';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  TuiFileLike,
  TuiFieldErrorPipe,
  TuiSwitch,
  TuiFiles,
} from '@taiga-ui/kit';
import { TuiHint } from '@taiga-ui/core';
import { AdminSubmitButtonComponent } from '../../../ui/buttons/admin-submit-button/admin-submit-button.component';
import { ImageService } from '../../../../services/image.service';
import { switchMap } from 'rxjs/operators';
import { ScoreboardData } from '../../../../components/scoreboard-data/scoreboard-data';
import { IScoreboard } from '../../../../type/matchdata.type';
import { Websocket } from '../../../../store/websocket/websocket';

@Component({
  selector: 'app-change-teams-forms',
  standalone: true,
  imports: [
    ToggleVisibleButtonComponent,
    AsyncPipe,
    ReactiveFormsModule,
    TuiInputModule,
    TuiFieldErrorPipe,
    AdminSubmitButtonComponent,
    TuiFiles,
    TuiSwitch,
    TuiInputNumberModule,
    TuiInputSliderModule,
    TuiHint,
    TuiError,
  ],
  templateUrl: './change-teams-forms.component.html',
  styleUrl: './change-teams-forms.component.less',
})
export class ChangeTeamsFormsComponent implements OnChanges {
  private scoreboardData = inject(ScoreboardData);
  private imageService = inject(ImageService);
  private websocket = inject(Websocket);

  @Input() changeTeamsFormsVisible$!: Observable<boolean>;
  @Input() data: IMatchFullDataWithScoreboard | undefined;
  @Input() disabled: boolean = false;

  readonly rejectedTeamAFiles$ = new Subject<TuiFileLike | null>();
  readonly loadingTeamAFiles$ = new Subject<TuiFileLike | null>();
  readonly rejectedTeamBFiles$ = new Subject<TuiFileLike | null>();
  readonly loadingTeamBFiles$ = new Subject<TuiFileLike | null>();

  teamDataForm: FormGroup;

  constructor() {
    this.teamDataForm = this.initForm();
  }

  public teamALogoForm = new FormControl();
  public teamBLogoForm = new FormControl();

  readonly min = 0.1;
  readonly max = 5;
  readonly sliderStep = 0.1;
  readonly steps = (this.max - this.min) / this.sliderStep;
  readonly quantum = 0.01;

  createLoadedLogo$(
    logoForm: FormControl,
    loadLogoMethod: (file: File) => Observable<TuiFileLike | null>,
  ): Observable<TuiFileLike | null> {
    return logoForm.valueChanges.pipe(
      switchMap((file) => (file ? loadLogoMethod(file) : of(null))),
    );
  }

  loadTeamLogo(
    file: File,
    loadingFiles$: Subject<TuiFileLike | null>,
    controlName: string,
  ): Observable<TuiFileLike | null> {
    loadingFiles$.next(file);

    if (this.data && file && file.name) {
      return this.imageService
        .uploadResizeImage(
          file,
          `matches/id/${this.data.match_id}/upload_resize_logo`,
        )
        .pipe(
          map((response: any) => {
            // console.log(response);
            // console.log(response.logoUrl);
            this.teamDataForm.controls[controlName].setValue(response.webview);

            return file;
          }),
          catchError((error) => {
            console.error('Error while uploading logo:', error);
            return of(null);
          }),
          finalize(() => {
            loadingFiles$.next(null);
          }),
        );
    }

    return of(null);
  }

  readonly loadedTeamALogo$ = this.createLoadedLogo$(
    this.teamALogoForm,
    (file: File) =>
      this.loadTeamLogo(file, this.loadingTeamAFiles$, 'teamALogo'),
  );

  readonly loadedTeamBLogo$ = this.createLoadedLogo$(
    this.teamBLogoForm,
    (file: File) =>
      this.loadTeamLogo(file, this.loadingTeamBFiles$, 'teamBLogo'),
  );

  onReject(team: 'a' | 'b', file: TuiFileLike | readonly TuiFileLike[]): void {
    if (team === 'a') {
      this.rejectedTeamAFiles$.next(file as TuiFileLike);
    } else if (team === 'b') {
      this.rejectedTeamBFiles$.next(file as TuiFileLike);
    }
  }

  removeFile(team: 'a' | 'b'): void {
    if (team === 'a') {
      this.teamALogoForm.setValue(null);
    } else if (team === 'b') {
      this.teamBLogoForm.setValue(null);
    }
  }

  clearRejected(team: 'a' | 'b'): void {
    if (team === 'a') {
      this.removeFile('a');
      this.rejectedTeamAFiles$.next(null);
    } else if (team === 'b') {
      this.removeFile('b');
      this.rejectedTeamBFiles$.next(null);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data']) {
      this.teamDataForm = this.initForm();
    }
    if (changes['disabled']) {
      if (this.disabled) {
        this.teamDataForm.disable();
      } else {
        this.teamDataForm.enable();
      }
    }
  }

  private initForm(): FormGroup {
    return new FormGroup({
      teamATitle: new FormControl<string | null | undefined>(
        this.data?.scoreboard_data?.team_a_game_title,
        Validators.minLength(3),
      ),
      useTeamAGameTitle: new FormControl<boolean>(
        this.data?.scoreboard_data?.use_team_a_game_title !== undefined
          ? this.data.scoreboard_data.use_team_a_game_title
          : false,
      ),
      teamBTitle: new FormControl<string | null | undefined>(
        this.data?.scoreboard_data?.team_b_game_title,
        Validators.minLength(3),
      ),
      useTeamBGameTitle: new FormControl<boolean>(
        this.data?.scoreboard_data?.use_team_b_game_title !== undefined
          ? this.data.scoreboard_data.use_team_b_game_title
          : false,
      ),
      teamALogo: new FormControl<string | null | undefined>(
        this.data?.scoreboard_data?.team_a_game_logo,
      ),
      useTeamAGameLogo: new FormControl<boolean>(
        this.data?.scoreboard_data?.use_team_a_game_logo !== undefined
          ? this.data.scoreboard_data.use_team_a_game_logo
          : false,
      ),
      scaleLogoA: new FormControl<number>(
        this.data?.scoreboard_data?.scale_logo_a !== undefined
          ? this.data.scoreboard_data.scale_logo_a
          : 2,
      ),
      teamBLogo: new FormControl<string | null | undefined>(
        this.data?.scoreboard_data?.team_b_game_logo,
      ),
      useTeamBGameLogo: new FormControl<boolean>(
        this.data?.scoreboard_data?.use_team_b_game_logo !== undefined
          ? this.data.scoreboard_data.use_team_b_game_logo
          : false,
      ),
      scaleLogoB: new FormControl<number>(
        this.data?.scoreboard_data?.scale_logo_b !== undefined
          ? this.data.scoreboard_data.scale_logo_b
          : 2,
      ),
    });
  }

  toggleItemsUsage(
    team: 'aLogo' | 'bLogo' | 'aTitle' | 'bTitle',
    useItem: Event,
    scoreboardData: IScoreboard,
  ) {
    if (!scoreboardData) return;

    const controlKeys = {
      aTitle: 'use_team_a_game_title',
      bTitle: 'use_team_b_game_title',
      aLogo: 'use_team_a_game_logo',
      bLogo: 'use_team_b_game_logo',
    };
    this.websocket.checkConnection();

    const currentControlKey = controlKeys[team];
    // console.log(currentControlKey, useItem);
    // const updatedScoreboardData = {
    //   ...scoreboardData,
    //   [currentControlKey]: useItem,
    // };
    // this.scoreboardData.updateScoreboardData(updatedScoreboardData);
    this.scoreboardData.updateScoreboardDataKeyValue(scoreboardData.id!, {
      [currentControlKey]: useItem,
    });
  }

  scaleLogo(team: 'a' | 'b', scoreboardData: IScoreboard) {
    if (!scoreboardData) return;
    this.websocket.checkConnection();

    if (this.teamDataForm.valid) {
      const formValue = this.teamDataForm.getRawValue();
      const scaleLogoA = formValue.scaleLogoA;
      const scaleLogoB = formValue.scaleLogoB;
      const numberScaleLogoA = Number(scaleLogoA);
      const numberScaleLogoB = Number(scaleLogoB);

      // console.log(numberScaleLogoA, numberScaleLogoB);

      if (numberScaleLogoA && team === 'a') {
        const scaleLogoKey = 'scale_logo_a';
        // const updatedScoreboardData = {
        //   ...scoreboardData,
        //   [scaleLogoKey]: scaleLogoA,
        // };
        //
        // this.scoreboardData.updateScoreboardData(updatedScoreboardData);
        this.scoreboardData.updateScoreboardDataKeyValue(scoreboardData.id!, {
          [scaleLogoKey]: scaleLogoA,
        });
      } else {
        const scaleLogoKey = 'scale_logo_b';
        // const updatedScoreboardData = {
        //   ...scoreboardData,
        //   [scaleLogoKey]: scaleLogoB,
        // };
        //
        // this.scoreboardData.updateScoreboardData(updatedScoreboardData);
        this.scoreboardData.updateScoreboardDataKeyValue(scoreboardData.id!, {
          [scaleLogoKey]: scaleLogoB,
        });
      }
    }
  }

  updateTeamGameLogo(team: 'a' | 'b', scoreboardData: IScoreboard) {
    // console.log('logo clicked');
    if (!scoreboardData) return;
    this.websocket.checkConnection();

    if (this.teamDataForm.valid) {
      // console.log('valid');
      const formValue = this.teamDataForm.getRawValue();
      const teamALogo = formValue.teamALogo;
      const teamBLogo = formValue.teamBLogo;

      // console.log(teamALogo, teamBLogo);

      if (teamALogo && team === 'a') {
        // console.log('teamALogo', teamALogo);
        const logoKey = 'team_a_game_logo';
        // const updatedScoreboardData = {
        //   ...scoreboardData,
        //   [logoKey]: teamALogo,
        // };
        // // console.log(updatedScoreboardData);
        // this.scoreboardData.updateScoreboardData(updatedScoreboardData);
        this.scoreboardData.updateScoreboardDataKeyValue(scoreboardData.id!, {
          [logoKey]: teamALogo,
        });
      }

      if (teamBLogo && team === 'b') {
        // console.log('valid b');

        const logoKey = 'team_b_game_logo';
        // const updatedScoreboardData = {
        //   ...scoreboardData,
        //   [logoKey]: teamBLogo,
        // };
        // this.scoreboardData.updateScoreboardData(updatedScoreboardData);
        this.scoreboardData.updateScoreboardDataKeyValue(scoreboardData.id!, {
          [logoKey]: teamBLogo,
        });
      }
    }
  }

  updateTeamGameTitle(team: 'a' | 'b', scoreboardData: IScoreboard) {
    if (!scoreboardData) return;
    this.websocket.checkConnection();

    if (this.teamDataForm.valid) {
      const formValue = this.teamDataForm.getRawValue();
      const teamATitle = formValue.teamATitle;
      const teamBTitle = formValue.teamBTitle;

      if (teamATitle && team === 'a') {
        const titleKey = 'team_a_game_title';
        // const updatedScoreboardData = {
        //   ...scoreboardData,
        //   [titleKey]: teamATitle,
        // };
        // this.scoreboardData.updateScoreboardData(updatedScoreboardData);
        this.scoreboardData.updateScoreboardDataKeyValue(scoreboardData.id!, {
          [titleKey]: teamATitle,
        });
      }

      if (teamBTitle && team === 'b') {
        const titleKey = 'team_b_game_title';
        // const updatedScoreboardData = {
        //   ...scoreboardData,
        //   [titleKey]: teamBTitle,
        // };
        // this.scoreboardData.updateScoreboardData(updatedScoreboardData);
        this.scoreboardData.updateScoreboardDataKeyValue(scoreboardData.id!, {
          [titleKey]: teamBTitle,
        });
      }
    }
  }
}
