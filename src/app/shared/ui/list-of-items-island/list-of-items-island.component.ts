import {Component, Input} from '@angular/core';
import {TuiIslandModule} from "@taiga-ui/kit";
import {Observable} from "rxjs";
import {IBaseIdElse} from "../../../type/base.type";
import {AsyncPipe} from "@angular/common";
import {TuiLoaderModule} from "@taiga-ui/core";

@Component({
  selector: 'app-list-of-items-island',
  standalone: true,
  imports: [
    TuiIslandModule,
    AsyncPipe,
    TuiLoaderModule
  ],
  templateUrl: './list-of-items-island.component.html',
  styleUrl: './list-of-items-island.component.less'
})

export class ListOfItemsIslandComponent {
  @Input() data: Observable<IBaseIdElse[]> | undefined;
  @Input() emptyMessage: string = 'No data available';
  @Input() formatPath: (item: IBaseIdElse) => string = () => '';
  @Input() titleProperty: keyof IBaseIdElse = 'id';
}
