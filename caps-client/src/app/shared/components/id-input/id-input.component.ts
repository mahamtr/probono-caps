import { Component, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-id-input',
  templateUrl: './id-input.component.html',
  styleUrls: ['./id-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => IdInputComponent),
      multi: true,
    },
  ],
})
export class IdInputComponent implements ControlValueAccessor {
  private rawValue: string = '';
  formattedValue: string = '';
  onChange = (_: number) => {};
  onTouched = () => {};

  writeValue(value: number | null): void {
    if (value !== null && value !== undefined) {
      this.rawValue = value.toString();
      this.formattedValue = this.formatIdNumber(this.rawValue);
    } else {
      this.rawValue = '';
      this.formattedValue = '';
    }
  }

  registerOnChange(fn: (value: number) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  onInputChange(event: any): void {
    const inputValue = event.target.value;

    // Remove non-numeric characters
    this.rawValue = inputValue.replace(/\D/g, '').slice(0, 13);

    // Update the displayed value
    this.formattedValue = this.formatIdNumber(this.rawValue);

    // Emit only the number value
    this.onChange(this.rawValue ? parseInt(this.rawValue, 10) : 0);
  }

  formatIdNumber(value: string): string {
    if (value.length <= 4) {
      return value;
    } else if (value.length <= 8) {
      return `${value.slice(0, 4)}-${value.slice(4)}`;
    } else {
      return `${value.slice(0, 4)}-${value.slice(4, 8)}-${value.slice(8, 12)}`;
    }
  }

  onBlur(): void {
    this.onTouched();
  }
}
