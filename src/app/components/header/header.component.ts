import {Component, Input} from '@angular/core';
import {SportNavComponent} from "../sport/sport-nav/sport-nav.component";
import {TuiLinkModule} from "@taiga-ui/core";
import {RouterLink, RouterLinkActive} from "@angular/router";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    SportNavComponent,
    TuiLinkModule,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.less'
})

export class HeaderComponent {
  @Input() title: string = '';

}
