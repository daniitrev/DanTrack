import {Component, computed, effect, inject, untracked} from '@angular/core';
import {TaskPageStore} from '../../store/page-task';
import {SelectOption, UiSelectComponent} from '../../../../../../shared/ui/select';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {UiButton} from '../../../../../../shared/ui/button';
import {UiInput} from '../../../../../../shared/ui/input';
import {UiTextarea} from '../../../../../../shared/ui/textarea';
import {Priority, TaskStatus, UpdateTaskPayload} from '../../model/page-task';
import {ProjectPageStore} from '../../../page-project/store/page-project';

@Component({
  selector: 'task-update',
  templateUrl: './task-update.html',
  styleUrls: ['./task-update.scss'],
  imports: [
    ReactiveFormsModule,
    UiButton,
    UiInput,
    UiSelectComponent,
    UiTextarea
  ]
})

export class TaskUpdateComponent {
  readonly store = inject(TaskPageStore)
  readonly projectStore = inject(ProjectPageStore)
  private toDateInputValue(value: string | Date) {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? '' : date.toISOString().slice(0, 10);
  }

  readonly assigneeOptions = computed<SelectOption[]>(() => [
    { label: 'Без исполнителя', value: '' },
    ...((this.projectStore.currentProject()?.memberOfProject ?? [])
      .map((member) => ({
        label: member.member.name || member.member.email,
        value: member.member.userId,
      }))
      .filter((member) => member.label && member.value)),
  ]);

  readonly statusOptions: SelectOption[] = [
    { label: 'NOT_STARTED', value: 'NOT_STARTED' },
    { label: 'TODO', value: 'TODO' },
    { label: 'IN_PROGRESS', value: 'IN_PROGRESS' },
    { label: 'IN_REVIEW', value: 'IN_REVIEW' },
    { label: 'DONE', value: 'DONE' },
  ];

  readonly priorityOptions: SelectOption[] = [
    { label: 'ABSENT', value: 'ABSENT' },
    { label: 'LOW', value: 'LOW' },
    { label: 'HIGH', value: 'HIGH' },
    { label: 'CRITICAL', value: 'CRITICAL' },
  ];

  constructor() {
    effect(() => {
      const currentTask = this.store.currentTaskData();
      if (!currentTask) return;

      untracked(() => {
        this.editForm.patchValue({
          taskId: currentTask.taskId,
          title: currentTask.title,
          description: currentTask.description,
          priority: currentTask.priority,
          status: currentTask.status,
          deadline: this.toDateInputValue(currentTask.deadline),
          assigneeId: currentTask.assigneeId ?? '',
        });
      });
    });
  }
  readonly editForm = new FormGroup({
    taskId: new FormControl('', { nonNullable: true }),
    title: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    description: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    priority: new FormControl<Priority>('ABSENT', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    status: new FormControl<TaskStatus>('NOT_STARTED', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    deadline: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    assigneeId: new FormControl('', {
      nonNullable: true,
    }),
  });

  updateTask() {
    const { taskId, title, description, priority, status, deadline, assigneeId } =
      this.editForm.getRawValue();

    if (!taskId || !title || !description || !priority || !status || !deadline) {
      return;
    }

    const payload: UpdateTaskPayload = {
      taskId,
      title,
      description,
      priority,
      status,
      deadline,
      assigneeId: assigneeId || null,
    };

    this.store.updateTask(payload);
  }

}
