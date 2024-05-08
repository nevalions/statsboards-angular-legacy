import { Component, Input } from '@angular/core';
import { AsyncPipe, NgIf, UpperCasePipe } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  TuiAvatarModule,
  TuiDataListWrapperModule,
  tuiItemsHandlersProvider,
  TuiSelectModule,
} from '@taiga-ui/kit';
import { TuiLetModule } from '@taiga-ui/cdk';
import { AnyObjectWithTitle } from '../../../../type/base.type';
import { environment } from '../../../../../environments/environment';
import { WithNullOptionPipe } from '../../../../pipes/with-null-option.pipe';
import { toTitleCase } from '../../../../base/helpers';

@Component({
  selector: 'app-select-from-list',
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
    NgIf,
  ],
  providers: [
    tuiItemsHandlersProvider({
      stringify: (item: AnyObjectWithTitle) =>
        `${toTitleCase(item.title)}` || item.toString(),
    }),
  ],
  templateUrl: './select-from-list.component.html',
  styleUrl: './select-from-list.component.less',
})
export class SelectFromListComponent<T> {
  @Input() title: string = 'item';
  @Input() itemsList: T[] = [];
  @Input() formField!: FormControl;
  @Input() avatarProperty: string = 'avatarUrl';
  @Input() nullable: boolean = false;

  @Input() stringifyFn?: (item: T) => string;

  backendUrl = environment.backendUrl;
}
