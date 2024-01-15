import { TuiRootModule, TuiDialogModule, TuiAlertModule } from "@taiga-ui/core";
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import {HeaderComponent} from "./header/header.component";
import {SportComponent} from "./sport/sport.component";
import {SeasonComponent} from "./season/season.component";
import {SidebarComponent} from "./shared/ui/sidebar/sidebar.component";
import {SportDropdownComponent} from "./sport/sport-dropdown/sport-dropdown.component";
import {SeasonDropdownComponent} from "./season/season-dropdown/season-dropdown.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    HeaderComponent,
    SportComponent,
    SeasonComponent,
    SidebarComponent,
    TuiRootModule,
    TuiDialogModule,
    TuiAlertModule,
    SportDropdownComponent,
    SeasonDropdownComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.less'
})
export class AppComponent {
  title = 'StatsBoards';
}
