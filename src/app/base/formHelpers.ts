import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
} from '@angular/forms';

export function getFormControlWithIndex(
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

export function logFormGroupControlsWithIndex(
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
  const formArray = array as FormArray;
  const playerFormGroup = formArray.at(index);
  if (formArray && playerFormGroup) {
    return playerFormGroup.get(`${key}${index}`)?.value;
  } else {
    return null;
  }
}

export function getFormControl<T>(
  formGroup: FormGroup,
  key: string,
): FormControl | null {
  if (formGroup && key) {
    const control = formGroup.get(key);
    if (control instanceof FormControl) {
      return control as FormControl;
    }
  }
  return null;
}

export function getFormDataByKey<T>(
  playerFormGroup: FormGroup | any,
  key: string,
): any {
  if (playerFormGroup) {
    return playerFormGroup.get(key)?.value;
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

export function setArrayValueWithKeyIndex<T>(
  array: FormArray,
  index: number,
  selectedItem: T | null,
  key: string,
): void {
  array.controls[index].get(key)?.setValue(selectedItem);
}

export function setArrayKeyIndexValue<T>(
  array: FormArray,
  index: number,
  selectedItem: T | null,
  key: string,
): void {
  array.controls[index].get(key + index)?.setValue(selectedItem);
}

export function patchFormGroupKeyValue<T>(
  formGroup: FormGroup,
  selectedItem: T | null,
  key: string,
): void {
  const control = getFormControl(formGroup, key);
  if (control) {
    control.patchValue(selectedItem);
  } else {
    console.error(`Control with key '${key}' not found in FormGroup`);
  }
}

export function resetArrayKeyIndexValue(
  array: FormArray,
  index: number,
  key: string,
): void {
  array.controls[index].get(key + index)?.setValue(null);
}

export function enableFullRowToEdit(array: FormArray, index: number): void {
  const formArray = (array as FormArray).at(index);
  if (formArray && formArray.disabled) {
    formArray.enable();
  } else if (formArray && formArray.enabled) {
    formArray.disable();
  } else {
    console.log('FormGroup is null');
  }
}

export function isFullRowEnabled(array: FormArray, index: number): boolean {
  const formArray = (array as FormArray).at(index);
  if (formArray && formArray.disabled) {
    // console.log('formGroup is disabled');
    return false;
  } else if (formArray && formArray.enabled) {
    // console.log('formGroup is enabled');
    return true;
  } else {
    console.log('array is null');
    return false;
  }
}

export function isDataChanged(array: FormArray, index: number): boolean {
  const formArray = (array as FormArray).at(index);
  return formArray ? formArray.dirty : false;
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
