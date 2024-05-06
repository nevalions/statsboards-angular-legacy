import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { positionActions } from './store/actions';
import { Observable } from 'rxjs';
import { IPosition } from '../../type/position.type';
import { AppState } from '../../store/appstate';

@Injectable({
  providedIn: 'root',
})
export class Position {
  currentPosition$: Observable<IPosition | null | undefined>;
  allPositions$: Observable<IPosition[]>;
  allSportPositions$: Observable<IPosition[]>;

  constructor(private store: Store<AppState>) {
    this.currentPosition$ = store.select(
      (state) => state.position.currentPosition,
    );
    this.allPositions$ = store.select((state) => state.position.allPositions);
    this.allSportPositions$ = store.select(
      (state) => state.position.allSportPositions,
    );
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
}
