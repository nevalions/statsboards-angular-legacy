import { TuiSelectModule } from "@taiga-ui/legacy";
import { TuiLet } from "@taiga-ui/cdk";
import { Component, Input } from '@angular/core';
import { NgIf, UpperCasePipe } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { tuiItemsHandlersProvider, TuiDataListWrapper, TuiAvatar } from '@taiga-ui/kit';
import { AnyObjectWithTitle } from '../../../../type/base.type';
import { environment } from '../../../../../environments/environment';
import { WithNullOptionPipe } from '../../../../pipes/with-null-option.pipe';
import { toTitleCase } from '../../../../base/helpers';

@Component({
  selector: 'app-select-from-list',
  standalone: true,
  imports: [
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
