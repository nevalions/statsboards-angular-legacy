import { TUI_ARROW } from "@taiga-ui/legacy";
import {ChangeDetectionStrategy, Component} from '@angular/core';
import {SportComponent} from "../sport.component";
import {DropDownMenuComponent} from "../../../shared/ui/dropdownmenu/dropdownmenu.component";

@Component({
  selector: 'app-sport-dropdown',
  standalone: true,
  imports: [
    DropDownMenuComponent
  ],
  templateUrl: './sport-dropdown.component.html',
  styleUrl: './sport-dropdown.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class SportDropdownComponent extends SportComponent{

  readonly arrow = TUI_ARROW;

}
