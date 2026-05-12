import {Component, computed, effect, inject, signal, untracked} from '@angular/core';
import {UiButton} from '../../../../../../shared/ui/button';
import {TimeEntryPageStore} from '../../../page-time-entries/store/page-time-entries';
import {TaskPageStore} from '../../store/page-task';
import {ProjectPageStore} from '../../../page-project/store/page-project';
import {SelectOption, UiSelectComponent} from '../../../../../../shared/ui/select';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {DecimalPipe} from '@angular/common';

@Component({
  selector: 'app-task-start',
  templateUrl: './task-start.html',
  styleUrls: ['./task-start.scss'],
  standalone: true,
  imports: [
    UiButton,
    UiSelectComponent,
    ReactiveFormsModule,
    DecimalPipe
  ],
  providers: [TimeEntryPageStore, TaskPageStore]
})


export class TaskStartComponent {
  readonly projectStore = inject(ProjectPageStore);
  readonly timeEntryStore = inject(TimeEntryPageStore);
  protected seconds = signal(0);
  protected minutes = signal(0);
  protected hours = signal(0);
  protected target = signal(100);

  timerId: ReturnType<typeof setInterval> | null = null;

  readonly projectOptions = computed<SelectOption[]>(() =>
    (this.projectStore.projectPage() ?? []).map((project) => ({
      label: project.title ?? '',
      value: project.projectId ?? '',
    })).filter((project) => project.label && project.value),
  );

  readonly taskOptions = computed<SelectOption[]>(() =>
    (this.projectStore?.currentProject()?.tasks ?? []).map((task) => ({
      label: task.title ?? '',
      value: task.taskId ?? '',
    })).filter((task) => task.label && task.value)
  );

  getProjectDetail = new FormGroup({
    projectId: new FormControl(''),
  })

  startEntryForm = new FormGroup({
    taskId: new FormControl(''),
  })

  projectDetail(){
    const {projectId} = this.getProjectDetail.value;
    if (projectId) {
        this.projectStore.detailOfProject({projectId});
        this.startEntryForm.patchValue({ taskId: '' });
    }
  }

  constructor() {
    this.projectStore.loadPage()

    effect(() => {
      const prOption = this.projectOptions()
      if (prOption.length > 0) {
        const firstProjectId = prOption[0].value;
        untracked(() => {
          if (!this.getProjectDetail.value.projectId) {
            this.getProjectDetail.patchValue({projectId: firstProjectId});
            this.projectStore.detailOfProject({projectId: firstProjectId});
          }
        })
      }
    });

    effect(() => {
      const tasks = this.taskOptions();
      if (tasks.length > 0) {
        untracked(() => {
          const currentTaskId = tasks[0].value
            this.startEntryForm.patchValue({ taskId: tasks[0].value });
        });
      }
    });
  }
    timerStart() {
      if (this.timerId) return;

      this.timerId = setInterval(() => {
          this.seconds.update(value => value + 1);
          this.target.update(value => value - 1.67);
          if (this.seconds() === 60) {
            this.seconds.set(0)
            this.target.set(100)
            this.minutes.update(value => value + 1);
          }
          if (this.minutes() === 60) {
            this.minutes.set(0)
            this.hours.update(value => value + 1);
          }
          if (this.hours() === 60) {
            this.hours.set(0)
          }
        }, 1000)
    }
  timerStop() {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  clearTimer(){
    this.timerId = null;
    this.minutes.set(0)
    this.seconds.set(0)
    this.hours.set(0)
    this.target.set(100)
  }


  createTimeEntry() {
    const { taskId } = this.startEntryForm.value;
    if (taskId) {
      this.timeEntryStore.createTimeEntry({taskId});
    }
  }


}
