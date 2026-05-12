import {Component, inject, output} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ProfilePageStore } from '../../store/page-profile';
import { UiInput } from '../../../../../../shared/ui/input';
import {UiButton} from '../../../../../../shared/ui/button';

@Component({
  selector: 'app-update-profile',
  standalone: true,
  templateUrl: './update-profile.html',
  styleUrl: './update-profile.scss',
  imports: [ReactiveFormsModule, UiInput, UiButton],
})
export class UpdateProfileComponent {
  readonly store = inject(ProfilePageStore);
  readonly close = output<void>();
  private imageBase64 = '';

  readonly profileForm = new FormGroup({
    name: new FormControl('', { nonNullable: true }),
    email: new FormControl('', { nonNullable: true }),
  });

  onImageChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];

    if (!file) {
      this.imageBase64 = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      this.imageBase64 = typeof reader.result === 'string' ? reader.result : '';
    };
    reader.readAsDataURL(file);
  }

  update() {
    const { name, email } = this.profileForm.getRawValue();
    const payload: {
      name?: string;
      email?: string;
      image?: string;
    } = {};

    if (name.trim()) {
      payload.name = name.trim();
    }

    if (email.trim()) {
      payload.email = email.trim();
    }

    if (this.imageBase64) {
      payload.image = this.imageBase64;
    }

    this.store.updateProfile(payload);
  }
}
