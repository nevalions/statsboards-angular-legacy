import {Component, inject, Input, OnInit} from '@angular/core';
import {TUI_ARROW} from "@taiga-ui/kit";
import {DropDownMenuComponent} from "../dropdownmenu.component";
import {ISeasonAndSport, ISport} from "../../../../type/sport.type";
import {SportService} from "../../../../services/sport.service";
import {TournamentService} from "../../../../services/tournament.service";
import {SeasonService} from "../../../../services/season.service";
import {Observable, of} from "rxjs";
import {IBaseIdElse} from "../../../../type/base.type";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-sport-with-season-dropdown',
  standalone: true,
  imports: [
    DropDownMenuComponent
  ],
  templateUrl: './sport-with-season-dropdown.component.html',
  styleUrl: './sport-with-season-dropdown.component.less'
})
export class SportWithSeasonDropdownComponent implements OnInit{
  private route = inject(ActivatedRoute)
  private sportService = inject(SportService)
  private seasonService = inject(SeasonService)

  @Input() sportId: number = 1
  seasonsWithSportId$: Observable<IBaseIdElse[]> = of([]);

  protected readonly arrow = TUI_ARROW;


  seasonSportRoute(item: ISeasonAndSport): any{
    return [`/sports/id/${item.sport_id}/seasons/${item.year}/tournaments`];
  }

  mapItemToLabelYear(item: IBaseIdElse): string {
    return item.year?.toString() ?? '';
  }

  ngOnInit() {
    this.seasonsWithSportId$ = this.seasonService.getSeasonsWithSportId(this.sportId);
  }


}
