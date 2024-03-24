import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  ViewChild,
} from '@angular/core';
import { NgIf } from '@angular/common';
import { IMatchFullDataWithScoreboard } from '../../../type/match.type';
import { ImageService } from '../../../services/image.service';
import { environment } from '../../../../environments/environment';
import { DefaultMatchData } from '../../../type/matchdata.type';
import {
  urlWithProtocol,
  urlWithProtocolAndPort,
} from '../../../base/constants';

@Component({
  selector: 'app-scoreboard-display-flat',
  standalone: true,
  imports: [NgIf],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './scoreboard-display-flat.component.html',
  styleUrl: './scoreboard-display-flat.component.less',
})
export class ScoreboardDisplayFlatComponent implements AfterViewInit {
  @Input() data: IMatchFullDataWithScoreboard | undefined;
  @Input() gameClock: number = 0;
  @Input() playClock: number | null = null;
  @Input() scoreboardDisplayClass: string = 'fullhd-scoreboard';

  staticUrl = environment.url;
  staticPort = environment.port;

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
