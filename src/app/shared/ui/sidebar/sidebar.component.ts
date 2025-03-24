import { TuiSidebar } from "@taiga-ui/addon-mobile";
import { TuiAccordion } from "@taiga-ui/kit";
import { TuiActiveZone } from "@taiga-ui/cdk";
import { Component } from '@angular/core';
import { TuiLink, TuiButton } from "@taiga-ui/core";
import {SportComponent} from "../../../components/sport/sport.component";

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    TuiActiveZone,
    TuiAccordion,
    TuiLink,
    TuiButton,
    TuiSidebar,
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
