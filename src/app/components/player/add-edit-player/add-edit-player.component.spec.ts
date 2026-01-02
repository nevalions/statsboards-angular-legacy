import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { AddEditPlayerComponent } from './add-edit-player.component';
import { Player } from '../player';

describe('AddEditPlayerComponent', () => {
  let component: AddEditPlayerComponent;
  let fixture: ComponentFixture<AddEditPlayerComponent>;
  let mockPlayer: any;

  beforeEach(async () => {
    mockPlayer = {
      createPlayer: vi.fn(),
      updatePlayer: vi.fn(),
      currentPlayer$: of(null),
    };

    TestBed.configureTestingModule({
      imports: [AddEditPlayerComponent],
      providers: [{ provide: Player, useValue: mockPlayer }],
    }).compileComponents();

    fixture = TestBed.createComponent(AddEditPlayerComponent);
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
