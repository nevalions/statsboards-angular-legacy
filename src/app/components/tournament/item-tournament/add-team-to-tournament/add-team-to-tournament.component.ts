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
import { TeamService } from '../../../team/team.service';
import { TeamTournamentService } from '../../../team-tournament/team-tournament.service';
import { AddItemDialogFromListComponent } from '../../../../shared/ui/dialogs/add-item-dialog-from-list/add-item-dialog-from-list.component';
import { ItemTournamentComponent } from '../item-tournament.component';
import { AppState } from '../../../../shared/state/appstate';
import { Store } from '@ngrx/store';
import { teamTournamentActions } from '../../../team-tournament/store/actions';

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
      stringify: (item: ITeam) => `${item.title}`,
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

// private _sportId!: number;
// private _tournamentId!: number;
//
// @Input()
// set sportId(value: number) {
//   this._sportId = value;
//   this.teamService.refreshTeamsInSport(value);
// }
//
// get sportId(): number {
//   return this._sportId;
// }
//
// @Input()
// set tournamentId(value: number) {
//   this._tournamentId = value;
//   this.teamTournamentService.fetchTeamsByTournamentId(value);
// }
//
// get tournamentId(): number {
//   return this._tournamentId;
// }

// tournamentTeams$ = this.teamTournamentService.teamsInTournament$;
// allTeams$ = this.teamService.teams$;

// create availableTeams$ as a getter so it always reflects the current state of allTeams$ and tournamentTeams$
