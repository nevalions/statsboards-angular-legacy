import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { MatchScoreboardAdminComponent } from './match-scoreboard-admin.component';

describe('MatchScoreboardAdminComponent', () => {
  let component: MatchScoreboardAdminComponent;
  let fixture: ComponentFixture<MatchScoreboardAdminComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [MatchScoreboardAdminComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MatchScoreboardAdminComponent);
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
