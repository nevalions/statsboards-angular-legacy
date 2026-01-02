import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { positionActions } from './store/actions';
import { Observable } from 'rxjs';
import { IPosition } from '../../type/position.type';
import { AppState } from '../../store/appstate';
import {
  selectAllPositions,
  selectAllSportPositions,
  selectCurrentPosition,
} from './store/reducers';

@Injectable({
  providedIn: 'root',
})
export class Position {
  private store = inject<Store<AppState>>(Store);

  currentPosition$: Observable<IPosition | null | undefined>;
  allPositions$: Observable<IPosition[]>;
  allSportPositions$: Observable<IPosition[]>;

  constructor() {
    this.currentPosition$ = this.store.select(selectCurrentPosition);
    this.allPositions$ = this.store.select(selectAllPositions);
    this.allSportPositions$ = this.store.select(selectAllSportPositions);
  }

  createPosition(position: IPosition) {
    this.store.dispatch(positionActions.create({ request: position }));
  }

  updatePosition(position: IPosition) {
    this.store.dispatch(
      positionActions.update({ id: position.id!, newPositionData: position }),
    );
  }

  loadCurrentPosition() {
    this.store.dispatch(positionActions.getId());
  }

  loadAllPositions() {
    this.store.dispatch(positionActions.getAll());
  }

  loadAllPositionsBySportId() {
    this.store.dispatch(positionActions.getAllPositionsBySportId());
  }

  deletePosition() {
    this.store.dispatch(positionActions.delete());
  }

  deletePositionWithId(positionId: number) {
    this.store.dispatch(positionActions.deleteById({ id: positionId }));
  }
}
