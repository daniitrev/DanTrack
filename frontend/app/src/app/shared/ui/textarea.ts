import { Component, forwardRef, input, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-ui-textarea',
  template: `<textarea
    [id]="id()"
    [value]="value"
    [disabled]="disabled"
    (blur)="handleBlur()"
    [placeholder]="placeholder()"
    (input)="handleChange($event)"
  ></textarea>`,
  styles: `
    textarea {
      min-width: var(--input-min-width, 100%);
      min-height: var(--input-min-height, 250px);
      border: none;
      padding: 12px;
    }
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UiTextarea),
      multi: true,
    },
  ],
})
export class UiTextarea implements ControlValueAccessor {
  readonly id = input<string>('');
  readonly placeholder = input<string>('Введите значение');

  value = '';
  disabled = false;

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  handleChange(event: Event) {
    const target = event.target as HTMLTextAreaElement;
    const text = target.value;
    this.onChange(text);
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
