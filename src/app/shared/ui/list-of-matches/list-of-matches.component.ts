import {Component, Input} from '@angular/core';
import {Observable} from "rxjs";
import {AsyncPipe, DatePipe} from "@angular/common";
import {IMatchFullData} from "../../../type/match.type";
import {TuiLoaderModule} from "@taiga-ui/core";
import {TuiIslandModule} from "@taiga-ui/kit";

@Component({
  selector: 'app-list-of-matches',
  standalone: true,
  imports: [
    AsyncPipe,
    TuiLoaderModule,
    TuiIslandModule,
    DatePipe
  ],
  templateUrl: './list-of-matches.component.html',
  styleUrl: './list-of-matches.component.less'
})

export class ListOfMatchesComponent{

  @Input() data: IMatchFullData[] = [];
  // @Input() data: Observable<IMatchFullData[]> | undefined;
  @Input() emptyMessage: string = 'No data available';
  @Input() formatPath: (item: IMatchFullData) => string = () => '';

}
