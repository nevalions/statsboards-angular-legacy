import { Routes } from '@angular/router';
import { MatchComponent } from './match.component';
import { ItemMatchComponent } from './item-match/item-match.component';

export const MATCH_ROUTES: Routes = [
  { path: '', component: MatchComponent },
  {
    path: 'id/:id',
    component: ItemMatchComponent,
    data: { breadcrumbs: [{ caption: 'Match' }] },
  },
];
