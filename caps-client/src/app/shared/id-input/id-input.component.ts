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
  value: string = '';
  onChange: (value: string) => void = () => {};
  onTouched: () => void = () => {};

  formatIdNumber(value: string): string {
    value = value.replace(/\D/g, '');

    if (value.length > 13) {
      value = value.substring(0, 13);
    }

    return value.replace(/(\d{4})(?=\d)/g, '$1-');
  }

  onInputChange(event: any): void {
    let formattedValue = this.formatIdNumber(event.target.value);
    this.value = formattedValue;
    this.onChange(this.value);
  }

  writeValue(value: string): void {
    if (value) {
      this.value = this.formatIdNumber(value);
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
}
