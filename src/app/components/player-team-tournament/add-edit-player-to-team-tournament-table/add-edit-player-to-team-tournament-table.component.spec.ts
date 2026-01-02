import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddEditPlayerToTeamTournamentTableComponent } from './add-edit-player-to-team-tournament-table.component';
import { PlayerInTeamTournament } from '../player-team-tournament';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

describe('AddEditPlayerToTeamTournamentTableComponent', () => {
  let component: AddEditPlayerToTeamTournamentTableComponent;
  let fixture: ComponentFixture<AddEditPlayerToTeamTournamentTableComponent>;
  let mockPlayer: jasmine.SpyObj<PlayerInTeamTournament>;
  let mockDialogService: jasmine.SpyObj<any>;
  let mockImageService: jasmine.SpyObj<any>;

  beforeEach(async () => {
    mockPlayer = jasmine.createSpyObj('PlayerInTeamTournament', [
      'createPlayerInTeam',
      'updatePlayerInTeam',
      'addPlayerToTeam',
    ]);
    mockDialogService = jasmine.createSpyObj('DialogService', ['showDialog']);
    mockImageService = jasmine.createSpyObj('ImageService', ['handleError']);

    await TestBed.configureTestingModule({
      imports: [
        AddEditPlayerToTeamTournamentTableComponent,
        ReactiveFormsModule,
      ],
      providers: [
        { provide: PlayerInTeamTournament, useValue: mockPlayer },
        { provide: 'DialogService', useValue: mockDialogService },
        { provide: 'ImageService', useValue: mockImageService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(
      AddEditPlayerToTeamTournamentTableComponent,
    );
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize player form', () => {
    expect(component.playerForm).toBeDefined();
    expect(component.playerForm.get('players')).toBeDefined();
  });

  it('should have teamId input', () => {
    expect(component.teamId).toBeDefined();
    component.teamId = 1;
    expect(component.teamId).toBe(1);
  });

  it('should have tournamentId input', () => {
    expect(component.tournamentId).toBeDefined();
    component.tournamentId = 1;
    expect(component.tournamentId).toBe(1);
  });

  it('should have sportId input', () => {
    expect(component.sportId).toBeDefined();
    component.sportId = 1;
    expect(component.sportId).toBe(1);
  });

  it('should have players input', () => {
    expect(component.players).toBeDefined();
    const players = [
      {
        playerInSport: { id: 1 } as any,
        position: null,
        playerInTeamTournament: { id: 1, player_number: '10' } as any,
      } as any,
    ];
    component.players = players;
    expect(component.players.length).toBe(1);
  });

  it('should have availablePlayersInTournament input', () => {
    expect(component.availablePlayersInTournament).toBeDefined();
  });

  it('should have players input', () => {
    expect(component.players).toBeDefined();
  });

  it('should have positions input', () => {
    expect(component.positions).toBeDefined();
  });

  it('should have deleteOrUpdate property', () => {
    expect(component.deleteOrUpdate).toBeDefined();
    component.deleteOrUpdate = 'delete';
    expect(component.deleteOrUpdate).toBe('delete');
  });

  it('should have newPlayerCount', () => {
    expect(component.newPlayerCount).toBeDefined();
    expect(component.newPlayerCount).toBe(0);
  });

  it('should initialize expanded states object', () => {
    expect(component.expandedStates).toBeDefined();
    expect(component.expandedStates).toEqual({});
  });

  it('should toggle expansion state', () => {
    component.toggle('1');
    expect(component.expandedStates['1']).toBe(true);

    component.toggle('1');
    expect(component.expandedStates['1']).toBe(false);
  });

  it('should check expansion state', () => {
    component.expandedStates = { '1': true };
    expect(component.isExpanded('1')).toBe(true);

    component.expandedStates = { '1': false };
    expect(component.isExpanded('1')).toBe(false);
  });

  it('should check if row is enabled', () => {
    const fb = TestBed.inject(FormBuilder);
    component.playerForm = fb.group({
      players: fb.array([]),
    });
    expect(component.isRowEnabled(0)).toBe(false);
  });

  it('should enable row for edit', () => {
    const fb = TestBed.inject(FormBuilder);
    component.playerForm = fb.group({
      players: fb.array([]),
    });
    component.enableRowToEdit(0);
    const formArray = component.playerForm.get('players') as any;
    expect(formArray.at(0).disabled).toBeFalse();
  });

  it('should check data changed', () => {
    const fb = TestBed.inject(FormBuilder);
    component.playerForm = fb.group({
      players: fb.array([]),
    });
    const formArray = component.playerForm.get('players') as any;
    formArray.controls[0].markAsDirty();
    expect(component.isDataChanged(0)).toBe(true);
  });

  it('should handle onSubmit with add action', () => {
    const fb = TestBed.inject(FormBuilder);
    component.playerForm = fb.group({
      players: fb.array([]),
    });
    component.players = [
      {
        playerInSport: { id: 1 } as any,
        playerInTeamTournament: { id: 1, player_number: '10' } as any,
      } as any,
    ];
    component.deleteOrUpdate = 'add';

    const array = component.playerForm.get('players') as any;
    array.push(fb.group({}));

    component.onSubmit('add' as any, 0, null);
    expect(mockPlayer['addPlayerToTeam']).toHaveBeenCalled();
  });

  it('should handle onSubmit with update action', () => {
    const fb = TestBed.inject(FormBuilder);
    component.playerForm = fb.group({
      players: fb.array([]),
    });
    component.deleteOrUpdate = 'update';

    const array = component.playerForm.get('players') as any;
    const group = fb.group({ id: 1 });
    array.push(group);

    component.onSubmit('update' as any, 0, null);
    expect(mockPlayer['updatePlayerInTeam']).toHaveBeenCalled();
  });

  it('should handle onSubmit with deleteFromTeam action', () => {
    const fb = TestBed.inject(FormBuilder);
    component.playerForm = fb.group({
      players: fb.array([]),
    });
    component.deleteOrUpdate = 'deleteFromTeam';
    component.tournamentId = 1;

    const array = component.playerForm.get('players') as any;
    const group = fb.group({
      playerInTeamId: 1,
      player_id: 1,
    });
    array.push(group);

    component.onSubmit('deleteFromTeam' as any, 0, 1);
    expect(mockPlayer['deletePlayerFromTeam']).toHaveBeenCalledWith(1);
  });

  it('should handle addNewPlayer', () => {
    const fb = TestBed.inject(FormBuilder);
    component.playerForm = fb.group({
      players: fb.array([]),
    });
    component.players = [
      {
        playerInSport: null,
        playerInTeamTournament: { id: null },
      } as any,
    ];

    component.addNewPlayer();
    expect(component.players.length).toBe(2);
    expect(component.newPlayerCount).toBe(1);
  });

  it('should have onImgError method', () => {
    expect(component['onImgError']).toBeDefined();
    const mockEvent = new Event('error');
    component['onImgError'](mockEvent);
    expect(mockImageService.handleError).toHaveBeenCalledWith(mockEvent);
  });

  it('should handle onCancelButtonClick', () => {
    const fb = TestBed.inject(FormBuilder);
    component.playerForm = fb.group({
      players: fb.array([]),
    });
    component.players = [
      {
        playerInSport: null,
        playerInTeamTournament: { id: null },
      } as any,
    ];

    component.onCancelButtonClick();
    expect(component.players.length).toBe(0);
  });
});
