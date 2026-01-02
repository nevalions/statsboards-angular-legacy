import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { ListOfTeamsWithCityComponent } from './list-of-teams-with-city.component';
import { TeamService } from '../team.service';
import { ITeam } from '../../../type/team.type';

describe('ListOfTeamsWithCityComponent', () => {
  let component: ListOfTeamsWithCityComponent;
  let fixture: ComponentFixture<ListOfTeamsWithCityComponent>;
  let mockTeamService: any;

  beforeEach(async () => {
    mockTeamService = {
      teams$: of([]),
    };

    TestBed.configureTestingModule({
      imports: [ListOfTeamsWithCityComponent],
      providers: [{ provide: TeamService, useValue: mockTeamService }],
    }).compileComponents();

    fixture = TestBed.createComponent(ListOfTeamsWithCityComponent);
    component = fixture.componentInstance;
  });

  describe('creation', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });
  });

  describe('inputs', () => {
    it('should accept teams$ input', () => {
      expect(component.teams$).toBeDefined();
    });

    it('should accept teams input', () => {
      const mockTeams: ITeam[] = [{ id: 1, title: 'Team A', sport_id: 1 }];
      component.teams = mockTeams;
      expect(component.teams).toBe(mockTeams);
    });
  });

  describe('service integration', () => {
    it('should inject TeamService', () => {
      expect(mockTeamService).toBeDefined();
    });

    it('should have teams$ from TeamService', () => {
      expect(component.teams$).toBeDefined();
    });
  });

  describe('template rendering', () => {
    it('should render component', () => {
      fixture.detectChanges();
      expect(fixture.nativeElement).toBeTruthy();
    });
  });
});
