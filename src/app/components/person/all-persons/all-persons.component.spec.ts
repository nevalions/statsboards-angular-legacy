import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { AllPersonsComponent } from './all-persons.component';
import { Person } from '../person';
import { Search } from '../../../store/search/search';
import { Pagination } from '../../../store/pagination/pagination';

describe('AllPersonsComponent', () => {
  let component: AllPersonsComponent;
  let fixture: ComponentFixture<AllPersonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllPersonsComponent],
      providers: [
        {
          provide: Person,
          useValue: {
            loadAllPersons: vi.fn(),
            allPersons$: { subscribe: vi.fn() },
          },
        },
        {
          provide: Search,
          useValue: {
            searchPerson: vi.fn(),
          },
        },
        {
          provide: Pagination,
          useValue: {
            resetCurrentPage: vi.fn(),
            paginatedPersonSearchResults$: { subscribe: vi.fn() },
            totalPersonSearchPages$: { subscribe: vi.fn() },
            currentPage$: { subscribe: vi.fn() },
            changePage: vi.fn(),
            changeItemsPerPage: vi.fn(),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AllPersonsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
