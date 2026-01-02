import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { ItemPersonComponent } from './item-person.component';
import { Person } from '../person';

describe('ItemPersonComponent', () => {
  let component: ItemPersonComponent;
  let fixture: ComponentFixture<ItemPersonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemPersonComponent],
      providers: [
        {
          provide: Person,
          useValue: {
            loadCurrentPerson: vi.fn(),
            deletePerson: vi.fn(),
            currentPerson$: { subscribe: vi.fn() },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ItemPersonComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
