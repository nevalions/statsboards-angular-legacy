import { Component, inject, OnInit } from '@angular/core';
import { SportService } from './sport.service';
import { IBaseIdElse } from '../../type/base.type';
import { map, Observable, of } from 'rxjs';
import { SortService } from '../../services/sort.service';
import { tap } from 'rxjs/operators';
import { currentYear } from '../../base/constants';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { ISport } from '../../type/sport.type';
import { SportState } from './store/reducers';
import { sportActions } from './store/actions';

@Component({
  selector: 'app-sport',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './sport.component.html',
})
export class SportComponent {}
