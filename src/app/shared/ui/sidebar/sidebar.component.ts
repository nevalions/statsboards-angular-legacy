import { Component } from '@angular/core';
import {TuiActiveZoneModule} from "@taiga-ui/cdk";
import {TuiAccordionModule} from "@taiga-ui/kit";
import {TuiButtonModule, TuiLinkModule} from "@taiga-ui/core";
import {TuiSidebarModule} from "@taiga-ui/addon-mobile";
import {SportComponent} from "../../../sport/sport.component";

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    TuiActiveZoneModule,
    TuiAccordionModule,
    TuiLinkModule,
    TuiButtonModule,
    TuiSidebarModule,
    SportComponent
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.less'
})
export class SidebarComponent {
  open:boolean = false;

  toggle(open: boolean): void {
    this.open = open;
  }

}
