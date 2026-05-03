import {Component, inject} from '@angular/core';
import {TaskPageStore} from './store/task-page';
import {CreateTaskPayload, Priority} from './model/task-page';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {UiInput} from '../../../../shared/ui/input';
import {UiTextarea} from '../../../../shared/ui/textarea';
import {UiButton} from '../../../../shared/ui/button';
import {ProjectPageStore} from '../project-page/store/project-page';


@Component({
  selector: 'task-page',
  templateUrl: 'task-page.html',
  styleUrls: ['task-page.scss'],
  imports: [ReactiveFormsModule, UiInput, UiTextarea, UiButton],
  providers: [TaskPageStore]
})

export class TaskPage {
  readonly store = inject(TaskPageStore);
  readonly projectStore = inject(ProjectPageStore);
  readonly priorityOptions: Priority[] = ['ABSENT', 'LOW', 'HIGH', 'CRITICAL'];

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
    projectId: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  onSubmit() {
    const { title, description, priority, projectId } = this.taskForm.value;

    if (title && description && priority && projectId) {
      const payload: CreateTaskPayload = {
        title,
        description,
        priority,
        projectId,
      };

      this.store.createTask(payload);
    }
  }

  constructor() {
    this.projectStore.loadPage();
  }
}
