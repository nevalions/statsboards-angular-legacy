import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-match',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './match.component.html',
  styleUrl: './match.component.less',
})
export class MatchComponent {}
