import {Component, OnInit} from '@angular/core';
import {TuiBlockStatusModule} from "@taiga-ui/layout";
import {Router} from "@angular/router";
import {NavigationStateError} from "../type/error.type";
import {UpperCasePipe} from "@angular/common";

@Component({
  selector: 'app-pagenotfound',
  standalone: true,
  imports: [
    TuiBlockStatusModule,
    UpperCasePipe
  ],
  templateUrl: './page-not-found.component.html',
  styleUrl: './page-not-found.component.less'
})


export class PageNotFoundComponent implements OnInit{
  errorMessage:string = 'PAGE NOT FOUND';
  errorStatus:number = 404;
  errorStatusText: string ='NOT FOUND';

  constructor(){}

  ngOnInit() {
    const state = history.state as NavigationStateError;
    console.log(state)

    if (state) {
      this.errorMessage = state?.errorMessage ?? this.errorMessage;
      this.errorStatus = state?.errorStatus ?? this.errorStatus;
      this.errorStatusText = state?.errorStatusText ?? this.errorStatusText;
    }
  }
}
