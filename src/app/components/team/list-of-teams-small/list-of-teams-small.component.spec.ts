import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { ListOfTeamsSmallComponent } from './list-of-teams-small.component';
import { TeamService } from '../team.service';
import { ITeam } from '../../../type/team.type';

describe('ListOfTeamsSmallComponent', () => {
  let component: ListOfTeamsSmallComponent;
  let fixture: ComponentFixture<ListOfTeamsSmallComponent>;
  let mockTeamService: any;

  beforeEach(async () => {
    mockTeamService = {
      teams$: of([]),
    };

    TestBed.configureTestingModule({
      imports: [ListOfTeamsSmallComponent],
      providers: [{ provide: TeamService, useValue: mockTeamService }],
    }).compileComponents();

    fixture = TestBed.createComponent(ListOfTeamsSmallComponent);
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

    it('should accept formatPath input', () => {
      component.formatPath = (item: ITeam) => 'teams';
      expect(component.formatPath).toBeDefined();
    });

    it('should accept titleProperty input', () => {
      component.titleProperty = 'title';
      expect(component.titleProperty).toBe('title');
    });

    it('should accept _size input', () => {
      component._size = 's';
      expect(component._size).toBe('s');
    });

    it('should accept hoverable input', () => {
      component.hoverable = true;
      expect(component.hoverable).toBe(true);
    });
  });

  describe('formatPath method', () => {
    it('should return correct path', () => {
      component.formatPath = (item: ITeam) => 'teams';
      const mockTeam = { id: 1, title: 'Team A', sport_id: 1 } as ITeam;
      const path = (component as any).formatPath(mockTeam);
      expect(path).toBe('teams');
    });
  });

  describe('template rendering', () => {
    it('should render component', () => {
      fixture.detectChanges();
      expect(fixture.nativeElement).toBeTruthy();
    });
  });
});
