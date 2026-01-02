import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { ItemPlayerComponent } from './item-player.component';
import { Player } from '../player';
import { Person } from '../../person/person';

describe('ItemPlayerComponent', () => {
  let component: ItemPlayerComponent;
  let fixture: ComponentFixture<ItemPlayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemPlayerComponent],
      providers: [
        {
          provide: Player,
          useValue: {
            loadAllPlayers: vi.fn(),
            loadAllPlayersBySportId: vi.fn(),
            loadCurrentPlayer: vi.fn(),
            deletePlayer: vi.fn(),
            allPlayers$: { subscribe: vi.fn() },
          },
        },
        {
          provide: Person,
          useValue: {
            loadAllPersons: vi.fn(),
            allPersons$: { subscribe: vi.fn() },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ItemPlayerComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
