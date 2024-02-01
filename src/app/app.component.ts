import { TuiRootModule, TuiDialogModule, TuiAlertModule } from '@taiga-ui/core';
import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { SportComponent } from './components/sport/sport.component';
import { SeasonComponent } from './components/season/season.component';
import { SidebarComponent } from './shared/ui/sidebar/sidebar.component';
import { SportDropdownComponent } from './components/sport/sport-dropdown/sport-dropdown.component';
import { SeasonDropdownComponent } from './components/season/season-dropdown/season-dropdown.component';
import { SportNavComponent } from './components/sport/sport-nav/sport-nav.component';
import { HomeComponent } from './components/home/home.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    HomeComponent,
    HeaderComponent,
    SportComponent,
    SeasonComponent,
    TuiRootModule,
    TuiDialogModule,
    TuiAlertModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.less',
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent {
  title = 'StatsBoards';
}
