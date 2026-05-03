import { Component, forwardRef, input, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-ui-input',
  standalone: true,
  template: `<input
    [type]="type()"
    [id]="id()"
    [value]="value"
    [disabled]="disabled"
    (blur)="handleBlur()"
    [placeholder]="placeholder()"
    (input)="handleInput($event)"
  />`,
  styles: `
    input {
      width: var(--input-width, 100%);
      height: var(--input-height);
      border: 1px solid var(--color-blue-light-bg);
      border-radius: var(--border-radius-md);
      padding: 0 0 0 12px;
    }
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UiInput),
      multi: true,
    },
  ],
})
export class UiInput implements ControlValueAccessor {
  readonly type = input<string>('text');
  readonly id = input<string>('');
  readonly placeholder = input<string>('Введите значение');
  value = '';
  disabled = false;

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  handleInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value = target.value;
    this.onChange(this.value);
  }

  writeValue(value: string | null): void {
    this.value = value ?? '';
  }

  registerOnChange(fn: (value: string | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  handleBlur(): void {
    this.onTouched();
  }
}
