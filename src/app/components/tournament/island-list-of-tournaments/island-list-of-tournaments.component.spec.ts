import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IslandListOfTournamentsComponent } from './island-list-of-tournaments.component';
import { UpperCasePipe } from '@angular/common';
import { TuiAvatar } from '@taiga-ui/kit';
import { TuiTitle, TuiSurface, TuiAppearance } from '@taiga-ui/core';
import { TuiCardLarge, TuiCell } from '@taiga-ui/layout';
import { Router } from '@angular/router';

describe('IslandListOfTournamentsComponent', () => {
  let component: IslandListOfTournamentsComponent;
  let fixture: ComponentFixture<IslandListOfTournamentsComponent>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    Object.defineProperty(mockRouter, 'url', {
      get: () => '/sport/1/season/1/tournaments',
      configurable: true,
    });

    await TestBed.configureTestingModule({
      imports: [
        IslandListOfTournamentsComponent,
        TuiCardLarge,
        TuiCell,
        TuiTitle,
        TuiSurface,
        TuiAppearance,
        TuiAvatar,
        UpperCasePipe,
      ],
      providers: [{ provide: Router, useValue: mockRouter }],
    }).compileComponents();

    fixture = TestBed.createComponent(IslandListOfTournamentsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have data input', () => {
    expect(component.data).toBeDefined();
    expect(component.data).toEqual([]);
  });

  it('should accept tournament data via @Input', () => {
    const mockTournaments = [
      { id: 1, title: 'Tournament 1' } as any,
      { id: 2, title: 'Tournament 2' } as any,
    ];
    component.data = mockTournaments;
    expect(component.data.length).toBe(2);
  });

  it('should navigate to tournament item', () => {
    component.data = [{ id: 1, title: 'Test Tournament' } as any];
    Object.defineProperty(mockRouter, 'url', {
      get: () => '/sport/1/season/1/tournaments',
      configurable: true,
    });

    component.navigateToTournamentItem(component.data[0]);

    expect(mockRouter.navigate).toHaveBeenCalled();
    const navigateArgs = mockRouter.navigate.calls.mostRecent().args[0];
    expect(navigateArgs[navigateArgs.length - 1]).toBe('1');
    expect(navigateArgs[navigateArgs.length - 2]).toBe('tournament');
  });

  it('should handle navigation when already on tournament page', () => {
    component.data = [{ id: 5, title: 'Test Tournament' } as any];
    Object.defineProperty(mockRouter, 'url', {
      get: () => '/sport/1/season/1/tournaments/tournament/3',
      configurable: true,
    });

    component.navigateToTournamentItem(component.data[0]);

    expect(mockRouter.navigate).toHaveBeenCalled();
  });

  it('should have backendUrl property', () => {
    expect(component['backendUrl']).toBeDefined();
  });
});
