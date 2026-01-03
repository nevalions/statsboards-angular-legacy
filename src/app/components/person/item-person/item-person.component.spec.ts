import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { ItemPersonComponent } from './item-person.component';
import { Person } from '../person';
import { ImageService } from '../../../services/image.service';

describe('ItemPersonComponent', () => {
  let component: ItemPersonComponent;
  let fixture: ComponentFixture<ItemPersonComponent>;
  let mockPerson: any;
  let mockImageService: any;

  beforeEach(async () => {
    mockPerson = {
      loadCurrentPerson: vi.fn(),
      deletePerson: vi.fn(),
      currentPerson$: { subscribe: vi.fn() },
    };

    mockImageService = {
      handleError: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [ItemPersonComponent],
      providers: [
        { provide: Person, useValue: mockPerson },
        { provide: ImageService, useValue: mockImageService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ItemPersonComponent);
    component = fixture.componentInstance;
  });

  describe('creation', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should have buttonTitle', () => {
      expect(component.buttonTitle).toBe('Person');
    });

    it('should have currentPerson$ observable', () => {
      expect(component.currentPerson$).toBeDefined();
    });

    it('should have url constant', () => {
      expect((component as any).url).toBeDefined();
    });
  });

  describe('initialization', () => {
    it('should call loadCurrentPerson on init', () => {
      expect(mockPerson.loadCurrentPerson).toHaveBeenCalled();
    });
  });

  describe('methods', () => {
    it('should call imageService.handleError on image error', () => {
      const mockEvent = new Event('error');
      component.onImgError(mockEvent);

      expect(mockImageService.handleError).toHaveBeenCalledWith(mockEvent);
    });

    it('should call deletePerson when onDelete is called', () => {
      component.onDelete();

      expect(mockPerson.deletePerson).toHaveBeenCalled();
    });
  });

  describe('observable integration', () => {
    it('should subscribe to currentPerson$', () => {
      expect(mockPerson.currentPerson$.subscribe).toHaveBeenCalled();
    });
  });

  describe('template rendering', () => {
    it('should render component', () => {
      fixture.detectChanges();
      expect(fixture.nativeElement).toBeTruthy();
    });
  });
});
