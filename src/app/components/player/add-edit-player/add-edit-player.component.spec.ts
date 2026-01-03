import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { AddEditPlayerComponent } from './add-edit-player.component';
import { Player } from '../player';

describe('AddEditPlayerComponent', () => {
  let component: AddEditPlayerComponent;
  let fixture: ComponentFixture<AddEditPlayerComponent>;
  let mockPlayer: any;

  beforeEach(async () => {
    mockPlayer = {
      createPlayer: vi.fn(),
      updatePlayer: vi.fn(),
      currentPlayer$: of(null),
    };

    TestBed.configureTestingModule({
      imports: [AddEditPlayerComponent],
      providers: [{ provide: Player, useValue: mockPlayer }],
    }).compileComponents();

    fixture = TestBed.createComponent(AddEditPlayerComponent);
    component = fixture.componentInstance;
  });

  describe('creation', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should render component', () => {
      fixture.detectChanges();
      expect(fixture.nativeElement).toBeTruthy();
    });
  });

  describe('form validation', () => {
    it('should have person control with required validator', () => {
      const control = component.playerForm.get('person');
      expect(control.validator).toBeTruthy();
    });

    it('should be invalid when person is empty', () => {
      component.playerForm.controls['person'].setValue(null);
      expect(component.playerForm.controls['person'].valid).toBeFalsy();
    });

    it('should be valid when person is set', () => {
      const person = {
        id: 1,
        first_name: 'John',
        second_name: 'Doe',
        person_photo_url: null,
        person_photo_icon_url: null,
        person_photo_web_url: null,
        person_dob: null,
        person_eesl_id: null,
      };
      component.playerForm.controls['person'].setValue(person);
      expect(component.playerForm.controls['person'].valid).toBeTruthy();
    });
  });

  describe('player creation', () => {
    it('should call createPlayer when action is add', () => {
      component.action = 'add';
      component.sportId = 1;
      component.playerForm.setValue({
        id: undefined,
        person: {
          id: 1,
          first_name: 'John',
          second_name: 'Doe',
          person_photo_url: null,
          person_photo_icon_url: null,
          person_photo_web_url: null,
          person_dob: null,
          person_eesl_id: null,
        },
        playerEeslId: undefined,
      });

      component.onSubmit();

      expect(mockPlayer.createPlayer).toHaveBeenCalledWith({
        id: undefined,
        person_id: 1,
        player_eesl_id: undefined,
        sport_id: 1,
      });
    });
  });

  describe('player editing', () => {
    it('should call updatePlayer when action is edit', () => {
      component.action = 'edit';
      component.sportId = 1;
      component.playerForm.setValue({
        id: 1,
        person: {
          id: 1,
          first_name: 'John',
          second_name: 'Doe',
          person_photo_url: null,
          person_photo_icon_url: null,
          person_photo_web_url: null,
          person_dob: null,
          person_eesl_id: null,
        },
        playerEeslId: 123,
      });

      component.onSubmit();

      expect(mockPlayer.updatePlayer).toHaveBeenCalledWith(1, {
        id: 1,
        person_id: 1,
        player_eesl_id: 123,
        sport_id: 1,
      });
    });
  });

  describe('team/position selection', () => {
    it('should accept allAvailablePersons input', () => {
      const persons = [
        {
          id: 1,
          first_name: 'John',
          second_name: 'Doe',
          person_photo_url: null,
          person_photo_icon_url: null,
          person_photo_web_url: null,
          person_dob: null,
          person_eesl_id: null,
        },
      ];
      component.allAvailablePersons = persons;
      expect(component.allAvailablePersons).toEqual(persons);
    });

    it('should accept sportId input', () => {
      component.sportId = 1;
      expect(component.sportId).toBe(1);
    });
  });

  describe('dialog handling', () => {
    it('should open dialog', () => {
      expect(component.open).toBeFalsy();
      component.showDialog(true);
      expect(component.open).toBeTruthy();
    });

    it('should close dialog', () => {
      component.open = true;
      component.showDialog(false);
      expect(component.open).toBeFalsy();
    });
  });

  describe('ngOnChanges', () => {
    it('should update form when playerWithPersonToUpdate changes in edit mode', () => {
      const person = {
        id: 1,
        first_name: 'John',
        second_name: 'Doe',
        person_photo_url: null,
        person_photo_icon_url: null,
        person_photo_web_url: null,
        person_dob: null,
        person_eesl_id: null,
      };
      const playerData: any = {
        player: { id: 1, person_id: 1, player_eesl_id: 123 },
        person,
      };

      component.action = 'edit';
      component.sportId = 1;
      component.playerWithPersonToUpdate = playerData;

      component.ngOnChanges({
        playerWithPersonToUpdate: {
          previousValue: undefined,
          firstChange: true,
        },
      });

      expect(component.playerForm.value).toEqual({
        id: 1,
        person: {
          id: 1,
          first_name: 'John',
          second_name: 'Doe',
          person_photo_url: null,
          person_photo_icon_url: null,
          person_photo_web_url: null,
          person_dob: null,
          person_eesl_id: null,
        },
        playerEeslId: 123,
      });
    });
  });
});
