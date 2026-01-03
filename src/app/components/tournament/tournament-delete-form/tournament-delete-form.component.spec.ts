import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TournamentDeleteFormComponent } from './tournament-delete-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TuiError, TuiButton, TuiDialog } from '@taiga-ui/core';
import { TuiFieldErrorPipe, TuiFieldErrorContentPipe } from '@taiga-ui/kit';
import { TuiTextareaModule, TuiInputModule } from '@taiga-ui/legacy';
import { AsyncPipe } from '@angular/common';

describe('TournamentDeleteFormComponent', () => {
  let component: TournamentDeleteFormComponent;
  let fixture: ComponentFixture<TournamentDeleteFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TournamentDeleteFormComponent,
        AsyncPipe,
        ReactiveFormsModule,
        TuiError,
        TuiFieldErrorPipe,
        TuiFieldErrorContentPipe,
        TuiButton,
        TuiDialog,
        TuiInputModule,
        TuiTextareaModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TournamentDeleteFormComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form', () => {
    expect(component.tournamentDeleteForm).toBeDefined();
  });

  it('should have open property', () => {
    expect(component.open).toBeDefined();
    expect(component.open).toBeFalsy();
  });

  it('should open dialog when showDialog is called', () => {
    component.showDialog();
    expect(component.open).toBeTruthy();
  });

  it('should emit delete event on submit', () => {
    spyOn(component.delete, 'emit');
    component.onSubmit();
    expect(component.delete.emit).toHaveBeenCalled();
  });

  it('should reset form on submit', () => {
    component.onSubmit();
    expect(component.tournamentDeleteForm.pristine).toBeTruthy();
  });
});
