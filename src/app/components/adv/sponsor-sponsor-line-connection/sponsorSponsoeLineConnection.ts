import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from '../../../store/appstate';
import { SponsorSponsorLineConnectionState } from './store/reducers';

@Injectable({
  providedIn: 'root',
})
export class SponsorSponsorLineConnection {
  constructor(private store: Store<AppState>) {}

  // loadCurrentSponsorLine() {
  //   this.store.dispatch(sponsorLineActions.getId());
  // }
  //
  // loadAllSponsorLines() {
  //   this.store.dispatch(sponsorLineActions.getAll());
  // }
  //
  // createSponsorLine(sponsorLine: ISponsorLine) {
  //   this.store.dispatch(sponsorLineActions.create({ request: sponsorLine }));
  // }

  // deleteSponsorLine(id: number) {
  //   this.store.dispatch(sponsorLineActions.delete({ id }));
  // }
}
