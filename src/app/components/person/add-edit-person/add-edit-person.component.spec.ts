import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { AddEditPersonComponent } from './add-edit-person.component';
import { Person } from '../person';

describe('AddEditPersonComponent', () => {
  let component: AddEditPersonComponent;
  let fixture: ComponentFixture<AddEditPersonComponent>;
  let mockPerson: any;

  beforeEach(async () => {
    mockPerson = {
      createPerson: vi.fn(),
      updatePerson: vi.fn(),
      currentPerson$: of(null),
    };

    TestBed.configureTestingModule({
      imports: [AddEditPersonComponent],
      providers: [{ provide: Person, useValue: mockPerson }],
    }).compileComponents();

    fixture = TestBed.createComponent(AddEditPersonComponent);
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
