import { Component, forwardRef, input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export interface SelectOption {
  label: string | undefined;
  value: string | undefined;
}

@Component({
  selector: 'app-ui-select',
  standalone: true,
  template: `
    <select
      [id]="id()"
      [name]="name()"
      [value]="value"
      [disabled]="disabled"
      (change)="handleChange($event)"
      (blur)="handleBlur()"
    >
      @for (option of options(); track option.value) {
        <option [value]="option.value">
          {{ option.label }}
        </option>
      }
    </select>
  `,
  styles: `
    select {
      width: var(--input-width);
      min-height: var(--input-height);
      border: 1px solid var(--color-blue-light-bg);
      border-radius: var(--border-radius-md);
      background: var(--color-white);
      color: var(--color-text-main);
      padding: 0 12px;
    }
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UiSelectComponent),
      multi: true,
    },
  ],
})
export class UiSelectComponent implements ControlValueAccessor {
  readonly name = input('name');
  readonly id = input('');
  readonly options = input<SelectOption[]>([]);

  value = 'Выберите значение';
  disabled = false;

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: string | null): void {
    this.value = value ?? '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  handleChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.value = target.value;
    this.onChange(this.value);
  }

  handleBlur(): void {
    this.onTouched();
  }
}
