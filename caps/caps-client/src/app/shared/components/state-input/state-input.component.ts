import { Component, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { HONDURAS_DEPARTMENTS } from 'src/app/constants/constants';



@Component({
  selector: 'app-state-input',
  templateUrl: './state-input.component.html',
  styleUrls: ['./state-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => StateInputComponent),
      multi: true,
    },
  ],
})
export class StateInputComponent {
  states: string[] = HONDURAS_DEPARTMENTS;

  selectedState: string = ''; // Stores the selected value
  onChange = (value: string) => {};
  onTouched = () => {};

  writeValue(value: string): void {
    this.selectedState = value || '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  onSelectChange(event: any): void {
    this.selectedState = event.value;
    this.onChange(this.selectedState);
  }
}
