import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from '../../../store/appstate';
import { ISponsorLine, ISponsorLineFullData } from '../../../type/sponsor.type';
import { sponsorLineActions } from './store/actions';

@Injectable({
  providedIn: 'root',
})
export class SponsorLine {
  private store = inject<Store<AppState>>(Store);

  sponsorLine$: Observable<ISponsorLine | null | undefined>;
  sponsorLineWithFullData$: Observable<ISponsorLineFullData | null | undefined>;
  matchSponsorLine$: Observable<ISponsorLineFullData | null | undefined>;
  allSponsorLines$: Observable<ISponsorLine[]>;

  constructor() {
    const store = this.store;

    this.sponsorLine$ = store.select(
      (state) => state.sponsorLine.currentSponsorLine,
    );
    this.allSponsorLines$ = store.select(
      (state) => state.sponsorLine.allSponsorLines,
    );
    this.sponsorLineWithFullData$ = store.select(
      (state) => state.sponsorLine.currentSponsorLineWithFullData,
    );
    this.matchSponsorLine$ = store.select(
      (state) => state.sponsorLine.currentMatchSponsorLineWithFullData,
    );
  }

  loadCurrentSponsorLine() {
    this.store.dispatch(sponsorLineActions.getId());
  }

  loadSponsorLineWithFullData(sponsorLineId: number) {
    this.store.dispatch(
      sponsorLineActions.getFullDataSponsorLine({ sponsorLineId }),
    );
  }

  loadMatchSponsorLineWithFullData() {
    this.store.dispatch(sponsorLineActions.getFullDataMatchSponsorLine());
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
