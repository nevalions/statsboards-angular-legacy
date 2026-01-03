import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddTeamToTournamentComponent } from './add-team-to-tournament.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TuiButton, TuiDialog } from '@taiga-ui/core';
import { AsyncPipe } from '@angular/common';
import { TuiDataListWrapper } from '@taiga-ui/kit';
import { TuiSelectModule } from '@taiga-ui/legacy';
import { TuiLet } from '@taiga-ui/cdk';
import { AddItemDialogFromListComponent } from '../../../../shared/ui/dialogs/add-item-dialog-from-list/add-item-dialog-from-list.component';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';

describe('AddTeamToTournamentComponent', () => {
  let component: AddTeamToTournamentComponent;
  let fixture: ComponentFixture<AddTeamToTournamentComponent>;
  let mockStore: jasmine.SpyObj<Store>;

  beforeEach(async () => {
    mockStore = jasmine.createSpyObj('Store', ['dispatch']);

    await TestBed.configureTestingModule({
      imports: [
        AddTeamToTournamentComponent,
        FormsModule,
        TuiButton,
        TuiDialog,
        ReactiveFormsModule,
        AsyncPipe,
        TuiDataListWrapper,
        TuiLet,
        TuiSelectModule,
        AddItemDialogFromListComponent,
      ],
      providers: [{ provide: Store, useValue: mockStore }],
    }).compileComponents();

    fixture = TestBed.createComponent(AddTeamToTournamentComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have tournamentId input', () => {
    expect(component.tournamentId).toBeDefined();
    component.tournamentId = 1;
    expect(component.tournamentId).toBe(1);
  });

  it('should have dialogId input', () => {
    expect(component.dialogId).toBeDefined();
    expect(component.dialogId).toBe('addTeamToTournamentDialog');
  });

  it('should have allSportTeams$ input', () => {
    expect(component.allSportTeams$).toBeDefined();
    const mockTeams$ = of([{ id: 1, title: 'Team 1' } as any]);
    component.allSportTeams$ = mockTeams$;
    expect(component.allSportTeams$).toBe(mockTeams$);
  });

  it('should have teamsInTournament$ input', () => {
    expect(component.teamsInTournament$).toBeDefined();
    const mockTeams$ = of([{ id: 1, title: 'Team 1' } as any]);
    component.teamsInTournament$ = mockTeams$;
    expect(component.teamsInTournament$).toBe(mockTeams$);
  });

  it('should have availableTeams$ computed observable', () => {
    const allTeams = [
      { id: 1, title: 'Team 1' } as any,
      { id: 2, title: 'Team 2' } as any,
      { id: 3, title: 'Team 3' } as any,
    ];
    const tournamentTeams = [{ id: 1, title: 'Team 1' } as any];
    component.allSportTeams$ = of(allTeams);
    component.teamsInTournament$ = of(tournamentTeams);

    let availableTeams: any[] = [];
    component.availableTeams$.subscribe((teams) => (availableTeams = teams));

    expect(availableTeams.length).toBe(2);
    expect(availableTeams.some((t: any) => t.id === 2)).toBeTruthy();
    expect(availableTeams.some((t: any) => t.id === 3)).toBeTruthy();
    expect(availableTeams.some((t: any) => t.id === 1)).toBeFalsy();
  });

  it('should dispatch teamTournamentActions.create on onAdd', () => {
    component.tournamentId = 1;
    const mockTeam = { id: 5, title: 'Team 5' } as any;

    component.onAdd(mockTeam);

    expect(mockStore.dispatch).toHaveBeenCalled();
  });

  it('should not dispatch if team is null', () => {
    component.tournamentId = 1;

    component.onAdd(null);

    expect(mockStore.dispatch).not.toHaveBeenCalled();
  });

  it('should not dispatch if team has no id', () => {
    component.tournamentId = 1;
    const mockTeam = { title: 'Team 5' } as any;

    component.onAdd(mockTeam);

    expect(mockStore.dispatch).not.toHaveBeenCalled();
  });

  it('should not dispatch if tournamentId is not set', () => {
    component.tournamentId = undefined as any;
    const mockTeam = { id: 5, title: 'Team 5' } as any;

    component.onAdd(mockTeam);

    expect(mockStore.dispatch).not.toHaveBeenCalled();
  });

  it('should handle empty tournament teams', () => {
    const allTeams = [
      { id: 1, title: 'Team 1' } as any,
      { id: 2, title: 'Team 2' } as any,
    ];
    component.allSportTeams$ = of(allTeams);
    component.teamsInTournament$ = of([]);

    let availableTeams: any[] = [];
    component.availableTeams$.subscribe((teams) => (availableTeams = teams));

    expect(availableTeams.length).toBe(2);
    expect(availableTeams.map((t: any) => t.id)).toContain(1);
    expect(availableTeams.map((t: any) => t.id)).toContain(2);
  });

  it('should handle all teams already in tournament', () => {
    const allTeams = [
      { id: 1, title: 'Team 1' } as any,
      { id: 2, title: 'Team 2' } as any,
    ];
    const tournamentTeams = [
      { id: 1, title: 'Team 1' } as any,
      { id: 2, title: 'Team 2' } as any,
    ];
    component.allSportTeams$ = of(allTeams);
    component.teamsInTournament$ = of(tournamentTeams);

    let availableTeams: any[] = [];
    component.availableTeams$.subscribe((teams) => (availableTeams = teams));

    expect(availableTeams.length).toBe(0);
  });
});
