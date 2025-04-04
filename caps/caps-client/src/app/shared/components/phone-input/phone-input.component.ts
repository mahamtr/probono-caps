import { Component, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-phone-input',
  templateUrl: './phone-input.component.html',
  styleUrls: ['./phone-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PhoneInputComponent),
      multi: true,
    },
  ],
})
export class PhoneInputComponent implements ControlValueAccessor {
  private rawValue: string = '';
  formattedValue: string = '';
  onChange = (_: string) => {};
  onTouched = () => {};

  writeValue(value: string | null): void {
    if (value !== null && value !== undefined) {
      this.rawValue = value;
      this.formattedValue = this.formatPhoneNumber(this.rawValue);
    } else {
      this.rawValue = '';
      this.formattedValue = '';
    }
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  onInputChange(event: any): void {
    const inputValue = event.target.value;

    const numericValue = inputValue.replace(/[^0-9]/g, '');
    this.rawValue = numericValue.slice(0, 8); // Limit to 8 characters

    this.formattedValue = this.formatPhoneNumber(this.rawValue);

    event.target.value = this.formattedValue;

    if (this.rawValue.length !== 8) {
      this.onChange(''); // Set invalid value
    } else {
      this.onChange(this.rawValue); // Set valid value
    }
  }

  formatPhoneNumber(value: string): string {
    if (value.length <= 4) {
      return value;
    } else {
      return `${value.slice(0, 4)}-${value.slice(4)}`;
    }
  }

  onBlur(): void {
    this.onTouched();
  }
}