import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { provideMockStore } from '@ngrx/store/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ScoreboardDisplayFlatComponent } from './scoreboard-display-flat.component';
import { IMatchFullDataWithScoreboard } from '../../../type/match.type';

describe('ScoreboardDisplayFlatComponent', () => {
  let component: ScoreboardDisplayFlatComponent;
  let fixture: ComponentFixture<ScoreboardDisplayFlatComponent>;

  const mockMatchData: IMatchFullDataWithScoreboard = {
    id: 1,
    scoreboard_data: {
      is_main_sponsor: true,
      is_tournament_logo: true,
      is_qtr: true,
      is_time: true,
      is_playclock: true,
      is_downdistance: true,
      team_a_game_color: '#FF0000',
      team_b_game_color: '#0000FF',
    },
    home_team: {
      id: 1,
      title: 'Home Team',
      short_title: 'HOME',
      color_hex: '#FF0000',
    },
    away_team: {
      id: 2,
      title: 'Away Team',
      short_title: 'AWAY',
      color_hex: '#0000FF',
    },
    home_score: 10,
    away_score: 7,
    match: {
      team_a_id: 1,
      team_b_id: 2,
    },
  } as any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ScoreboardDisplayFlatComponent,
        HttpClientTestingModule,
        BrowserAnimationsModule,
      ],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        provideMockStore({
          initialState: {
            footballEvent: {
              allFootballEvents: [],
              footballEvents: [],
            },
            playerInMatch: {
              selectedPlayerInMatchLower: null,
              selectedFootballQbLower: null,
            },
          },
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ScoreboardDisplayFlatComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render without data', () => {
    fixture.detectChanges();
    const element = fixture.nativeElement;
    expect(element).toBeTruthy();
  });

  it('should render with match data', () => {
    component.data = mockMatchData;
    fixture.detectChanges();
    const element = fixture.nativeElement;
    expect(element).toBeTruthy();
  });
});
