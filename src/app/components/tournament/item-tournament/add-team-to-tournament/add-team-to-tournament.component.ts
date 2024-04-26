import { Component, inject, Input } from '@angular/core';
import { combineLatest, map, Observable } from 'rxjs';
import { ITeam, ITeamTournament } from '../../../../type/team.type';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TuiButtonModule, TuiDialogModule } from '@taiga-ui/core';
import { AsyncPipe } from '@angular/common';
import {
  TuiDataListWrapperModule,
  tuiItemsHandlersProvider,
  TuiSelectModule,
} from '@taiga-ui/kit';
import { TuiLetModule } from '@taiga-ui/cdk';
import { AddItemDialogFromListComponent } from '../../../../shared/ui/dialogs/add-item-dialog-from-list/add-item-dialog-from-list.component';
import { AppState } from '../../../../store/appstate';
import { Store } from '@ngrx/store';
import { teamTournamentActions } from '../../../team-tournament/store/actions';
import { hasTitle, toTitleCase } from '../../../../base/helpers';

@Component({
  selector: 'app-add-team-to-tournament',
  standalone: true,
  imports: [
    FormsModule,
    TuiButtonModule,
    TuiDialogModule,
    ReactiveFormsModule,
    AsyncPipe,
    TuiDataListWrapperModule,
    TuiLetModule,
    TuiSelectModule,
    AddItemDialogFromListComponent,
  ],
  templateUrl: './add-team-to-tournament.component.html',
  styleUrl: './add-team-to-tournament.component.less',
  providers: [
    tuiItemsHandlersProvider({
      stringify: (item: ITeam) =>
        hasTitle(item) ? toTitleCase(item.title) : toTitleCase(String(item)),
    }),
  ],
})
export class AddTeamToTournamentComponent {
  store: Store<AppState> = inject(Store);

  @Input() tournamentId!: number;
  @Input() dialogId: string = 'addTeamToTournamentDialog';
  @Input() allSportTeams$!: Observable<ITeam[]>;
  @Input() teamsInTournament$!: Observable<ITeam[]>;

  get availableTeams$(): Observable<ITeam[]> {
    return combineLatest([this.allSportTeams$, this.teamsInTournament$]).pipe(
      map(([allTeams, tournamentTeams]) => {
        const tournamentTeamIds = tournamentTeams.map((team) => team.id);
        return allTeams.filter((team) => !tournamentTeamIds.includes(team.id));
      }),
    );
  }

  onAdd(team: ITeam | null | undefined): void {
    if (team && team.id && this.tournamentId) {
      const data: ITeamTournament = {
        team_id: team.id,
        tournament_id: this.tournamentId,
      };
      this.store.dispatch(teamTournamentActions.create({ request: data }));
    }
  }
}
