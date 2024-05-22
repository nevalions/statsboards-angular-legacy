import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { SponsorLine } from '../../../components/adv/sponsor-line/sponsorLine';
import { SponsorLineComponent } from '../sponsor-line/sponsor-line.component';

@Component({
  selector: 'app-match-sponsor-line-display-flat',
  standalone: true,
  templateUrl: './match-sponsor-line-display-flat.component.html',
  styleUrl: './match-sponsor-line-display-flat.component.less',
  imports: [SponsorLineComponent, AsyncPipe],
})
export class MatchSponsorLineDisplayFlatComponent {
  matchSponsorLine$ = this.sponsorLine.matchSponsorLine$;
  constructor(private sponsorLine: SponsorLine) {
    sponsorLine.loadMatchSponsorLineWithFullData();
  }
}
