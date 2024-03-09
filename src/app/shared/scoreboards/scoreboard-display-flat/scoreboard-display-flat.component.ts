import { AfterViewChecked, Component, Input } from '@angular/core';
import { NgIf } from '@angular/common';
import { IMatchFullDataWithScoreboard } from '../../../type/match.type';

@Component({
  selector: 'app-scoreboard-display-flat',
  standalone: true,
  imports: [NgIf],
  templateUrl: './scoreboard-display-flat.component.html',
  styleUrl: './scoreboard-display-flat.component.less',
})
export class ScoreboardDisplayFlatComponent implements AfterViewChecked {
  @Input() data!: IMatchFullDataWithScoreboard;

  fontSizeA!: string;
  fontSizeB!: string;

  ngAfterViewChecked(): void {
    this.adjustFontSize();
  }

  adjustFontSize() {
    setTimeout(() => {
      // These selectors should point to your team names
      const teamNameAElement = <HTMLElement>(
        document.querySelector('.team_a-name span')
      );
      const teamNameBElement = <HTMLElement>(
        document.querySelector('.team_b-name span')
      );

      if (teamNameAElement && teamNameBElement) {
        const maxWidthA = teamNameAElement.parentElement!.offsetWidth;
        const maxWidthB = teamNameBElement.parentElement!.offsetWidth;

        this.fontSizeA = Math.min(20, maxWidthA / 14) + 'px';
        this.fontSizeB = Math.min(20, maxWidthB / 14) + 'px';
      }
    });
  }

  getTeamFontSize(elementId: string): string {
    const element = document.querySelector(`.${elementId} span`);
    if (!element) {
      return '20px'; // default
    }

    const maxWidth = element.parentElement!.offsetWidth;
    return Math.min(26, maxWidth / 15) + 'px';
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
}
