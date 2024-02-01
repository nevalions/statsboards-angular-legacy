import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-tournament',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './tournament.component.html',
  styleUrl: './tournament.component.less',
})
export class TournamentComponent {}
