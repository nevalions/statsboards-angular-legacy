import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { AddEditTeamComponent } from './add-edit-team.component';
import { Team } from '../team';

describe('AddEditTeamComponent', () => {
  let component: AddEditTeamComponent;
  let fixture: ComponentFixture<AddEditTeamComponent>;
  let mockTeam: any;

  beforeEach(async () => {
    mockTeam = {
      createTeam: vi.fn(),
      updateTeam: vi.fn(),
      team$: of(null),
    };

    TestBed.configureTestingModule({
      imports: [AddEditTeamComponent],
      providers: [{ provide: Team, useValue: mockTeam }],
    }).compileComponents();

    fixture = TestBed.createComponent(AddEditTeamComponent);
    component = fixture.componentInstance;
  });

  describe('creation', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });
  });

  describe('template rendering', () => {
    it('should render component', () => {
      fixture.detectChanges();
      expect(fixture.nativeElement).toBeTruthy();
    });
  });
});
