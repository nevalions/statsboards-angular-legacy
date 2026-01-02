import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SportDropdownComponent } from './sport-dropdown.component';
import { SportComponent } from '../sport.component';

describe('SportDropdownComponent', () => {
  let component: SportDropdownComponent;
  let fixture: ComponentFixture<SportDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SportDropdownComponent],
      providers: [{ provide: 'sport', useValue: {} }],
    }).compileComponents();

    fixture = TestBed.createComponent(SportDropdownComponent);
    component = fixture.componentInstance;
  });

  describe('creation', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should extend SportComponent', () => {
      expect(component).toBeInstanceOf(SportComponent);
    });

    it('should have arrow property', () => {
      expect(component.arrow).toBeDefined();
    });
  });

  describe('template rendering', () => {
    it('should render dropdownmenu component', () => {
      fixture.detectChanges();
      const dropdownElement =
        fixture.nativeElement.querySelector('app-dropdownmenu');
      expect(dropdownElement).toBeTruthy();
    });
  });
});
