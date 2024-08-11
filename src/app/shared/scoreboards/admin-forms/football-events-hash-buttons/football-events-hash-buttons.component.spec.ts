import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FootballEventsHashButtonsComponent } from './football-events-hash-buttons.component';

describe('FootballEventsHashButtonsComponent', () => {
  let component: FootballEventsHashButtonsComponent;
  let fixture: ComponentFixture<FootballEventsHashButtonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FootballEventsHashButtonsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FootballEventsHashButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
