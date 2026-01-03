import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { AllPersonsComponent } from './all-persons.component';
import { Person } from '../person';
import { Search } from '../../../store/search/search';
import { Pagination } from '../../../store/pagination/pagination';
import { IPerson } from '../../../type/person.type';

describe('AllPersonsComponent', () => {
  let component: AllPersonsComponent;
  let fixture: ComponentFixture<AllPersonsComponent>;
  let mockPerson: any;
  let mockSearch: any;
  let mockPagination: any;

  beforeEach(async () => {
    mockPerson = {
      loadAllPersons: vi.fn(),
      allPersons$: of([]),
    };

    mockSearch = {
      searchPerson: vi.fn(),
    };

    mockPagination = {
      resetCurrentPage: vi.fn(),
      paginatedPersonSearchResults$: of([]),
      totalPersonSearchPages$: of(1),
      currentPage$: of(1),
      changePage: vi.fn(),
      changeItemsPerPage: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [AllPersonsComponent],
      providers: [
        { provide: Person, useValue: mockPerson },
        { provide: Search, useValue: mockSearch },
        { provide: Pagination, useValue: mockPagination },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AllPersonsComponent);
    component = fixture.componentInstance;
  });

  describe('creation', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should have paginatedPersonSearchResults$ observable', () => {
      expect(component.paginatedPersonSearchResults$).toBeDefined();
    });

    it('should have totalPersonSearchPages$ observable', () => {
      expect(component.totalPersonSearchPages$).toBeDefined();
    });

    it('should have currentPage$ observable', () => {
      expect(component.currentPage$).toBeDefined();
    });

    it('should have first_name key', () => {
      expect(component.first_name).toBe('first_name');
    });

    it('should have second_name key', () => {
      expect(component.second_name).toBe('second_name');
    });

    it('should have avatarIconUrl key', () => {
      expect(component.avatarIconUrl).toBe('person_photo_icon_url');
    });
  });

  describe('initialization', () => {
    it('should call loadAllPersons on init', () => {
      expect(mockPerson.loadAllPersons).toHaveBeenCalled();
    });

    it('should call searchPerson on init', () => {
      expect(mockSearch.searchPerson).toHaveBeenCalledWith(null);
    });

    it('should call resetCurrentPage on init', () => {
      expect(mockPagination.resetCurrentPage).toHaveBeenCalled();
    });
  });

  describe('personItemHref', () => {
    it('should return correct person URL', () => {
      const mockItem = { id: 123 } as any;
      const url = component.personItemHref(mockItem);
      expect(url).toBe('person/123');
    });
  });

  describe('onSearch', () => {
    it('should call searchPerson with search term', () => {
      component.onSearch('John');

      expect(mockSearch.searchPerson).toHaveBeenCalledWith('John');
    });

    it('should call resetCurrentPage when searching', () => {
      component.onSearch('Doe');

      expect(mockPagination.resetCurrentPage).toHaveBeenCalled();
    });

    it('should call searchPerson with null', () => {
      component.onSearch(null);

      expect(mockSearch.searchPerson).toHaveBeenCalledWith(null);
    });
  });

  describe('setCurrentPage', () => {
    it('should call changePage with page number', () => {
      component.setCurrentPage(2);

      expect(mockPagination.changePage).toHaveBeenCalledWith(2);
    });
  });

  describe('changePageSize', () => {
    it('should call changeItemsPerPage with size', () => {
      component.changePageSize(10);

      expect(mockPagination.changeItemsPerPage).toHaveBeenCalledWith(10);
    });

    it('should call changeItemsPerPage with All', () => {
      component.changePageSize('All');

      expect(mockPagination.changeItemsPerPage).toHaveBeenCalledWith('All');
    });
  });

  describe('observable integration', () => {
    it('should have paginatedPersonSearchResults$ from pagination', () => {
      expect(component.paginatedPersonSearchResults$).toBe(
        mockPagination.paginatedPersonSearchResults$,
      );
    });

    it('should have totalPersonSearchPages$ from pagination', () => {
      expect(component.totalPersonSearchPages$).toBe(
        mockPagination.totalPersonSearchPages$,
      );
    });

    it('should have currentPage$ from pagination', () => {
      expect(component.currentPage$).toBe(mockPagination.currentPage$);
    });
  });

  describe('template rendering', () => {
    it('should render component', () => {
      fixture.detectChanges();
      expect(fixture.nativeElement).toBeTruthy();
    });
  });
});
