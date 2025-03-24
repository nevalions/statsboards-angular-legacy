import { TuiSelectModule } from "@taiga-ui/legacy";
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ITeam } from '../../../../type/team.type';
import { tuiItemsHandlersProvider } from '@taiga-ui/kit';
import { toTitleCase } from '../../../../base/helpers';
import { TitleCasePipe, UpperCasePipe } from '@angular/common';
import { TuiDataList, TuiDropdown } from '@taiga-ui/core';

@Component({
  selector: 'app-select-team-in-match',
  standalone: true,
  imports: [
    TitleCasePipe,
    TuiDataList,
    TuiSelectModule,
    ReactiveFormsModule,
    TuiDropdown,
    UpperCasePipe,
  ],
  providers: [
    tuiItemsHandlersProvider({
      stringify: (item: ITeam) => toTitleCase(`${item.title}`),
    }),
  ],
  templateUrl: './select-team-in-match.component.html',
  styleUrl: './select-team-in-match.component.less',
})
export class SelectTeamInMatchComponent {
  @Input() placeholder: string = 'offence team';
  @Input() teamsList!: (ITeam | null)[];
  @Input() control!: FormControl;
  @Output() teamSelected = new EventEmitter<ITeam>(); // Emitting the selected team

  onSelected(team: ITeam): void {
    this.control.setValue(team);
    this.teamSelected.emit(team);
  }

  // onSelected(team: ITeam): void {
  //   // console.log('selected player', player);
  //   this.control.setValue(team);
  // }
}
