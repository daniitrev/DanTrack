import {Component, effect, inject, signal, untracked} from '@angular/core';
import { ProjectPageStore } from './store/project-page';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {UiButton} from '../../../../shared/ui/button';
import {ProjectDialogComponent} from './ui/project-dialog/project-dialog';
import {SelectProjectComponent} from './ui/select-project/select-project';

@Component({
  selector: 'app-project-page',
  templateUrl: './project-page.html',
  styleUrl: './project-page.scss',
  imports: [ReactiveFormsModule, UiButton, ProjectDialogComponent, SelectProjectComponent],
})
export class ProjectPage {
  readonly store = inject(ProjectPageStore);
  readonly selectedProjectId = signal<string>('');

  readonly projectCreateForm = new FormGroup({
    title: new FormControl(''),
    description: new FormControl(''),
  });

  readonly isCreateProject = signal<boolean>(false);
  readonly isSelectedProject = signal<boolean>(false);
  readonly isTaskPageOpen = signal<boolean>(false);

  openCreateProject() {
    this.isCreateProject.set(true);
  }
  closeCreateProject() {
    this.isCreateProject.set(false);
  }
  openTaskPage() {
    this.isTaskPageOpen.set(true);
  }
  closeTaskPage() {
    this.isTaskPageOpen.set(false);
  }
  openSelectedProject(projectId: string) {
    this.selectedProjectId.set(projectId);
    this.isSelectedProject.set(true);
  }
  closeSelectedProject() {
    this.isSelectedProject.set(false);
  }

  constructor() {
    this.store.loadPage()

    effect(() => {
      const project = this.store.projectPage()
      if (project) {
        untracked(() => this.store.loadPage())
      }
    });
  }
}
