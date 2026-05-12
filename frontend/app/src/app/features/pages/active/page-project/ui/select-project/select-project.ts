import { Component, inject, input, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UiButton } from '../../../../../../shared/ui/button';
import { UiInput } from '../../../../../../shared/ui/input';
import { ProjectPageStore } from '../../store/page-project';

@Component({
  selector: 'app-select-project',
  standalone: true,
  templateUrl: './select-project.html',
  imports: [ReactiveFormsModule, UiButton, UiInput],
  styleUrls: ['./select-project.scss'],
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
