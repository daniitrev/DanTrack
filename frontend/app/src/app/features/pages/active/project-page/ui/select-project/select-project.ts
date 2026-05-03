import { Component, inject, input, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UiButton } from '../../../../../../shared/ui/button';
import { UiInput } from '../../../../../../shared/ui/input';
import { ProjectPageStore } from '../../store/project-page';

@Component({
  selector: 'app-select-project',
  standalone: true,
  template: `
    <div class="select">
      <div class="select-wrapper">
        <div class="form-header">
          <div class="select-heading">
            <h1>Рабочая зона</h1>
            <p>Заготовка под задачи и записи времени.</p>
          </div>
          <app-ui-button type="button" (pressed)="close.emit()">×</app-ui-button>
        </div>

        <div class="select-section">
          <h2>Tasks</h2>
          <div class="select-list">
            @for (task of store.tasks() ; track task.taskId) {
              <div class="select-item">
                <div class="select-item__title">{{ task.title }}</div>
                <div class="select-item__meta">{{ task.description }}</div>
              </div>
            }
        </div>

        <div class="select-section">
          <h2>Time Entries</h2>
          <div class="select-list">
            <div class="select-item">
              <div class="select-item__title">09:00 - 10:30</div>
              <div class="select-item__meta">Работа над проектом</div>
            </div>
            <div class="select-item">
              <div class="select-item__title">11:00 - 12:15</div>
              <div class="select-item__meta">Оформление task flow</div>
            </div>
          </div>
        </div>

        <div class="select-section" [formGroup]="addMemberForm">
          <h2>Участники проекта</h2>
          <div class="select-member-row">
            <app-ui-input
              id="selected_project_member_email"
              type="email"
              formControlName="email"
              placeholder="Введите email участника"
            />
            <app-ui-button
              type="button"
              (pressed)="addMember(addMemberForm.controls.email.value)"
            >
              Добавить
            </app-ui-button>
          </div>
        </div>
      </div>
    </div>
  `,
  imports: [ReactiveFormsModule, UiButton, UiInput],
  styles: `
    .select {
      position: fixed;
      inset: 0;
      z-index: 999;
      background: var(--color-overlay);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .select-wrapper {
      display: flex;
      flex-direction: column;
      gap: 18px;
      width: min(100%, 760px);
      min-height: 420px;
      padding: 24px;
      background-color: var(--color-white);
      border-radius: var(--border-radius-xl);
      box-shadow: var(--dialog-shadow);
      height: auto;
      border: 1px solid rgba(100, 149, 237, 0.18);
    }
    .form-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 12px;
      padding-bottom: 14px;
      border-bottom: 1px solid rgba(100, 149, 237, 0.16);
    }
    .select-heading h1 {
      margin: 0 0 6px;
      color: var(--color-text-main);
      font-size: 26px;
    }
    .select-heading p {
      margin: 0;
      color: var(--color-light-gray);
      font-size: 14px;
    }
    .select-section {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .select-section h2 {
      margin: 0;
      color: var(--color-text-main);
      font-size: 18px;
    }
    .select-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .select-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
      padding: 14px 16px;
      border-radius: var(--border-radius-lg);
      background: var(--color-blue-light-bg);
      border: 1px solid rgba(100, 149, 237, 0.14);
    }
    .select-item__title {
      color: var(--color-text-main);
      font-weight: 600;
    }
    .select-item__meta {
      color: var(--color-light-gray);
      font-size: 13px;
    }
    .select-member-row {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .select-member-row app-ui-input {
      display: block;
      flex: 1;
    }
    .select-member-row app-ui-button {
      display: block;
      flex-shrink: 0;
    }
    @media (max-width: 640px) {
      .select-member-row {
        flex-direction: column;
        align-items: stretch;
      }
    }
  `,
})
export class SelectProjectComponent {
  readonly store = inject(ProjectPageStore);
  readonly projectId = input<string>('');
  readonly close = output<void>();

  readonly addMemberForm = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  addMember(email: string) {
    const memberEmail = email || this.addMemberForm.controls.email.value;
    const currentProjectId = this.projectId();

    if (memberEmail && currentProjectId) {
      this.store.addMemberToCurrentProject({ projectId: currentProjectId, email: memberEmail });
    }
  }
}
