import { Component, input, output } from '@angular/core';

type buttonData = 'button' | 'submit' | 'reset';

@Component({
  selector: 'app-ui-button',
  standalone: true,
  template: `<button [type]="type()" [disabled]="disabled()" (click)="onClick()">
    <ng-content />
  </button>`,
  styles: `
    button {
      min-width: contain;
      height: 30px;
      border-radius: 25%;
      border: none;
    }
  `,
})
export class UiButton {
  readonly type = input<buttonData>('button');
  readonly disabled = input(false);
  readonly pressed = output<void>();

  onClick() {
    this.pressed.emit();
  }
}
