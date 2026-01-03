import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { ItemPlayerComponent } from './item-player.component';
import { Player } from '../player';
import { Person } from '../../person/person';
import { ImageService } from '../../../services/image.service';

describe('ItemPlayerComponent', () => {
  let component: ItemPlayerComponent;
  let fixture: ComponentFixture<ItemPlayerComponent>;
  let mockPlayer: any;
  let mockPerson: any;
  let mockImageService: any;

  beforeEach(async () => {
    mockPlayer = {
      loadAllPlayers: vi.fn(),
      loadAllPlayersBySportId: vi.fn(),
      loadCurrentPlayer: vi.fn(),
      deletePlayer: vi.fn(),
      currentPlayerWithPerson$: of(null),
      availablePersonsForSport$: of([]),
      allPersons$: of([]),
      allSportPlayersWithPerson$: of([]),
    };

    mockPerson = {
      loadAllPersons: vi.fn(),
      availablePersonsForSport$: of([]),
      allPersons$: of([]),
    };

    mockImageService = {
      handleError: vi.fn(),
    };

    TestBed.configureTestingModule({
      imports: [ItemPlayerComponent],
      providers: [
        { provide: Player, useValue: mockPlayer },
        { provide: Person, useValue: mockPerson },
        { provide: ImageService, useValue: mockImageService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ItemPlayerComponent);
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

    it('should have correct button title', () => {
      expect(component.buttonTitle).toBe('Player');
    });
  });

  describe('display player details', () => {
    it('should load data in constructor', () => {
      expect(mockPlayer.loadAllPlayers).toHaveBeenCalled();
      expect(mockPlayer.loadAllPlayersBySportId).toHaveBeenCalled();
      expect(mockPerson.loadAllPersons).toHaveBeenCalled();
      expect(mockPlayer.loadCurrentPlayer).toHaveBeenCalled();
    });

    it('should have currentPlayerWithPerson$ observable', () => {
      expect(component.currentPlayerWithPerson$).toBeTruthy();
      expect(component.availablePersonsForSport$).toBeTruthy();
      expect(component.allPersons$).toBeTruthy();
      expect(component.allSportPlayersWithPerson$).toBeTruthy();
    });
  });

  describe('edit/delete buttons', () => {
    it('should call deletePlayer on delete', () => {
      component.onDelete();
      expect(mockPlayer.deletePlayer).toHaveBeenCalled();
    });
  });

  describe('photo display', () => {
    it('should call imageService.handleError on image error', () => {
      const mockEvent = { target: {} } as any;
      component.onImgError(mockEvent);
      expect(mockImageService.handleError).toHaveBeenCalledWith(mockEvent);
    });
  });
});
