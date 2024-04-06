import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from '../../../store/appstate';
import { ISponsorLine, ISponsorLineFullData } from '../../../type/sponsor.type';
import { sponsorLineActions } from './store/actions';

@Injectable({
  providedIn: 'root',
})
export class SponsorLine {
  sponsorLine$: Observable<ISponsorLine | null | undefined>;
  sponsorLineWithFullData$: Observable<ISponsorLineFullData | null | undefined>;
  allSponsorLines$: Observable<ISponsorLine[]>;

  constructor(private store: Store<AppState>) {
    this.sponsorLine$ = store.select(
      (state) => state.sponsorLine.currentSponsorLine,
    );
    this.allSponsorLines$ = store.select(
      (state) => state.sponsorLine.allSponsorLines,
    );
    this.sponsorLineWithFullData$ = store.select(
      (state) => state.sponsorLine.currentSponsorLineWithFullData,
    );
  }

  loadCurrentSponsorLine() {
    this.store.dispatch(sponsorLineActions.getId());
  }

  loadAllSponsorLines() {
    this.store.dispatch(sponsorLineActions.getAll());
  }

  createSponsorLine(sponsorLine: ISponsorLine) {
    this.store.dispatch(sponsorLineActions.create({ request: sponsorLine }));
  }

  // deleteSponsorLine(id: number) {
  //   this.store.dispatch(sponsorLineActions.delete({ id }));
  // }
}
