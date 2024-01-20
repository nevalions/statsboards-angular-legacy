import {Component, Input} from '@angular/core';
import {TuiIslandModule} from "@taiga-ui/kit";
import {Observable} from "rxjs";
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

export class ListOfItemsIslandComponent<T extends {id: number, p?: string}> {
  @Input() data: T[] | undefined;
  @Input() emptyMessage: string = 'No data available';
  @Input() formatPath: (item: T) => string = () => '';
  @Input() titleProperty: keyof T = 'id';
  @Input() paragraphProperty: keyof T = 'p';
}
