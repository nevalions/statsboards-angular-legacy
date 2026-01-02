import { TuiTextfieldControllerModule } from "@taiga-ui/legacy";
import {
  Component,
  inject,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { ITeam } from '../../../type/team.type';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { DialogService } from '../../../services/dialog.service';
import { TeamTournament } from '../../team-tournament/teamTournament';
import {
  getArrayFormDataByIndexAndKey,
  getFormControlWithIndex,
  getFormDataByIndexAndKey,
} from '../../../base/formHelpers';
import { AddButtonOnFinalTrComponent } from '../../../shared/ui/buttons/add-button-on-final-tr/add-button-on-final-tr.component';
import { TitleCasePipe } from '@angular/common';
import { SelectTeamComponent } from '../../../shared/ui/forms/select-team/select-team.component';
import { DeleteButtonIconComponent } from '../../../shared/ui/buttons/delete-button-icon/delete-button-icon.component';
import { RemoveDialogComponent } from '../../../shared/ui/dialogs/remove-dialog/remove-dialog.component';
import { ActionsButtonsComponent } from '../../../shared/ui/buttons/actions-buttons/actions-buttons.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-add-edit-team-to-tournament-table',
  standalone: true,
  imports: [
    TuiTextfieldControllerModule,
    ReactiveFormsModule,
    TitleCasePipe,
    SelectTeamComponent,
    DeleteButtonIconComponent,
    RemoveDialogComponent,
    ActionsButtonsComponent,
    AddButtonOnFinalTrComponent
],
  templateUrl: './add-edit-team-to-tournament-table.component.html',
  styleUrl: './add-edit-team-to-tournament-table.component.less',
})
export class AddEditTeamToTournamentTableComponent
  implements OnInit, OnChanges
{
  private teamInTournament = inject(TeamTournament);
  private dialogService = inject(DialogService);
  private fb = inject(FormBuilder);

  @Input() tournamentId!: number;
  @Input() sportId!: number;
  @Input() teams: ITeam[] = [];
  @Input() availableTeamInSport: ITeam[] = [];

  @Input() deleteOrUpdate: 'delete' | 'update' | 'deleteFromTeam' = 'delete';
  newTeamCount = 0;
  teamForm!: FormGroup;

  get teamsArray(): FormArray {
    return this.teamForm.get('teams') as FormArray;
  }

  private populateFormArray(): void {
    const teamsFormArray = this.teams.map((team, index) =>
      this.createFormGroupForTeam(team, index),
    );
    const formArray = this.fb.array(teamsFormArray);
    // console.log(formArray);
    this.teamForm.setControl('teams', formArray);
  }

  constructor() {
    this.teamForm = this.fb.group({
      teams: this.fb.array([]),
    });
  }

  ngOnInit() {
    if (this.teams) {
      this.populateFormArray();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['teams'] && this.teams) {
      this.populateFormArray();
    }
  }

  private createFormGroupForTeam(team: ITeam, index: number): FormGroup {
    const controlNameTeamId = `teamId${index}`;
    const controlNameTeamTitle = `teamTitle${index}`;
    const controlNameTeamInSport = `teamInSport${index}`;
    return this.fb.group({
      [controlNameTeamId]: new FormControl(team.id),
      [controlNameTeamTitle]: new FormControl(team.title),
      [controlNameTeamInSport]: new FormControl(team),
    });
  }

  onSubmit(
    action: 'add' | 'edit' | 'deleteFromTeam',
    index: number,
    parentId: number | null,
  ): void {
    // console.log('click');
    // console.log(action, index);
    if (this.teamForm.valid) {
      const array = this.teamForm.get('teams') as FormArray;

      // console.log(array);
      if (array && action == 'add') {
        const teamData = {
          t: getArrayFormDataByIndexAndKey<ITeam>(array, index, 'teamInSport'),
        };
        console.log(teamData);
        if (teamData && this.tournamentId) {
          this.teamInTournament.createTeamTournamentsConnection({
            team_id: teamData.t.id,
            tournament_id: this.tournamentId,
          });
        }
      }
    }
  }

  addNewTeam(): void {
    const lastTeam = this.teams[this.teams.length - 1];
    if (lastTeam && lastTeam.id === null) {
      return;
    }
    this.newTeamCount++;

    const newTeam: ITeam = {
      id: null,
      sport_id: this.sportId,
      title: '',
    };

    // Use spread operator to create a new array
    this.teams = [...this.teams, newTeam];
    this.populateFormArray();
  }

  onCancelButtonClick() {
    if (this.teams.length > 0) {
      const lastPlayer = this.teams[this.teams.length - 1];
      if (!lastPlayer.id) {
        this.teams = this.teams.slice(0, this.teams.length - 1);
        this.populateFormArray();
        // this.initializeForm();
      }
    }
  }

  onDelete(id: number) {
    this.teamInTournament.deleteTeamTournamentConnection(id, this.tournamentId);
  }

  private route = inject(ActivatedRoute);
  private router = inject(Router);

  navigateToTeamItem(id: number): void {
    if (id) {
      this.router.navigate(['team', id], { relativeTo: this.route });
    }
  }

  protected readonly getFormControl = getFormControlWithIndex;
  protected readonly getFormDataByIndexAndKey = getFormDataByIndexAndKey;
}
