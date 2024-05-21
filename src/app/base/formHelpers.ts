import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
} from '@angular/forms';

export function getFormControl(
  form: FormGroup,
  index: number,
  controlKey: string,
  arrayKey: string,
): FormControl {
  const formGroup = form.get(arrayKey) as FormArray;
  const actualControlKey = `${controlKey}${index}`;
  // console.log('attributes', form, index, controlKey, arrayKey);
  // console.log('forms', formGroup, actualControlKey);
  const control = formGroup.at(index).get(actualControlKey) as FormControl;

  // logFormArrayControls(formGroup);
  //
  // logFormGroupControls(formGroup, index);

  if (!control) {
    throw new Error(`Control ${actualControlKey} not found at index ${index}`);
  }

  // console.log('control', control);

  return control;
}

export function logFormArrayControls(formArray: FormArray): void {
  console.log('FormArray value:', formArray.value);

  formArray.controls.forEach((group: AbstractControl, index: number) => {
    console.log(`Group at index ${index}:`, group.value);

    if (group instanceof FormGroup) {
      Object.keys(group.controls).forEach((controlName) => {
        console.log(`Control - ${controlName}:`, group.get(controlName)?.value);
      });
    }
  });
}

export function logFormGroupControls(
  formArray: FormArray,
  index: number,
): void {
  // Ensure you're accessing a FormGroup at a given index in the FormArray
  const playerFormGroup = formArray.at(index);

  if (!playerFormGroup) {
    throw new Error(`FormGroup at index ${index} does not exist.`);
  }

  // Log the form group for an overview
  console.log(`FormGroup at index ${index}:`, playerFormGroup.value);

  // If the control is a FormGroup, log each FormControl within it
  if (playerFormGroup instanceof FormGroup) {
    Object.keys(playerFormGroup.controls).forEach((controlName) => {
      console.log(
        `Control - ${controlName}:`,
        playerFormGroup.get(controlName)?.value,
      );
    });
  }
}

export function getArrayFormDataByIndexAndKey<T>(
  array: FormArray,
  index: number,
  key: string,
): any {
  const playersArray = array as FormArray;
  const playerFormGroup = playersArray.at(index);
  if (playersArray && playerFormGroup) {
    return playerFormGroup.get(`${key}${index}`)?.value;
  } else {
    return null;
  }
}

export function getFormDataByIndexAndKey<T>(
  playerFormGroup: FormGroup | any,
  index: number,
  key: string,
): any {
  if (playerFormGroup) {
    return playerFormGroup.get(`${key}${index}`)?.value;
  } else {
    return null;
  }
}

export function getControlNameByIndexAndData(
  title: string,
  index: number,
  data: any,
): string {
  return `${title}-${index}-${data}`;
}

export function controlName(title: string, index: number): string {
  return `${title}${index}`;
}
