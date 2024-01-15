import { TuiRootModule, TuiDialogModule, TuiAlertModule } from "@taiga-ui/core";
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import {HeaderComponent} from "./header/header.component";
import {SportComponent} from "./sport/sport.component";
import {SeasonComponent} from "./season/season.component";
import {UiComponent} from "./shared/ui/ui.component";
import {SharedComponent} from "./shared/shared.component";
import {SidebarComponent} from "./shared/ui/sidebar/sidebar.component";
import {TuiSidebarModule} from "@taiga-ui/addon-mobile";
import {TuiActiveZoneModule} from "@taiga-ui/cdk";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    TuiRootModule,
    TuiDialogModule,
    TuiAlertModule,
    TuiSidebarModule,
    TuiActiveZoneModule,
    HeaderComponent,
    SportComponent,
    SeasonComponent,
    UiComponent,
    SharedComponent,
    SidebarComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.less'
})
export class AppComponent {
  title = 'statsboards-angular-legacy';
}
