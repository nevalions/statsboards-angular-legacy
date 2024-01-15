import {Component, OnInit} from '@angular/core';
import {AsyncPipe, UpperCasePipe} from "@angular/common";
import {SeasonService} from "../services/season.service";
import {Observable, of} from "rxjs";
import {IBaseIdTitle} from "../type/base.type";

@Component({
  selector: 'app-season',
  standalone: true,
    imports: [
        AsyncPipe,
        UpperCasePipe
    ],
  templateUrl: './season.component.html',
  styleUrl: './season.component.scss'
})
export class SeasonComponent implements OnInit{
  constructor(
    public seasonService: SeasonService
  ) {
  }

  dataList$: Observable<IBaseIdTitle[]> = of([]);

  ngOnInit() {
    this.dataList$ = this.seasonService.findAll();
  }


}
