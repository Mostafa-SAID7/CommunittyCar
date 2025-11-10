import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function emailValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const valid = emailRegex.test(control.value);
    return valid ? null : { invalidEmail: true };
  };
}

export function passwordStrengthValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) return null;

    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumeric = /[0-9]/.test(value);
    const hasSpecial = /[#?!@$%^&*-]/.test(value);
    const isLengthValid = value.length >= 8;

    const passwordValid = hasUpperCase && hasLowerCase && hasNumeric && hasSpecial && isLengthValid;
    return !passwordValid ? {
      passwordStrength: {
        hasUpperCase,
        hasLowerCase,
        hasNumeric,
        hasSpecial,
        isLengthValid
      }
    } : null;
  };
}

export function phoneNumberValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
    const valid = phoneRegex.test(control.value);
    return valid ? null : { invalidPhoneNumber: true };
  };
}

export function dateRangeValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const startDate = control.get('startDate')?.value;
    const endDate = control.get('endDate')?.value;

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (start >= end) {
        return { invalidDateRange: true };
      }
    }
    return null;
  };
}

export function minAgeValidator(minAge: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const birthDate = new Date(control.value);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      return age - 1 < minAge ? { minAge: { requiredAge: minAge, actualAge: age - 1 } } : null;
    }
    return age < minAge ? { minAge: { requiredAge: minAge, actualAge: age } } : null;
  };
}

export function licensePlateValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    // Basic license plate validation (can be customized per country)
    const plateRegex = /^[A-Z0-9\s\-]{1,10}$/;
    const valid = plateRegex.test(control.value?.toUpperCase());
    return valid ? null : { invalidLicensePlate: true };
  };
}

export function urlValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    try {
      new URL(control.value);
      return null;
    } catch {
      return { invalidUrl: true };
    }
  };
}