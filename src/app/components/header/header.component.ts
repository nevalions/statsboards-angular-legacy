import { TuiLink } from "@taiga-ui/core";
import {Component, Input} from '@angular/core';
import {SportNavComponent} from "../sport/sport-nav/sport-nav.component";
import {RouterLink, RouterLinkActive} from "@angular/router";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    SportNavComponent,
    TuiLink,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.less'
})

export class HeaderComponent {
  @Input() title: string = '';

}
