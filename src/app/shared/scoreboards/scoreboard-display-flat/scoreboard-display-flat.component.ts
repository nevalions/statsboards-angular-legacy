import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { NgIf, UpperCasePipe } from '@angular/common';
import { IMatchFullDataWithScoreboard } from '../../../type/match.type';
import { ImageService } from '../../../services/image.service';
import { urlWithProtocol } from '../../../base/constants';
import {
  animate,
  keyframes,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

@Component({
  selector: 'app-scoreboard-display-flat',
  standalone: true,
  imports: [NgIf, UpperCasePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './scoreboard-display-flat.component.html',
  styleUrl: './scoreboard-display-flat.component.less',
  animations: [
    trigger('scoreChange', [
      state(
        'unchanged',
        style({
          opacity: 1,
          transform: 'scaleY(1)',
          transformOrigin: 'bottom',
        }),
      ),
      state(
        'changed',
        style({
          opacity: 1,
          transform: 'scaleY(1)',
          transformOrigin: 'bottom',
        }),
      ),
      transition('* => *', [
        animate(
          '0.2s',
          keyframes([
            style({ opacity: 1, transform: 'scaleY(1)', offset: 0 }),
            style({ opacity: 0, transform: 'scaleY(0)', offset: 0.5 }),
            style({ opacity: 0, transform: 'scaleY(0)', offset: 0.51 }),
            style({ opacity: 1, transform: 'scaleY(1)', offset: 1.0 }),
          ]),
        ),
      ]),
    ]),
  ],
})
export class ScoreboardDisplayFlatComponent
  implements AfterViewInit, OnChanges
{
  @Input() data: IMatchFullDataWithScoreboard | undefined;
  @Input() gameClock: number = 0;
  @Input() playClock: number | null = null;
  @Input() scoreboardDisplayClass: string = 'fullhd-scoreboard';

  goal = 'touchdown';
  scoreAState = 'unchanged';
  scoreBState = 'unchanged';

  teamAFontSize: string = '26px';
  teamBFontSize: string = '26px';

  constructor(
    private elRef: ElementRef,
    private cd: ChangeDetectorRef,
    private imageService: ImageService,
  ) {}

  ngAfterViewInit() {
    this.adjustFontSize('team_a-name');
    this.adjustFontSize('team_b-name');
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data']) {
      const prevData: IMatchFullDataWithScoreboard =
        changes['data'].previousValue;
      const currData: IMatchFullDataWithScoreboard =
        changes['data'].currentValue;

      if (
        prevData &&
        prevData.match_data?.score_team_a !== currData.match_data?.score_team_a
      ) {
        this.scoreAState =
          this.scoreAState === 'unchanged' ? 'changed' : 'unchanged';
      }

      if (
        prevData &&
        prevData.match_data?.score_team_b !== currData.match_data?.score_team_b
      ) {
        this.scoreBState =
          this.scoreBState === 'unchanged' ? 'changed' : 'unchanged';
      }
    }
  }

  adjustFontSize(teamNameClass: string) {
    let fontSize = 26;
    let teamNameSpanElementWidth = this.getWidth(`.${teamNameClass} span`);
    let teamNameElementWidth = this.getWidth(`.${teamNameClass}`);

    while (teamNameSpanElementWidth > teamNameElementWidth && fontSize > 10) {
      fontSize -= 1;
      teamNameClass === 'team_a-name'
        ? (this.teamAFontSize = `${fontSize}px`)
        : (this.teamBFontSize = `${fontSize}px`);
      this.cd.detectChanges();
      teamNameSpanElementWidth = this.getWidth(`.${teamNameClass} span`);
      teamNameElementWidth = this.getWidth(`.${teamNameClass}`);
    }
  }

  getWidth(queryString: string) {
    const element = this.elRef.nativeElement.querySelector(queryString);
    return element ? element.offsetWidth : 0;
  }

  getMinutes(seconds: number): string {
    if (seconds === undefined) {
      return '--';
    } else {
      return Math.floor(seconds / 60)
        .toString()
        .padStart(2, '0');
    }
  }

  getSeconds(seconds: number): string {
    if (seconds === undefined) {
      return '--';
    } else {
      return (seconds % 60).toString().padStart(2, '0');
    }
  }

  getPlayClockSeconds(seconds: number): string {
    if (seconds === undefined) {
      return '';
    } else {
      return (seconds % 60).toString().padStart(1, '0');
    }
  }

  onImgError(event: Event) {
    this.imageService.handleError(event);
  }

  protected readonly urlWithProtocol = urlWithProtocol;
}
