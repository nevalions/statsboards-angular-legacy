import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { AsyncPipe, NgIf } from '@angular/common';
import { Observable } from 'rxjs';
import { IMatchFullDataWithScoreboard } from '../../../../type/match.type';
import { ToggleVisibleButtonComponent } from '../../../ui/buttons/toggle-visible-button/toggle-visible-button.component';
import {
  TuiFieldErrorPipeModule,
  TuiInputModule,
  TuiInputNumberModule,
  tuiInputNumberOptionsProvider,
} from '@taiga-ui/kit';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TuiErrorModule } from '@taiga-ui/core';
import { AdminSubmitButtonComponent } from '../../../ui/buttons/admin-submit-button/admin-submit-button.component';
import { AdminDownButtonComponent } from '../../../ui/buttons/admin-down-button/admin-down-button.component';
import { Playclock } from '../../../../components/playclock/playclock';
import { IPlayclock } from '../../../../type/playclock.type';
import { IGameclock } from '../../../../type/gameclock.type';
import { Gameclock } from '../../../../components/gameclock/gameclock';

@Component({
  selector: 'app-time-forms',
  standalone: true,
  imports: [
    NgIf,
    AsyncPipe,
    ToggleVisibleButtonComponent,
    ReactiveFormsModule,
    TuiErrorModule,
    TuiFieldErrorPipeModule,
    TuiInputNumberModule,
    TuiInputModule,
    AdminSubmitButtonComponent,
    AdminDownButtonComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    tuiInputNumberOptionsProvider({
      decimal: 'never',
      step: 1,
      min: 0,
    }),
  ],
  templateUrl: './time-forms.component.html',
  styleUrl: './time-forms.component.less',
})
export class TimeFormsComponent implements OnChanges {
  @Input() timeFormsVisible$!: Observable<boolean>;
  @Input() data: IMatchFullDataWithScoreboard | undefined;
  @Input() gameclock!: IGameclock | undefined;
  @Input() playclock: IPlayclock | undefined;
  @Input() disabled: boolean = false;

  timeForm: FormGroup;

  constructor(
    private playclockData: Playclock,
    private gameclockData: Gameclock,
  ) {
    this.timeForm = this.initForm();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data'] || changes['playclock'] || changes['gameclock']) {
      this.timeForm = this.initForm();
      if (this.gameclock?.gameclock_status === 'running') {
        this.timeForm.get('gameTimeMinutes')?.disable();
        this.timeForm.get('gameTimeSeconds')?.disable();
      }
    }

    if (changes['disabled']) {
      if (this.disabled) {
        this.timeForm.disable();
      } else {
        this.timeForm.get('gameTimeMinutes')?.enable();
        this.timeForm.get('gameTimeSeconds')?.enable();
      }
    }

    this.timeForm.get('playTimeSeconds')!.disable();
  }

  private initForm(): FormGroup {
    const time = this.gameclock?.gameclock;

    if (time) {
      let gameMinutes = Math.floor(time / 60);
      let gameSeconds = time % 60;
      return new FormGroup({
        gameTimeMinutes: new FormControl<number | null | undefined>(
          gameMinutes,
          [Validators.min(0), Validators.max(12)],
        ),
        gameTimeSeconds: new FormControl<number | null | undefined>(
          gameSeconds,
          [Validators.min(0), Validators.max(59)],
        ),
        playTimeSeconds: new FormControl<number | null | undefined>(
          this.playclock?.playclock,
          Validators.min(0),
        ),
      });
    } else {
      return new FormGroup({
        gameTimeMinutes: new FormControl<number | null | undefined>(null, [
          Validators.min(0),
          Validators.max(12),
        ]),
        gameTimeSeconds: new FormControl<number | null | undefined>(null, [
          Validators.min(0),
          Validators.max(59),
        ]),
        playTimeSeconds: new FormControl<number | null | undefined>(
          null,
          Validators.min(0),
        ),
      });
    }
  }

  startGameClock() {
    this.gameclockData.startGameClock();
  }

  pauseGameClock() {
    this.gameclockData.pauseGameClock();
  }

  saveNewGameClock(gameclock: IGameclock) {
    console.log(gameclock);
    if (!gameclock) return;

    if (this.timeForm.valid) {
      const formValue = this.timeForm.getRawValue();
      console.log(formValue);

      const minutes = Number(formValue.gameTimeMinutes);
      const seconds = Number(formValue.gameTimeSeconds);
      if (minutes >= 0 && seconds >= 0) {
        const time: number = minutes * 60 + seconds;
        const updatedGameclock = { ...gameclock, gameclock: time };
        this.gameclockData.updateGameclock(updatedGameclock);
      }
    }
  }

  resetGameClock() {
    this.gameclockData.resetGameClock(720);
  }

  startPlayClock(sec: number) {
    this.playclockData.startPlayClock(sec);
  }

  resetPlayClock() {
    this.playclockData.resetPlayClock();
  }
}
