import {Component, effect, inject, OnInit, signal, untracked} from '@angular/core';
import { ProjectPageStore } from './store/page-project';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { UiButton } from '../../../../shared/ui/button';
import { ProjectDialogComponent } from './ui/project-dialog/project-dialog';
import { SelectProjectComponent } from './ui/select-project/select-project';
import {ReportsPageStore} from '../page-reports/store/page-reports';

@Component({
  selector: 'app-project-page',
  templateUrl: './page-project.html',
  styleUrl: './page-project.scss',
  providers: [ReportsPageStore],
  imports: [ReactiveFormsModule, UiButton, ProjectDialogComponent, SelectProjectComponent],
})
export class ProjectPage implements OnInit {
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
    this.store.loadPage();


  }
  ngOnInit() {


  }
}
