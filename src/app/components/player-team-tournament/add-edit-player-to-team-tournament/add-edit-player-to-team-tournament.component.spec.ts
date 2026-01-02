import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddEditPlayerToTeamTournamentComponent } from './add-edit-player-to-team-tournament.component';
import { PlayerInTeamTournament } from '../player-team-tournament';
import { ReactiveFormsModule } from '@angular/forms';
import { AsyncPipe } from '@angular/common';

describe('AddEditPlayerToTeamTournamentComponent', () => {
  let component: AddEditPlayerToTeamTournamentComponent;
  let fixture: ComponentFixture<AddEditPlayerToTeamTournamentComponent>;
  let mockPlayer: jasmine.SpyObj<PlayerInTeamTournament>;
  let mockDialogService: jasmine.SpyObj<any>;

  beforeEach(async () => {
    mockPlayer = jasmine.createSpyObj('PlayerInTeamTournament', [
      'createPlayerInTeamTournament',
      'updatePlayerInTeamTournament',
    ]);
    mockDialogService = jasmine.createSpyObj('DialogService', [
      'getDialogEvent',
    ]);

    await TestBed.configureTestingModule({
      imports: [
        AddEditPlayerToTeamTournamentComponent,
        ReactiveFormsModule,
        AsyncPipe,
      ],
      providers: [
        { provide: PlayerInTeamTournament, useValue: mockPlayer },
        { provide: 'DialogService', useValue: mockDialogService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AddEditPlayerToTeamTournamentComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize player form', () => {
    expect(component.playerForm).toBeDefined();
    expect(component.playerForm.get('id')).toBeDefined();
    expect(component.playerForm.get('playerInSport')).toBeDefined();
    expect(component.playerForm.get('position')).toBeDefined();
    expect(component.playerForm.get('number')).toBeDefined();
    expect(component.playerForm.get('team')).toBeDefined();
  });

  it('should have open property', () => {
    expect(component.open).toBeDefined();
    expect(component.open).toBeFalsy();
  });

  it('should toggle open property', () => {
    component.showDialog(false);
    expect(component.open).toBeFalsy();

    component.showDialog(true);
    expect(component.open).toBeTruthy();
  });

  it('should have action input', () => {
    expect(component.action).toBeDefined();
    component.action = 'add';
    expect(component.action).toBe('add');
  });

  it('should have dialogId input', () => {
    expect(component.dialogId).toBeDefined();
    expect(component.dialogId).toBe('addDialog');
  });

  it('should have tournamentId input', () => {
    expect(component.tournamentId).toBeDefined();
    component.tournamentId = 1;
    expect(component.tournamentId).toBe(1);
  });

  it('should have teamId input', () => {
    expect(component.teamId).toBeDefined();
    component.teamId = 1;
    expect(component.teamId).toBe(1);
  });

  it('should not submit if form is invalid', () => {
    component.playerForm.setValue({
      id: null,
      playerInSport: null,
      position: null,
      number: null,
      team: null,
    });

    component.onSubmit();
    expect(mockPlayer.createPlayerInTeamTournament).not.toHaveBeenCalled();
  });

  it('should call createPlayerInTeamTournament on add action', () => {
    component.action = 'add';
    component.tournamentId = 1;

    component.playerForm.setValue({
      id: null,
      playerInSport: {
        id: 1,
        person: { first_name: 'John', second_name: 'Doe' },
      } as any,
      position: null,
      number: '10',
      team: null,
    });

    component.onSubmit();
    expect(mockPlayer.createPlayerInTeamTournament).toHaveBeenCalled();
  });

  it('should call updatePlayerInTeamTournament on edit action', () => {
    component.action = 'edit';
    component.tournamentId = 1;

    component.playerForm.setValue({
      id: 1,
      playerInSport: {
        id: 1,
        person: { first_name: 'John', second_name: 'Doe' },
      } as any,
      position: null,
      number: '10',
      team: null,
    });

    component.onSubmit();
    expect(mockPlayer.updatePlayerInTeamTournament).toHaveBeenCalled();
  });

  it('should have addEvent and editEvent outputs', () => {
    expect(component.addEvent).toBeDefined();
    expect(component.editEvent).toBeDefined();
  });

  it('should have availablePlayers input', () => {
    expect(component.availablePlayers).toBeDefined();
    const players = [{ id: 1, player_number: '10' } as any];
    component.availablePlayers = players;
    expect(component.availablePlayers.length).toBe(1);
  });

  it('should have sportPositions input', () => {
    expect(component.sportPositions).toBeDefined();
    const positions = [{ id: 1, title: 'Forward' } as any];
    component.sportPositions = positions;
    expect(component.sportPositions.length).toBe(1);
  });

  it('should have tournamentTeams input', () => {
    expect(component.tournamentTeams).toBeDefined();
    const teams = [{ id: 1, title: 'Team A' } as any];
    component.tournamentTeams = teams;
    expect(component.tournamentTeams.length).toBe(1);
  });

  it('should have playerToEdit input', () => {
    expect(component.playerToEdit).toBeDefined();
    const player = {
      playerInSport: { id: 1 } as any,
      position: null,
      playerInTeamTournament: { id: 1, player_number: '10' } as any,
    } as any;
    component.playerToEdit = player;
    expect(component.playerToEdit).toBe(player);
  });
});
