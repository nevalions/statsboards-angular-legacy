import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { AddEditTeamToTournamentTableComponent } from './add-edit-team-to-tournament-table.component';

describe('AddEditTeamToTournamentTableComponent', () => {
  let component: AddEditTeamToTournamentTableComponent;
  let fixture: ComponentFixture<AddEditTeamToTournamentTableComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [AddEditTeamToTournamentTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AddEditTeamToTournamentTableComponent);
    component = fixture.componentInstance;
  });

  describe('creation', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });
  });

  describe('inputs', () => {
    it('should accept sportId input', () => {
      component.sportId = 1;
      expect(component.sportId).toBe(1);
    });

    it('should accept teams input', () => {
      const mockTeams = [{ id: 1, title: 'Team A' }];
      component.teams = mockTeams;
      expect(component.teams).toBe(mockTeams);
    });
  });

  describe('template rendering', () => {
    it('should render component', () => {
      fixture.detectChanges();
      expect(fixture.nativeElement).toBeTruthy();
    });
  });
});
