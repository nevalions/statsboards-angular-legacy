import {Component, OnInit} from '@angular/core';
import {SportService} from "../../../services/sport.service";
import {ISport} from "../../../type/sport";
import {Observable, of, switchMap} from "rxjs";
import {tap} from "rxjs/operators";
import {AsyncPipe} from "@angular/common";
import {ActivatedRoute, Router} from "@angular/router";
import {TuiBlockStatusModule} from "@taiga-ui/layout";
import {TuiSelectModule} from "@taiga-ui/kit";
import {TuiButtonModule} from "@taiga-ui/core";

@Component({
  selector: 'app-item-sport',
  standalone: true,
  imports: [
    AsyncPipe,
    TuiBlockStatusModule,
    TuiSelectModule,
    TuiButtonModule
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
