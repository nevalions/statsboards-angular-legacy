import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleFootballQbStatsComponent } from './simple-football-qb-stats.component';

describe('SimpleFootballQbStatsComponent', () => {
  let component: SimpleFootballQbStatsComponent;
  let fixture: ComponentFixture<SimpleFootballQbStatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SimpleFootballQbStatsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SimpleFootballQbStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
