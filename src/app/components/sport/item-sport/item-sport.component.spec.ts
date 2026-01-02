import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ItemSportComponent } from './item-sport.component';

describe('ItemSportComponent', () => {
  let component: ItemSportComponent;
  let fixture: ComponentFixture<ItemSportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemSportComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ItemSportComponent);
    component = fixture.componentInstance;
  });

  describe('creation', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });
  });

  describe('template rendering', () => {
    it('should render router outlet', () => {
      fixture.detectChanges();
      const routerOutlet = fixture.nativeElement.querySelector('router-outlet');
      expect(routerOutlet).toBeTruthy();
    });
  });
});
