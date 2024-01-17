import {Component, OnInit} from '@angular/core';
import {SportService} from "../../../services/sport.service";
import {ISport} from "../../../type/sport";
import {Observable, of, switchMap} from "rxjs";
import {tap} from "rxjs/operators";
import {AsyncPipe, UpperCasePipe} from "@angular/common";
import {ActivatedRoute, Router} from "@angular/router";
import {TuiBlockStatusModule} from "@taiga-ui/layout";
import {TuiIslandModule, TuiSelectModule} from "@taiga-ui/kit";
import {TuiButtonModule} from "@taiga-ui/core";
import {SeasonDropdownComponent} from "../../season/season-dropdown/season-dropdown.component";
import {ListOfItemsIslandComponent} from "../../../shared/ui/list-of-items-island/list-of-items-island.component";

@Component({
  selector: 'app-item-sport',
  standalone: true,
  imports: [
    AsyncPipe,
    TuiBlockStatusModule,
    TuiSelectModule,
    TuiButtonModule,
    TuiIslandModule,
    UpperCasePipe,
    SeasonDropdownComponent,
    ListOfItemsIslandComponent
  ],
  templateUrl: './item-sport.component.html',
  styleUrl: './item-sport.component.less'
})
export class ItemSportComponent implements OnInit{
  item$: Observable<ISport> = of({} as ISport);
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private sportService: SportService
  ) {}


  ngOnInit() {
    this.item$ = this.route.paramMap.pipe(
      switchMap(params => {
        const id = Number(params.get('id'));
        return this.sportService.findById(id)
          .pipe(
            tap(sport => console.log(`Sport item ID:${sport.id}`)),
          )
      })
    );
  }
}
