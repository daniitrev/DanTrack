import { Component, inject, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UiButton } from '../../../../../../shared/ui/button';
import { UiInput } from '../../../../../../shared/ui/input';
import { UiTextarea } from '../../../../../../shared/ui/textarea';
import { ProjectPageStore } from '../../store/page-project';
import { ProjectStatus } from '../../model/page-project';

@Component({
  selector: 'app-project-dialog',
  standalone: true,
  templateUrl: './project-dialog.html',
  imports: [ReactiveFormsModule, UiButton, UiInput, UiTextarea],
  styleUrl: './project-dialog.scss',
})
export class ProjectDialogComponent {
  readonly store = inject(ProjectPageStore);
  readonly close = output<void>();
  readonly statusOptions: ProjectStatus[] = [
    'NOT_STARTED',
    'TODO',
    'IN_PROGRESS',
    'IN_REVIEW',
    'DONE',
  ];

  readonly projectForm = new FormGroup({
    title: new FormControl(''),
    description: new FormControl(''),
    status: new FormControl<ProjectStatus>('NOT_STARTED'),
  });

  readonly addMemberForm = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  onSubmit() {
    const { title, description, status } = this.projectForm.value;
    if (title && status) {
      this.store.createProject({ title, description, status });
    }
  }
}
