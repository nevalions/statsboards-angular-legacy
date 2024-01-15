import {Component, Input} from '@angular/core';
import {AsyncPipe} from "@angular/common";
import {RouterLink, RouterLinkActive} from "@angular/router";
import {TuiButtonModule, TuiDataListModule, TuiHostedDropdownModule, TuiSvgModule} from "@taiga-ui/core";
import {IBaseIdTitle} from "../../../type/base.type";
import {Observable} from "rxjs";
import {PolymorpheusContent} from '@tinkoff/ng-polymorpheus'

@Component({
  selector: 'app-dropdownmenu',
  standalone: true,
  imports: [
    AsyncPipe,
    RouterLink,
    RouterLinkActive,
    TuiButtonModule,
    TuiDataListModule,
    TuiHostedDropdownModule,
    TuiSvgModule
  ],
  templateUrl: './dropdownmenu.component.html',
  styleUrl: './dropdownmenu.component.less'
})

export class DropDownMenuComponent {

  @Input() dataList: Observable<IBaseIdTitle[]> | undefined;
  @Input() mapItemToLabel: (item: IBaseIdTitle) => string = () => '';
  @Input() mapItemToRoute: (item: IBaseIdTitle) => any[] = () => [];
  @Input() arrow: PolymorpheusContent<any>;
  @Input() emptyMessage: string = 'No data available';

}
