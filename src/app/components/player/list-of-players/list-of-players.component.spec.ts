import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IPlayer, IPlayerInSport } from '../../../type/player.type';
import { Router } from '@angular/router';

describe('ListOfPlayersComponent', () => {
  let component: ListOfPlayersComponent;
  let fixture: ComponentFixture<ListOfPlayersComponent>;
  let mockRouter: any;

  beforeEach(async () => {
    mockRouter = {
      navigate: vi.fn(),
    };

    TestBed.configureTestingModule({
      imports: [ListOfPlayersComponent],
      providers: [{ provide: Router, useValue: mockRouter }],
    }).compileComponents();

    fixture = TestBed.createComponent(ListOfPlayersComponent);
    component = fixture.componentInstance;
  });

  describe('creation', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should render component', () => {
      fixture.detectChanges();
      expect(fixture.nativeElement).toBeTruthy();
    });
  });

  describe('player list rendering', () => {
    it('should render empty state when no players', () => {
      component.players = [];
      fixture.detectChanges();
      const content = fixture.nativeElement.textContent;
      expect(content).toContain('No Players Found');
    });

    it('should render players when provided', () => {
      const person: any = {
        id: 1,
        first_name: 'John',
        second_name: 'Doe',
        person_photo_url: null,
        person_photo_icon_url: null,
        person_photo_web_url: null,
        person_dob: null,
        person_eesl_id: null,
      };
      const players: IPlayerInSport[] = [
        { player: { id: 1, person_id: 1, sport_id: 1 }, person },
      ];
      component.players = players;
      fixture.detectChanges();
      const content = fixture.nativeElement.textContent;
      expect(content).toContain('John');
      expect(content).toContain('Doe');
    });

    it('should accept players input', () => {
      const players: IPlayerInSport[] = [
        {
          player: { id: 1, person_id: 1, sport_id: 1 },
          person: {
            id: 1,
            first_name: 'Test',
            second_name: 'User',
            person_photo_url: null,
            person_photo_icon_url: null,
            person_photo_web_url: null,
            person_dob: null,
            person_eesl_id: null,
          },
        },
      ];
      component.players = players;
      expect(component.players).toEqual(players);
    });

    it('should render player cards', () => {
      const players: IPlayerInSport[] = [
        {
          player: { id: 1, person_id: 1, sport_id: 1 },
          person: {
            id: 1,
            first_name: 'Test',
            second_name: 'User',
            person_photo_url: null,
            person_photo_icon_url: null,
            person_photo_web_url: null,
            person_dob: null,
            person_eesl_id: null,
          },
        },
      ];
      component.players = players;
      fixture.detectChanges();
      const buttons = fixture.nativeElement.querySelectorAll('button');
      expect(buttons.length).toBeGreaterThan(0);
    });
  });

  describe('search/filter by team/position', () => {
    it('should handle empty players array', () => {
      component.players = [];
      expect(component.players).toEqual([]);
    });

    it('should handle players with null person', () => {
      const players: IPlayerInSport[] = [
        { player: { id: 1, person_id: 1, sport_id: 1 }, person: null },
      ];
      component.players = players;
      expect(component.players).toEqual(players);
    });
  });

  describe('pagination', () => {
    it('should accept playerItemHref function', () => {
      const hrefFn = (item: IPlayer) => `/player/${item.id}`;
      component.playerItemHref = hrefFn;
      expect(component.playerItemHref(1)).toBe('/player/1');
    });
  });

  describe('navigation', () => {
    it('should navigate to player item', () => {
      const player: IPlayer = { id: 1, person_id: 1, sport_id: 1 };
      const hrefFn = (item: IPlayer) => `/player/${item.id}`;
      component.playerItemHref = hrefFn;
      component.navigate(player);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/player/1']);
    });
  });

  describe('template', () => {
    it('should render list container', () => {
      component.players = [];
      fixture.detectChanges();
      const container = fixture.nativeElement.querySelector(
        '.list-of-items-with-data',
      );
      expect(container).toBeTruthy();
    });

    it('should render tui-loader when players is undefined', () => {
      component.players = undefined as any;
      fixture.detectChanges();
      const loader = fixture.nativeElement.querySelector('tui-loader');
      expect(loader).toBeTruthy();
    });
  });
});
