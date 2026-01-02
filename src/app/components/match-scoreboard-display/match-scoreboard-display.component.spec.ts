import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { MatchScoreboardDisplayComponent } from './match-scoreboard-display.component';

describe('MatchScoreboardDisplayComponent', () => {
  let component: MatchScoreboardDisplayComponent;
  let fixture: ComponentFixture<MatchScoreboardDisplayComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [MatchScoreboardDisplayComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MatchScoreboardDisplayComponent);
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
