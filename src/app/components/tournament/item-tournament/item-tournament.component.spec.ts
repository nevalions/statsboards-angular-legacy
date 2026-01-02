import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ItemTournamentComponent } from './item-tournament.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TuiError, TuiLoader } from '@taiga-ui/core';
import { TuiInputNumberModule } from '@taiga-ui/legacy';
import {
  AsyncPipe,
  DecimalPipe,
  TitleCasePipe,
  UpperCasePipe,
} from '@angular/common';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { Tournament } from '../tournament';
import { Season } from '../../season/season';
import { Sport } from '../../sport/sport';
import { Team } from '../../team/team';
import { TeamTournament } from '../../team-tournament/teamTournament';
import { Match } from '../../match/match';
import { MatchWithFullData } from '../../match-with-full-data/matchWithFullData';
import { Sponsor } from '../../adv/sponsor/sponsor';
import { SponsorLine } from '../../adv/sponsor-line/sponsorLine';
import { Position } from '../../position/postion';
import { Person } from '../../person/person';
import { PlayerInTeamTournament } from '../../player-team-tournament/player-team-tournament';
import { Player } from '../../player/player';
import { Search } from '../../../store/search/search';
import { Pagination } from '../../../store/pagination/pagination';

describe('ItemTournamentComponent', () => {
  let component: ItemTournamentComponent;
  let fixture: ComponentFixture<ItemTournamentComponent>;
  let mockStore: jasmine.SpyObj<Store>;

  beforeEach(async () => {
    mockStore = jasmine.createSpyObj('Store', ['dispatch']);

    await TestBed.configureTestingModule({
      imports: [
        ItemTournamentComponent,
        ReactiveFormsModule,
        AsyncPipe,
        UpperCasePipe,
        TuiLoader,
        TuiError,
        TuiInputNumberModule,
        DecimalPipe,
        TitleCasePipe,
      ],
      providers: [
        { provide: Store, useValue: mockStore },
        {
          provide: Router,
          useValue: jasmine.createSpyObj('Router', ['navigate']),
        },
        Tournament,
        Season,
        Sport,
        Team,
        TeamTournament,
        Match,
        MatchWithFullData,
        Sponsor,
        SponsorLine,
        Position,
        Person,
        PlayerInTeamTournament,
        Player,
        Search,
        Pagination,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ItemTournamentComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize observables', () => {
    expect(component.sport$).toBeDefined();
    expect(component.teamsInTournament$).toBeDefined();
    expect(component.tournament$).toBeDefined();
    expect(component.currentTournamentMainSponsor$).toBeDefined();
    expect(component.sponsorLine$).toBeDefined();
    expect(component.allSponsors$).toBeDefined();
    expect(component.allSponsorLines$).toBeDefined();
    expect(component.matchesInTournament$).toBeDefined();
    expect(component.allSportPlayersWithPerson$).toBeDefined();
    expect(component.allAvailablePlayersToAddInTournament$).toBeDefined();
    expect(component.allSportPositions$).toBeDefined();
    expect(component.allPlayersInTournament$).toBeDefined();
    expect(component.currentPage$).toBeDefined();
  });

  it('should have menuDropdownOpen property', () => {
    expect(component.menuDropdownOpen).toBeDefined();
    expect(component.menuDropdownOpen).toBeFalsy();
  });

  it('should have buttonTitle property', () => {
    expect(component.buttonTitle).toBeDefined();
    expect(component.buttonTitle).toBe('Tournament');
  });

  it('should initialize formWeek FormGroup', () => {
    expect(component.formWeek).toBeDefined();
    expect(component.formWeek.get('matchWeekSearch')).toBeDefined();
  });

  it('should have onSearch method', () => {
    expect(component['onSearch']).toBeDefined();
  });

  it('should have onSearchByWeek method', () => {
    expect(component['onSearchByWeek']).toBeDefined();
  });

  it('should have onDelete method', () => {
    expect(component['onDelete']).toBeDefined();
  });

  it('should have onTeamRemoveFromTournament method', () => {
    expect(component['onTeamRemoveFromTournament']).toBeDefined();
  });

  it('should have setCurrentPage method', () => {
    expect(component['setCurrentPage']).toBeDefined();
  });

  it('should have changePageSize method', () => {
    expect(component['changePageSize']).toBeDefined();
  });

  it('should have setPlayerInTournamentCurrentPage method', () => {
    expect(component['setPlayerInTournamentCurrentPage']).toBeDefined();
  });

  it('should have changePlayerInTournamentPageSize method', () => {
    expect(component['changePlayerInTournamentPageSize']).toBeDefined();
  });

  it('should have parsMatchesFromTournamentEESL method', () => {
    expect(component['parsMatchesFromTournamentEESL']).toBeDefined();
  });

  it('should have helper functions', () => {
    expect(component['calculateAgeStats']).toBeDefined();
    expect(component['getFormControl']).toBeDefined();
  });
});
