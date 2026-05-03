import { Component, input } from '@angular/core';
import {ControlValueAccessor} from '@angular/forms';

export interface SelectOption {
  label: string;
  value: string;
}

@Component({
  selector: 'app-ui-select',
  standalone: true,
  template: `
    <select [name]="name()" [id]="id()">
      @for (option of options(); track option.value) {
        <option [value]="option.value">
          {{ option.label }}
        </option>
      }
    </select>
  `,
  styles: `
    select {
      width: 100%;
      min-height: var(--input-height);
      border: 1px solid var(--color-blue-light-bg);
      border-radius: var(--border-radius-md);
      background: var(--color-white);
      color: var(--color-text-main);
      padding: 0 12px;
    }
  `,
})
export class UiSelectComponent implements ControlValueAccessor {
  readonly name = input('name');
  readonly id = input('');
  readonly options = input<SelectOption[]>([]);

  writeValue(obj: any): void {
    throw new Error("Method not implemented.");
  }
  registerOnChange(fn: any): void {
    throw new Error("Method not implemented.");
  }
  registerOnTouched(fn: any): void {
    throw new Error("Method not implemented.");
  }
  setDisabledState?(isDisabled: boolean): void {
    throw new Error("Method not implemented.");
  }
}
