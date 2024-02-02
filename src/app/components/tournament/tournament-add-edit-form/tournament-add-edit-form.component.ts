import { Component, inject, Input } from '@angular/core';

import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  TuiButtonModule,
  TuiDialogModule,
  TuiHintModule,
} from '@taiga-ui/core';
import { TuiInputModule } from '@taiga-ui/kit';
import { TuiAutoFocusModule } from '@taiga-ui/cdk';
import { TournamentService } from '../tournament.service';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { ITournament } from '../../../type/tournament.type';
import { ISport } from '../../../type/sport.type';

@Component({
  selector: 'app-tournament-add-edit-form',
  standalone: true,
  imports: [
    TuiButtonModule,
    TuiHintModule,
    TuiDialogModule,
    TuiInputModule,
    ReactiveFormsModule,
    TuiAutoFocusModule,
  ],
  templateUrl: './tournament-add-edit-form.component.html',
  styleUrl: './tournament-add-edit-form.component.less',
})
export class TournamentAddEditFormComponent {
  @Input() addTournament!: (data: any) => void;
  @Input() sport_Id!: number;

  tournamentForm = new FormGroup({
    tournamentTitle: new FormControl(''),
  });

  open = false;

  showDialog(): void {
    this.open = true;
  }

  onSubmit(): void {
    if (this.tournamentForm.valid) {
      const formValue = this.tournamentForm.getRawValue();

      // Now we construct the data object here in onSubmit
      const data: ITournament = {
        title: formValue.tournamentTitle!,
        description: 'string',
        tournament_logo_url: 'www',
        season_id: 6,
        sport_id: this.sport_Id,
      };

      console.log(formValue.tournamentTitle, data.sport_id);
      this.addTournament(data);
    }
  }

  // @Input() seasonId: number = 6;
  // @Input() sportId!: number;

  tournamentService = inject(TournamentService);
  // private tournamentsSubject = new BehaviorSubject<ITournament[]>([]);
  // public tournaments$ = this.tournamentsSubject.asObservable();

  // data: ITournament = {
  //   title: 'New Tournament 8',
  //   description: 'string',
  //   tournament_logo_url: 'www',
  //   season_id: this.seasonId,
  //   sport_id: this.sportId,
  // };

  // addTournament() {
  //   if (this.tournamentForm.valid) {
  //     this.data.title = this.tournamentForm.value.tournamentTitle!;
  //     // update this.data with other form controls if needed
  //     this.tournamentService.addTournament(this.data).subscribe((res) => {
  //       console.log('HTTP response', res);
  //     });
  //   }
  // }
}
