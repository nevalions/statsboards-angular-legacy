import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { AsyncPipe, NgOptimizedImage, UpperCasePipe } from '@angular/common';
import { TuiLoaderModule } from '@taiga-ui/core';
import { Observable, of, Subject, takeUntil } from 'rxjs';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TeamService } from '../team.service';
import { SearchListService } from '../../../services/search-list.service';
import { PaginationService } from '../../../services/pagination.service';
import { ITeam } from '../../../type/team.type';
import { DeleteDialogComponent } from '../../../shared/ui/dialogs/delete-dialog/delete-dialog.component';
import { Team } from '../team';
import { ImageService } from '../../../services/image.service';
import { environment } from '../../../../environments/environment';
import {
  urlWithProtocolAndPort,
  urlWithProtocol,
} from '../../../base/constants';

@Component({
  selector: 'app-item-team',
  standalone: true,
  imports: [
    AsyncPipe,
    TuiLoaderModule,
    UpperCasePipe,
    DeleteDialogComponent,
    NgOptimizedImage,
  ],
  templateUrl: './item-team.component.html',
  styleUrl: './item-team.component.less',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.Default,
})
export class ItemTeamComponent {
  currentTeam$ = this.team.team$;
  staticUrl = environment.url;
  staticPort = environment.port;

  constructor(
    private team: Team,
    private imageService: ImageService,
  ) {
    team.loadCurrentTeam();
  }

  onImgError(event: Event) {
    this.imageService.handleError(event);
  }

  onDelete() {}

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
