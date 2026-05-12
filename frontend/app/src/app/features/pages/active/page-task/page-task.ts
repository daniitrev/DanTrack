import { Component, computed, effect, inject, untracked } from '@angular/core';
import { DatePipe } from '@angular/common';
import { TaskPageStore } from './store/page-task';
import { CreateTaskPayload, Priority, TaskStatus, UpdateTaskPayload } from './model/page-task';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UiInput } from '../../../../shared/ui/input';
import { UiTextarea } from '../../../../shared/ui/textarea';
import { UiButton } from '../../../../shared/ui/button';
import { ProjectPageStore } from '../page-project/store/page-project';
import { SelectOption, UiSelectComponent } from '../../../../shared/ui/select';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'task-page',
  templateUrl: 'page-task.html',
  styleUrls: ['page-task.scss'],
  imports: [ReactiveFormsModule, UiInput, UiTextarea, UiButton, UiSelectComponent, DatePipe],
  providers: [TaskPageStore],
  standalone: true,
})
export class TaskPage {
  readonly store = inject(TaskPageStore);
  readonly projectStore = inject(ProjectPageStore);



  readonly assigneeOptions = computed<SelectOption[]>(() => [
    { label: 'Без исполнителя', value: '' },
    ...((this.projectStore.currentProject()?.memberOfProject ?? [])
      .map((member) => ({
        label: member.member.name || member.member.email,
        value: member.member.userId,
      }))
      .filter((member) => member.label && member.value)),
  ]);


  readonly priorityOptions: SelectOption[] = [
    { label: 'ABSENT', value: 'ABSENT' },
    { label: 'LOW', value: 'LOW' },
    { label: 'HIGH', value: 'HIGH' },
    { label: 'CRITICAL', value: 'CRITICAL' },
  ];


  readonly projectOptions = computed<SelectOption[]>(() =>
    (this.projectStore.projectPage() ?? [])
      .map((project) => ({
        label: project.title ?? '',
        value: project.projectId ?? '',
      }))
      .filter((project) => project.label && project.value),
  );

  readonly taskForm = new FormGroup({
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
    projectId: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    assigneeId: new FormControl('', {
      nonNullable: true,
    }),
  });



  constructor() {
    this.projectStore.loadPage();

    this.taskForm.controls.projectId.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe((projectId) => {
        if (!projectId) return;
        this.handleProjectChange(projectId);
      });

    effect(() => {
      const options = this.projectOptions();
      if (options.length === 0) return;

      untracked(() => {
        if (!this.taskForm.controls.projectId.value) {
          const firstProjectId = options[0].value ?? '';
          this.taskForm.patchValue({ projectId: firstProjectId });
          if (firstProjectId) {
            this.handleProjectChange(firstProjectId);
          }
        }
      });
    });
  }

  handleProjectChange(projectId: string) {
    this.projectStore.detailOfProject({ projectId });
    this.store.loadPage({ projectId });
  }

  selectTask(taskId: string) {
    this.store.getTaskById({ taskId });
  }

  onSubmit() {
    const { title, description, priority, projectId, status, deadline, assigneeId } =
      this.taskForm.getRawValue();

    if (title && description && priority && projectId && status && deadline) {
      const payload: CreateTaskPayload = {
        title,
        description,
        priority,
        projectId,
        status,
        deadline,
        assigneeId: assigneeId || null,
      };

      this.store.createTask(payload);
      this.store.loadPage({ projectId });
      this.taskForm.patchValue({
        title: '',
        description: '',
        priority: 'ABSENT',
        status: 'NOT_STARTED',
        deadline: '',
        assigneeId: '',
      });
    }
  }



  deleteTask(taskId: string) {
    this.store.deleteTask({ taskId });
  }

}
