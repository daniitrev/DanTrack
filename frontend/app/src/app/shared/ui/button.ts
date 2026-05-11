import { Component, input, output } from '@angular/core';

type buttonData = 'button' | 'submit' | 'reset';

@Component({
  selector: 'app-ui-button',
  standalone: true,
  template: `<button [type]="type()" [disabled]="disabled()"  (click)="onClick()" class="{{ styles() }}">
    <ng-content />
  </button>`,
  styles: `
    button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-height: var(--btn-size);
      min-width: contain;
      padding: 0 16px;
      border: 1px solid transparent;
      border-radius: var(--border-radius-md);
      font: inherit;
      font-weight: 600;
      line-height: 1;
      cursor: pointer;
      transition: 120ms;

      &.default {
        background: linear-gradient(
          135deg,
          var(--color-medium-slate-blue),
          var(--color-royal-blue)
        );
        color: var(--color-white);
        box-shadow: 0 10px 20px rgba(65, 105, 225, 0.24);

        &:hover:not(:disabled) {
          box-shadow: 0 14px 24px rgba(65, 105, 225, 0.28);
          filter: brightness(1.03);
        }
      }

      &.actions {
        background: var(--color-white);
        border-color: var(--color-blue-light-border);
        color: var(--color-text-main);
        box-shadow: 0 6px 16px rgba(31, 41, 55, 0.08);

        &:hover:not(:disabled) {
          background: var(--color-blue-light-bg);
          border-color: var(--color-cornflower-blue);
        }
      }
    }

  `,
})
export class UiButton {
  readonly type = input<buttonData>('button');
  readonly disabled = input(false);
  readonly pressed = output<void>();
  readonly styles = input<"default" | "actions">("default");

  onClick() {
    this.pressed.emit();
  }
}
