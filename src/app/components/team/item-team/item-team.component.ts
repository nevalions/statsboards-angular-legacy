import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { AsyncPipe, NgOptimizedImage, UpperCasePipe } from '@angular/common';
import { TuiLoaderModule } from '@taiga-ui/core';
import { DeleteDialogComponent } from '../../../shared/ui/dialogs/delete-dialog/delete-dialog.component';
import { Team } from '../team';
import { ImageService } from '../../../services/image.service';
import { urlWithProtocol } from '../../../base/constants';
import { BodyListTitleComponent } from '../../../shared/ui/body/body-title/body-list-title.component';
import { EditButtonComponent } from '../../../shared/ui/buttons/edit-button/edit-button.component';
import { AddEditTeamComponent } from '../add-edit-team/add-edit-team.component';
import { TournamentAddEditFormComponent } from '../../tournament/tournament-add-edit-form/tournament-add-edit-form.component';
import { Sponsor } from '../../adv/sponsor/sponsor';
import { SponsorLine } from '../../adv/sponsor-line/sponsorLine';
import { DeleteButtonComponent } from '../../../shared/ui/buttons/delete-button/delete-button.component';
import { SponsorLineComponent } from '../../../shared/scoreboards/sponsor-line/sponsor-line.component';

@Component({
  selector: 'app-item-team',
  standalone: true,
  imports: [
    AsyncPipe,
    TuiLoaderModule,
    UpperCasePipe,
    DeleteDialogComponent,
    NgOptimizedImage,
    BodyListTitleComponent,
    EditButtonComponent,
    AddEditTeamComponent,
    TournamentAddEditFormComponent,
    DeleteButtonComponent,
    SponsorLineComponent,
  ],
  templateUrl: './item-team.component.html',
  styleUrl: './item-team.component.less',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.Default,
})
export class ItemTeamComponent {
  currentTeam$ = this.team.team$;
  currentTeamMainSponsor$ = this.sponsor.currentSponsor$;
  sponsorLine$ = this.sponsorLine.sponsorLineWithFullData$;
  allSponsors$ = this.sponsor.allSponsors$;
  allSponsorLines$ = this.sponsorLine.allSponsorLines$;

  buttonTitle: string = 'Team';

  constructor(
    private team: Team,
    private imageService: ImageService,
    private sponsor: Sponsor,
    private sponsorLine: SponsorLine,
  ) {
    sponsor.loadAllSponsors();
    sponsorLine.loadAllSponsorLines();
    team.loadCurrentTeam();
  }

  onImgError(event: Event) {
    this.imageService.handleError(event);
  }

  onDelete() {
    this.team.deleteTeam();
  }

  protected readonly url = urlWithProtocol;
}
