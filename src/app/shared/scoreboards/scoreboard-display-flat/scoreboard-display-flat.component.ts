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
import { AsyncPipe, NgIf, UpperCasePipe } from '@angular/common';
import { IMatchFullDataWithScoreboard } from '../../../type/match.type';
import { ImageService } from '../../../services/image.service';
import { urlWithProtocol } from '../../../base/constants';
import {
  dissolveAnimation,
  RevealHideAnimation,
  ScoreChangeAnimation,
} from '../../animations/scoreboard-animations';
import { ISponsor } from '../../../type/sponsor.type';
import { ITournament } from '../../../type/tournament.type';
import { PlayerMatchLowerDisplayFlatComponent } from '../player-match-lower-display-flat/player-match-lower-display-flat.component';
import { PlayerInMatch } from '../../../components/player-match/player-match';
import { hexToRgba } from '../../../base/helpers';

@Component({
  selector: 'app-scoreboard-display-flat',
  standalone: true,
  imports: [
    NgIf,
    UpperCasePipe,
    PlayerMatchLowerDisplayFlatComponent,
    AsyncPipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './scoreboard-display-flat.component.html',
  styleUrl: './scoreboard-display-flat.component.less',
  animations: [ScoreChangeAnimation, RevealHideAnimation, dissolveAnimation],
})
export class ScoreboardDisplayFlatComponent
  implements AfterViewInit, OnChanges
{
  @Input() data: IMatchFullDataWithScoreboard | undefined;
  @Input() tournamentSponsor: ISponsor | null | undefined;
  @Input() tournament: ITournament | null | undefined;
  @Input() gameClock: number = 0;
  @Input() playClock: number | null = null;
  @Input() scoreboardDisplayClass: string = 'fullhd-scoreboard';
  @Input() playerLowerId: number | undefined | null = null;

  player$ = this.playerInMatch.selectSelectedPlayerInMatchLower$;

  // goal = 'touchdown';
  goal = 'ТАЧДАУН';
  timeout = 'ТАЙМАУТ';
  scoreAState = 'unchanged';
  scoreBState = 'unchanged';
  downDistanceState = 'unchanged';
  qtrState = 'unchanged';
  downAndYardVisibility = 'invisible';
  flagVisibility = 'invisible';
  teamAVisibility = 'invisible';
  teamBVisibility = 'invisible';
  teamAGoalVisibility = 'invisible';
  teamBGoalVisibility = 'invisible';
  teamATimeoutVisibility = 'invisible';
  teamBTimeoutVisibility = 'invisible';

  playerLowerVisibility = 'invisible';

  teamAFontSize: string = '26px';
  teamBFontSize: string = '26px';

  constructor(
    private playerInMatch: PlayerInMatch,
    private elRef: ElementRef,
    private cd: ChangeDetectorRef,
    private imageService: ImageService,
  ) {}

  ngAfterViewInit() {
    this.adjustFontSize('team_a-name');
    this.adjustFontSize('team_b-name');
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['playerLowerId']) {
      // console.log('change id');
      if (
        this.data &&
        this.data.scoreboard_data &&
        this.data.scoreboard_data.player_match_lower_id
      ) {
        this.playerInMatch.getPlayerLowerSelect(
          this.data.scoreboard_data.player_match_lower_id,
        );
      }
    }
    if (changes['data']) {
      const prevData: IMatchFullDataWithScoreboard =
        changes['data'].previousValue;
      const currData: IMatchFullDataWithScoreboard =
        changes['data'].currentValue;

      this.playerLowerVisibility = currData.scoreboard_data
        ?.is_match_player_lower
        ? 'visible'
        : 'invisible';

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

      if (
        (prevData && prevData.match_data?.down !== currData.match_data?.down) ||
        (prevData &&
          prevData.match_data?.distance !== currData.match_data?.distance)
      ) {
        this.downDistanceState =
          this.downDistanceState === 'unchanged' ? 'changed' : 'unchanged';
      }

      if (prevData && prevData.match_data?.qtr !== currData.match_data?.qtr) {
        this.qtrState = this.qtrState === 'unchanged' ? 'changed' : 'unchanged';
      }

      this.downAndYardVisibility = currData.scoreboard_data?.is_downdistance
        ? 'visible'
        : 'invisible';
      this.flagVisibility = currData.scoreboard_data?.is_flag
        ? 'visible'
        : 'invisible';

      this.teamAVisibility =
        !currData.scoreboard_data?.is_goal_team_a &&
        !currData.scoreboard_data?.is_timeout_team_a
          ? 'visible'
          : 'invisible';
      this.teamBVisibility =
        !currData.scoreboard_data?.is_goal_team_b &&
        !currData.scoreboard_data?.is_timeout_team_b
          ? 'visible'
          : 'invisible';
      this.teamAGoalVisibility =
        currData.scoreboard_data?.is_goal_team_a &&
        !currData.scoreboard_data?.is_timeout_team_a
          ? 'visible'
          : 'invisible';
      this.teamBGoalVisibility =
        currData.scoreboard_data?.is_goal_team_b &&
        !currData.scoreboard_data?.is_timeout_team_b
          ? 'visible'
          : 'invisible';
      this.teamATimeoutVisibility =
        currData.scoreboard_data?.is_timeout_team_a &&
        !currData.scoreboard_data?.is_goal_team_a
          ? 'visible'
          : 'invisible';
      this.teamBTimeoutVisibility =
        currData.scoreboard_data?.is_timeout_team_b &&
        !currData.scoreboard_data?.is_goal_team_b
          ? 'visible'
          : 'invisible';

      // this.teamAVisibility = !currData.scoreboard_data?.is_goal_team_a
      //   ? 'visible'
      //   : 'invisible';
      // this.teamBVisibility = !currData.scoreboard_data?.is_goal_team_b
      //   ? 'visible'
      //   : 'invisible';
      // this.teamAGoalVisibility = currData.scoreboard_data?.is_timeout_team_a
      //   ? 'visible'
      //   : 'invisible';
      // this.teamBGoalVisibility = currData.scoreboard_data?.is_timeout_team_b
      //   ? 'visible'
      //   : 'invisible';
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

  onImgError(event: Event) {
    this.imageService.handleError(event);
  }

  protected readonly urlWithProtocol = urlWithProtocol;
  protected readonly hexToRgba = hexToRgba;
}
