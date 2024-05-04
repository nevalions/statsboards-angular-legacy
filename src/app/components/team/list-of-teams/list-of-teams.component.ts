import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  OnInit,
} from '@angular/core';
import { AsyncPipe, SlicePipe, UpperCasePipe } from '@angular/common';
import { ListOfItemsIslandComponent } from '../../../shared/ui/list-of-items-island/list-of-items-island.component';
import {
  TuiButtonModule,
  TuiLoaderModule,
  TuiTextfieldControllerModule,
} from '@taiga-ui/core';
import {
  TuiInputModule,
  TuiInputNumberModule,
  TuiPaginationModule,
} from '@taiga-ui/kit';
import { ITeam } from '../../../type/team.type';
import { Observable, of } from 'rxjs';
import { FormSearchAutoCompleteComponent } from '../../../shared/ui/forms/form-search-auto-complete/form-search-auto-complete.component';
import { FormSearchTextComponent } from '../../../shared/ui/forms/form-search-text/form-search-text.component';
import { SearchListService } from '../../../services/search-list.service';
import { PaginationService } from '../../../services/pagination.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TuiValueChangesModule } from '@taiga-ui/cdk';
import { paginationWithItemsPerPage } from '../../../shared/ui/pagination/pagination-with-items-per-page/pagination-with-items-per-page.component';
import { ListOfTeamsSmallComponent } from '../list-of-teams-small/list-of-teams-small.component';
import { DeleteDialogComponent } from '../../../shared/ui/dialogs/delete-dialog/delete-dialog.component';
import { AddEditTeamComponent } from '../add-edit-team/add-edit-team.component';
import { SportService } from '../../sport/sport.service';
import { TeamService } from '../team.service';
import { ListOfTeamsWithCityComponent } from '../list-of-teams-with-city/list-of-teams-with-city.component';
import { Team } from '../team';

@Component({
  selector: 'app-list-of-teams',
  standalone: true,
  imports: [
    AsyncPipe,
    ListOfItemsIslandComponent,
    SlicePipe,
    TuiButtonModule,
    TuiPaginationModule,
    FormSearchAutoCompleteComponent,
    FormSearchTextComponent,
    TuiLoaderModule,
    ReactiveFormsModule,
    TuiInputNumberModule,
    TuiValueChangesModule,
    paginationWithItemsPerPage,
    ListOfTeamsSmallComponent,
    DeleteDialogComponent,
    AddEditTeamComponent,
    ListOfTeamsWithCityComponent,
    TuiInputModule,
    UpperCasePipe,
    TuiTextfieldControllerModule,
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

  // constructor(private team: Team) {
  //   team.loadAllTeamsInSport();
  // }

  // ngOnInit() {
  //   this.searchListService.updateData(this.teams$);
  //   this.paginationService.initializePagination(
  //     this.searchListService.filteredData$,
  //   );
  // }
}
