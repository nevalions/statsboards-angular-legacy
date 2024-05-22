import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs';
import { IMatchFullDataWithScoreboard } from '../../../../type/match.type';
import { ScoreboardData } from '../../../../components/scoreboard-data/scoreboard-data';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { IScoreboard } from '../../../../type/matchdata.type';
import { AsyncPipe, NgIf } from '@angular/common';
import { AdminDownButtonComponent } from '../../../ui/buttons/admin-down-button/admin-down-button.component';
import { ToggleVisibleButtonComponent } from '../../../ui/buttons/toggle-visible-button/toggle-visible-button.component';
import { AdminSubmitButtonComponent } from '../../../ui/buttons/admin-submit-button/admin-submit-button.component';
import { TuiInputSliderModule } from '@taiga-ui/kit';

@Component({
  selector: 'app-main-sponsor-forms',
  standalone: true,
  imports: [
    AsyncPipe,
    NgIf,
    AdminDownButtonComponent,
    ToggleVisibleButtonComponent,
    AdminSubmitButtonComponent,
    ReactiveFormsModule,
    TuiInputSliderModule,
  ],
  templateUrl: './main-sponsor-forms.component.html',
  styleUrl: './main-sponsor-forms.component.less',
})
export class MainSponsorFormsComponent implements OnChanges {
  @Input() sponsorsFormsVisible$!: Observable<boolean>;
  @Input() data: IMatchFullDataWithScoreboard | undefined;
  @Input() isMatchDataSubmitting$?: Observable<boolean>;
  @Input() disabled: boolean = false;

  mainSponsorForm: FormGroup;

  readonly min = 0.1;
  readonly max = 5;
  readonly sliderStep = 0.1;
  readonly steps = (this.max - this.min) / this.sliderStep;
  readonly quantum = 0.01;

  constructor(private scoreboardData: ScoreboardData) {
    this.mainSponsorForm = this.initForm();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data']) {
      this.mainSponsorForm = this.initForm();
    }
    if (changes['disabled']) {
      if (this.disabled) {
        this.mainSponsorForm.disable();
      } else {
        this.mainSponsorForm.enable();
      }
    }
  }

  private initForm(): FormGroup {
    return new FormGroup({
      scaleTournamentLogo: new FormControl<number>(
        this.data?.scoreboard_data?.scale_tournament_logo !== undefined
          ? this.data.scoreboard_data.scale_tournament_logo
          : 2,
      ),
      scaleMainSponsorLogo: new FormControl<number>(
        this.data?.scoreboard_data?.scale_main_sponsor !== undefined
          ? this.data.scoreboard_data.scale_main_sponsor
          : 2,
      ),
    });
  }

  toggleMainSponsorVisibility(scoreboardData: IScoreboard) {
    if (!scoreboardData) return;
    const updatedScoreboardData = {
      ...scoreboardData,
      is_main_sponsor: !scoreboardData.is_main_sponsor,
    };
    this.scoreboardData.updateScoreboardData(updatedScoreboardData);
  }

  toggleTournamentLogoVisibility(scoreboardData: IScoreboard) {
    if (!scoreboardData) return;
    const updatedScoreboardData = {
      ...scoreboardData,
      is_tournament_logo: !scoreboardData.is_tournament_logo,
    };
    this.scoreboardData.updateScoreboardData(updatedScoreboardData);
  }

  toggleSponsorLineVisibility(scoreboardData: IScoreboard) {
    if (!scoreboardData) return;
    const updatedScoreboardData = {
      ...scoreboardData,
      is_sponsor_line: !scoreboardData.is_sponsor_line,
    };
    this.scoreboardData.updateScoreboardData(updatedScoreboardData);
  }

  toggleMatchSponsorLineVisibility(scoreboardData: IScoreboard) {
    if (!scoreboardData) return;
    const updatedScoreboardData = {
      ...scoreboardData,
      is_match_sponsor_line: !scoreboardData.is_match_sponsor_line,
    };
    this.scoreboardData.updateScoreboardData(updatedScoreboardData);
  }

  scaleLogo(logo: 'tournament' | 'mainSponsor', scoreboardData: IScoreboard) {
    if (!scoreboardData) return;

    if (this.mainSponsorForm.valid) {
      const formValue = this.mainSponsorForm.getRawValue();
      const scaleTournamentLogo = formValue.scaleTournamentLogo;
      const scaleMainSponsorLogo = formValue.scaleMainSponsorLogo;
      const numberScaleTournamentLogo = Number(scaleTournamentLogo);
      const numberScaleMainSponsorLogo = Number(scaleMainSponsorLogo);

      console.log(numberScaleTournamentLogo, numberScaleMainSponsorLogo);

      if (numberScaleTournamentLogo && logo === 'tournament') {
        const scaleLogoKey = 'scale_tournament_logo';
        const updatedScoreboardData = {
          ...scoreboardData,
          [scaleLogoKey]: scaleTournamentLogo,
        };

        this.scoreboardData.updateScoreboardData(updatedScoreboardData);
      } else {
        const scaleLogoKey = 'scale_main_sponsor';
        const updatedScoreboardData = {
          ...scoreboardData,
          [scaleLogoKey]: scaleMainSponsorLogo,
        };

        this.scoreboardData.updateScoreboardData(updatedScoreboardData);
      }
    }
  }
}
