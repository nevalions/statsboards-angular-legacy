import { TUI_ARROW } from "@taiga-ui/legacy";
import { Component } from '@angular/core';
import {SeasonComponent} from "../season.component";
import {DropDownMenuComponent} from "../../../shared/ui/dropdownmenu/dropdownmenu.component";

@Component({
  selector: 'app-season-dropdown',
  standalone: true,
  imports: [
    DropDownMenuComponent
  ],
  templateUrl: './season-dropdown.component.html',
  styleUrl: './season-dropdown.component.less'
})
export class SeasonDropdownComponent extends SeasonComponent{

  readonly arrow = TUI_ARROW;

}
