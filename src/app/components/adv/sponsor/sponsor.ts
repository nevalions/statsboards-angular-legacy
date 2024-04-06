import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ISponsor } from '../../../type/sponsor.type';
import { AppState } from '../../../store/appstate';
import { sponsorActions } from './store/actions';

@Injectable({
  providedIn: 'root',
})
export class Sponsor {
  sponsor$: Observable<ISponsor | null | undefined>;
  allSponsors$: Observable<ISponsor[]>;

  constructor(private store: Store<AppState>) {
    this.sponsor$ = store.select((state) => state.sponsor.currentSponsor);
    this.allSponsors$ = store.select((state) => state.sponsor.allSponsors);
  }

  loadCurrentSponsor() {
    this.store.dispatch(sponsorActions.getId());
  }

  loadAllSponsors() {
    this.store.dispatch(sponsorActions.getAll());
  }

  createSponsor(sponsor: ISponsor) {
    this.store.dispatch(sponsorActions.create({ request: sponsor }));
  }

  // deleteSponsor(id: number) {
  //   this.store.dispatch(sponsorActions.delete({ id }));
  // }
}
