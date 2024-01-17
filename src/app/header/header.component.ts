import {Component, Input} from '@angular/core';
import {SportNavComponent} from "../components/sport/sport-nav/sport-nav.component";
import {TuiLinkModule} from "@taiga-ui/core";
import {RouterLink, RouterLinkActive} from "@angular/router";
import {IBaseIdElse} from "../type/base.type";

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
