import { TuiSelectModule } from "@taiga-ui/legacy";
import { TuiLet } from "@taiga-ui/cdk";
import { Component, Input } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { environment } from '../../../../../environments/environment';
import { tuiItemsHandlersProvider, TuiDataListWrapper, TuiAvatar } from '@taiga-ui/kit';
import { IPerson } from '../../../../type/person.type';
import { AsyncPipe, NgIf, UpperCasePipe } from '@angular/common';
import { WithNullOptionPipe } from '../../../../pipes/with-null-option.pipe';
import { toTitleCase } from '../../../../base/helpers';

@Component({
  selector: 'app-select-from-person',
  standalone: true,
  imports: [
    AsyncPipe,
    FormsModule,
    ReactiveFormsModule,
    TuiDataListWrapper,
    TuiLet,
    TuiSelectModule,
    UpperCasePipe,
    TuiAvatar,
    WithNullOptionPipe,
    NgIf,
  ],
  providers: [
    tuiItemsHandlersProvider({
      stringify: (person: IPerson) =>
        `${toTitleCase(person.first_name)} ${toTitleCase(person.second_name)}`,
    }),
  ],
  templateUrl: './select-from-person.component.html',
  styleUrl: './select-from-person.component.less',
})
export class SelectFromPersonComponent<T> {
  @Input() title: string = 'item';
  @Input() itemsList: T[] = [];
  @Input() formField!: FormControl;
  @Input() avatarProperty: string | null = 'avatarUrl';
  @Input() nullable: boolean = false;

  @Input() stringifyFn?: (item: T) => string;

  backendUrl = environment.backendUrl;
}
