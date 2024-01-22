import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {AsyncPipe, SlicePipe} from "@angular/common";
import {ListOfItemsIslandComponent} from "../../../shared/ui/list-of-items-island/list-of-items-island.component";
import {TuiButtonModule} from "@taiga-ui/core";
import {TuiPaginationModule} from "@taiga-ui/kit";
import {ITeam} from "../../../type/team.type";
import {Observable, of} from "rxjs";
import {
  FormSearchAutoCompleteComponent
} from "../../../shared/ui/forms/form-search-auto-complete/form-search-auto-complete.component";
import {FormSearchTextComponent} from "../../../shared/ui/forms/form-search-text/form-search-text.component";

@Component({
  selector: 'app-list-of-teams',
  standalone: true,
  imports: [
    AsyncPipe,
    ListOfItemsIslandComponent,
    SlicePipe,
    TuiButtonModule,
    TuiPaginationModule,
    FormSearchAutoCompleteComponent,
    FormSearchTextComponent
  ],

  templateUrl: './list-of-teams.component.html',
  styleUrl: './list-of-teams.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListOfTeamsComponent {
  @Input() itemsPerPage: number = 4;
  @Input() currentPageIndex: number = 1;
  @Input() emptyMessage: string = 'No teams available';
  @Input() teams$: Observable<ITeam[]> = of([]);
  @Input() formatPath: (item: ITeam) => string = () => '';
  @Input() titleProperty: keyof ITeam  = 'id';
  protected readonly Math = Math;


  stringifyFunc(data: ITeam): string {
    if (data) {
      return data.title.toString();
    }
    else {
      return ''
    }
  }

  matcherFunc(data: ITeam, search: string) {
    if(search) {
      return data.title.toLowerCase().startsWith(search)
      }
    return ''
  }

  // private sliceData(data: ITeam): ITeam[] {
  //   // Implement your slicing logic here, for example:
  //   // Assuming currentPageIndex and itemsPerPage are available in your component
  //   const start = (this.currentPageIndex - 1) * this.itemsPerPage;
  //   const end = this.currentPageIndex * this.itemsPerPage;
  //   return data.slice(start, end);
  // }

  setPage(pageIndex: number) {
    this.currentPageIndex = pageIndex;
  }
}
