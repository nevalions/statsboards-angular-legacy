import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListOfPlayersComponent } from './list-of-players.component';

describe('ListOfPlayersComponent', () => {
  let component: ListOfPlayersComponent;
  let fixture: ComponentFixture<ListOfPlayersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListOfPlayersComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ListOfPlayersComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
