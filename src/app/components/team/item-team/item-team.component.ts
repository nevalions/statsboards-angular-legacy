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
import { environment } from '../../../../environments/environment';
import {
  urlWithProtocolAndPort,
  urlWithProtocol,
} from '../../../base/constants';
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

  staticUrl = environment.url;
  staticPort = environment.port;

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

  // onDelete() {
  //   if (this.teamId) {
  //     this.team$.subscribe((team: ITeam) => {
  //       if (team && team.id && team.sport_id) {
  //         this.teamService.deleteTeam(team.id).subscribe(() => {
  //           const sportId = this.router.navigateByUrl(
  //             `/sports/id/${team.sport_id}/teams`,
  //           );
  //           console.log(`TEAM ID: ${this.teamId} deleted successfully`);
  //         });
  //       }
  //     });
  //   } else {
  //     console.log('Invalid team object or missing ID');
  //   }
  // }
  protected readonly urlWithPort = urlWithProtocolAndPort;
  protected readonly url = urlWithProtocol;
}
