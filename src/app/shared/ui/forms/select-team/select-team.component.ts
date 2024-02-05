import { Component, Input } from '@angular/core';
import { AsyncPipe } from '@angular/common';
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
  TuiSelectModule,
} from '@taiga-ui/kit';
import { TuiLetModule } from '@taiga-ui/cdk';
import { Observable, of } from 'rxjs';
import { ITeam } from '../../../../type/team.type';

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
  ],
  templateUrl: './select-team.component.html',
  styleUrl: './select-team.component.less',
})
export class SelectTeamComponent {
  @Input() teams$: Observable<ITeam[]> = of([]);
  @Input() label: string = '';
  @Input() value: string = '';
  @Input() formGroup!: FormGroup<any>;

  // Update parent form on value change
  onChange = (value: ITeam | null) => {};

  // Notify parent form on blur
  onTouched = () => {};

  writeValue(obj: any): void {}

  registerOnChange(fn: any): void {}

  registerOnTouched(fn: any): void {}
}
