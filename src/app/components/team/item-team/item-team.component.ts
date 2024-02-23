import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { AsyncPipe, UpperCasePipe } from '@angular/common';
import { TuiLoaderModule } from '@taiga-ui/core';
import { Observable, of, Subject, takeUntil } from 'rxjs';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TeamService } from '../team.service';
import { SearchListService } from '../../../services/search-list.service';
import { PaginationService } from '../../../services/pagination.service';
import { ITeam } from '../../../type/team.type';
import { DeleteDialogComponent } from '../../../shared/ui/dialogs/delete-dialog/delete-dialog.component';
import { Team } from '../team';

@Component({
  selector: 'app-item-team',
  standalone: true,
  imports: [AsyncPipe, TuiLoaderModule, UpperCasePipe, DeleteDialogComponent],
  templateUrl: './item-team.component.html',
  styleUrl: './item-team.component.less',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.Default,
})
export class ItemTeamComponent {
  currentTeam$ = this.team.team$;

  constructor(private team: Team) {
    team.loadCurrentTeam();
  }

  onDelete() {}

  // private readonly ngUnsubscribe = new Subject<void>();
  //
  // private route = inject(ActivatedRoute);
  // private router = inject(Router);
  // teamService = inject(TeamService);
  //
  // searchListService = inject(SearchListService);
  // paginationService = inject(PaginationService);
  //
  // team$: Observable<ITeam> = of({} as ITeam);
  // teamId: number | undefined;
  //
  // ngOnInit() {
  //   this.route.params
  //     .pipe(takeUntil(this.ngUnsubscribe))
  //     .subscribe((params: Params) => {
  //       this.teamId = Number(params['id']);
  //       this.team$ = this.teamService.findById(this.teamId);
  //     });
  // }

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
}
