import { Component, Input } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { environment } from '../../../../../environments/environment';
import {
  TuiAvatarModule,
  TuiDataListWrapperModule,
  tuiItemsHandlersProvider,
  TuiSelectModule,
} from '@taiga-ui/kit';
import { IPerson } from '../../../../type/person.type';
import { TuiLetModule } from '@taiga-ui/cdk';
import { AsyncPipe, UpperCasePipe } from '@angular/common';
import { WithNullOptionPipe } from '../../../../pipes/with-null-option.pipe';

@Component({
  selector: 'app-select-from-person',
  standalone: true,
  imports: [
    AsyncPipe,
    FormsModule,
    ReactiveFormsModule,
    TuiDataListWrapperModule,
    TuiLetModule,
    TuiSelectModule,
    UpperCasePipe,
    TuiAvatarModule,
    WithNullOptionPipe,
  ],
  providers: [
    tuiItemsHandlersProvider({
      stringify: (person: IPerson) =>
        `${person.first_name} ${person.second_name}`,
    }),
  ],
  templateUrl: './select-from-person.component.html',
  styleUrl: './select-from-person.component.less',
})
export class SelectFromPersonComponent<T> {
  @Input() title: string = 'item';
  @Input() itemsList: T[] = [];
  @Input() formField!: FormControl;
  @Input() avatarProperty: string = 'avatarUrl';
  @Input() nullable: boolean = false;

  @Input() stringifyFn?: (item: T) => string;

  backendUrl = environment.backendUrl;
}
