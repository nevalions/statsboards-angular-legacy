import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { AddEditPlayerToTeamTournamentTableComponent } from './add-edit-player-to-team-tournament-table.component';

describe('AddEditPlayerToTeamTournamentTableComponent', () => {
  let component: AddEditPlayerToTeamTournamentTableComponent;
  let fixture: ComponentFixture<AddEditPlayerToTeamTournamentTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AddEditPlayerToTeamTournamentTableComponent,
        ReactiveFormsModule,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(
      AddEditPlayerToTeamTournamentTableComponent,
    );
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render without players', () => {
    component.players = [];
    fixture.detectChanges();
    const element = fixture.nativeElement;
    expect(element).toBeTruthy();
  });

  it('should render with players', () => {
    component.players = [
      { playerInTeamTournament: { id: 1 } } as any,
      { playerInTeamTournament: { id: 2 } } as any,
    ];
    component.tournamentId = 1;
    fixture.detectChanges();
    const element = fixture.nativeElement;
    expect(element).toBeTruthy();
  });
});
