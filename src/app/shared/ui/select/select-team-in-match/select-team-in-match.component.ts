import { Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ITeam } from '../../../../type/team.type';
import { tuiItemsHandlersProvider, TuiSelectModule } from '@taiga-ui/kit';
import { toTitleCase } from '../../../../base/helpers';
import { TitleCasePipe, UpperCasePipe } from '@angular/common';
import { TuiDataListModule, TuiHostedDropdownModule } from '@taiga-ui/core';

@Component({
  selector: 'app-select-team-in-match',
  standalone: true,
  imports: [
    TitleCasePipe,
    TuiDataListModule,
    TuiSelectModule,
    ReactiveFormsModule,
    TuiHostedDropdownModule,
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

  // readonly form = new FormGroup({
  //   team: new FormControl<ITeam | null>(null),
  // });

  onSelected(team: ITeam): void {
    // console.log('selected player', player);
    this.control.setValue(team);
  }
}
