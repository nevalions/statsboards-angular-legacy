import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { BacksStartComponent } from './backs-start.component';

describe('BacksStartComponent', () => {
  let component: BacksStartComponent;
  let fixture: ComponentFixture<BacksStartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BacksStartComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(BacksStartComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render without selected RB', () => {
    fixture.detectChanges();
    const element = fixture.nativeElement;
    expect(element).toBeTruthy();
  });

  it('should render with selected RB', () => {
    component.selectedRB = {
      rbOne: {
        match_player: { id: 1, is_start: true },
        person: { first_name: 'RB', second_name: 'One' },
      } as any,
    };
    fixture.detectChanges();
    const element = fixture.nativeElement;
    expect(element).toBeTruthy();
  });
});
