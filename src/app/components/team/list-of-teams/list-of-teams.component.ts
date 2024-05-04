import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TuiLoaderModule } from '@taiga-ui/core';
import { ITeam } from '../../../type/team.type';
import { AddEditTeamComponent } from '../add-edit-team/add-edit-team.component';
import { ListOfTeamsWithCityComponent } from '../list-of-teams-with-city/list-of-teams-with-city.component';

@Component({
  selector: 'app-list-of-teams',
  standalone: true,
  imports: [
    AddEditTeamComponent,
    TuiLoaderModule,
    ListOfTeamsWithCityComponent,
  ],

  templateUrl: './list-of-teams.component.html',
  styleUrl: './list-of-teams.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListOfTeamsComponent {
  @Input() teams: ITeam[] | null = [];

  @Input() sportId!: number;
  @Input() emptyMessage: string = 'No teams available';

  @Input() formatPath: (item: ITeam) => string = () => '';
  @Input() titleProperty: keyof ITeam = 'id';

  // searchForm = new FormGroup({
  //   searchValue: new FormControl(''),
  // });
  //
  // onSearch() {}

  // searchListService = inject(SearchListService);
  // paginationService = inject(PaginationService);
  // teamService = inject(TeamService);
  // teams$ = this.team.teamsInSport$;

  // ngOnInit() {
  //   this.searchListService.updateData(this.teams$);
  //   this.paginationService.initializePagination(
  //     this.searchListService.filteredData$,
  //   );
  // }
}
