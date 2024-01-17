import {ChangeDetectionStrategy, Component} from '@angular/core';
import {SportComponent} from "../sport.component";
import {HeaderMenuComponent} from "../../../shared/ui/headermenu/header-menu.component";

@Component({
  selector: 'app-sport-nav',
  standalone: true,
  imports: [
    HeaderMenuComponent
  ],
  templateUrl: './sport-nav.component.html',
  styleUrl: './sport-nav.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SportNavComponent extends SportComponent{
}
