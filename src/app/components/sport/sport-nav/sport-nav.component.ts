import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {SportComponent} from "../sport.component";
import {HeaderMenuComponent} from "../../../shared/ui/headermenu/header-menu.component";
import {IBaseIdElse} from "../../../type/base.type";
import {tap} from "rxjs/operators";
import {map} from "rxjs";
import {SortService} from "../../../services/sort.service";
import {TuiLoaderModule} from "@taiga-ui/core";
import {AsyncPipe} from "@angular/common";

@Component({
  selector: 'app-sport-nav',
  standalone: true,
  imports: [
    HeaderMenuComponent,
    TuiLoaderModule,
    AsyncPipe
  ],
  templateUrl: './sport-nav.component.html',
  styleUrl: './sport-nav.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SportNavComponent extends SportComponent implements OnInit{

  sportTeamsRout(item: IBaseIdElse): any[] {
    return [`/sports/id/${item.id}/teams`];
  }

  sportPlayersRout(item: IBaseIdElse): any[] {
    return [`/sports/id/${item.id}/players`];
  }

  ngOnInit() {
    this.dataList$ = this.sportService.findAll()
      .pipe(
        tap(data => console.log(data)),
        map(data => SortService.sort(data, 'title'))
    );
  }

}
