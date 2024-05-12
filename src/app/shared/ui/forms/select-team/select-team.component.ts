import { Component, Input } from '@angular/core';
import { AsyncPipe, TitleCasePipe, UpperCasePipe } from '@angular/common';
import {
  ControlValueAccessor,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  TuiAvatarModule,
  TuiDataListWrapperModule,
  tuiItemsHandlersProvider,
  TuiSelectModule,
} from '@taiga-ui/kit';
import { TuiLetModule } from '@taiga-ui/cdk';
import { Observable, of } from 'rxjs';
import { ITeam } from '../../../../type/team.type';
import { AddButtonIconComponent } from '../../buttons/add-button-icon/add-button-icon.component';
import { TuiDataListModule } from '@taiga-ui/core';
import { IPosition } from '../../../../type/position.type';
import { toTitleCase } from '../../../../base/helpers';

@Component({
  selector: 'app-select-team',
  standalone: true,
  imports: [
    AsyncPipe,
    FormsModule,
    ReactiveFormsModule,
    TuiAvatarModule,
    TuiDataListWrapperModule,
    TuiLetModule,
    TuiSelectModule,
    AddButtonIconComponent,
    TuiDataListModule,
    UpperCasePipe,
    TitleCasePipe,
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
  @Input() control!: FormControl;
}
