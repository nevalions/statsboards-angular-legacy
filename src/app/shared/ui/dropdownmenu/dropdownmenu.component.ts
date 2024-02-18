import { Component, Input, ViewChild } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import {
  TuiButtonModule,
  TuiDataListModule,
  TuiHostedDropdownComponent,
  TuiHostedDropdownModule,
  TuiLoaderModule,
  TuiSvgModule,
} from '@taiga-ui/core';
import { IBaseIdElse } from '../../../type/base.type';
import { Observable } from 'rxjs';
import { PolymorpheusContent } from '@tinkoff/ng-polymorpheus';
import { ISeasonAndSport } from '../../../type/sport.type';

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
    TuiSvgModule,
    TuiLoaderModule,
  ],
  templateUrl: './dropdownmenu.component.html',
  styleUrl: './dropdownmenu.component.less',
})
export class DropDownMenuComponent {
  @ViewChild(TuiHostedDropdownComponent, { static: false }) dropdown:
    | TuiHostedDropdownComponent
    | undefined;

  closeDropdown() {
    if (this.dropdown) {
      this.dropdown.updateOpen(false);
    }
  }

  @Input() title: string = 'Menu';
  @Input() dataList: Observable<IBaseIdElse[]> | undefined;
  @Input() mapItemToLabel: (item: IBaseIdElse) => string = () => '';
  @Input() mapItemToRoute: (item: ISeasonAndSport) => any = () => [];
  @Input() arrow: PolymorpheusContent<any>;
  @Input() emptyMessage: string = 'No data available';
}
