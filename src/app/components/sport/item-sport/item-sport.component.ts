import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-item-sport',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './item-sport.component.html',
  styleUrl: './item-sport.component.less',
})
export class ItemSportComponent {}
