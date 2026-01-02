import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ItemPositionComponent } from './item-position.component';

describe('ItemPositionComponent', () => {
  let component: ItemPositionComponent;
  let fixture: ComponentFixture<ItemPositionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemPositionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ItemPositionComponent);
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
