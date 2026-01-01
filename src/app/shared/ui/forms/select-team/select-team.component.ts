import { TuiSelectModule } from '@taiga-ui/legacy';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import {
  ControlValueAccessor,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { tuiItemsHandlersProvider, TuiDataListWrapper } from '@taiga-ui/kit';
import { Observable, of } from 'rxjs';
import { ITeam } from '../../../../type/team.type';
import { TuiDataList, TuiDropdown } from '@taiga-ui/core';
import { IPosition } from '../../../../type/position.type';
import { toTitleCase } from '../../../../base/helpers';

@Component({
  selector: 'app-select-team',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    TuiDataListWrapper,
    TuiSelectModule,
    TuiDataList,
    TitleCasePipe,
    TuiDropdown,
  ],
  providers: [
    tuiItemsHandlersProvider({
      stringify: (item: ITeam) => toTitleCase(`${item.title}`),
    }),
  ],
  templateUrl: './select-team.component.html',
  styleUrl: './select-team.component.less',
})
export class SelectTeamComponent {
  @Input() teamsList: ITeam[] | null = [];
  @Input() sportId!: number;
  @Input() control: FormControl | null = null;

  @Output() teamSelect = new EventEmitter<number>();

  onSelect(teamId: number) {
    // console.log('teamId', teamId);
    if (this.control) {
      if (this.control.value) {
        this.teamSelect.emit(teamId);
      }
    }
  }
}
