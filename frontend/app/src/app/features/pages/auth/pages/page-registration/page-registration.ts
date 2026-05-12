import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthStore } from '../../store/auth';

@Component({
  selector: 'app-registration',
  templateUrl: './page-registration.html',
  styleUrls: ['./page-registration.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
})
export class RegistrationComponent {
  readonly userStore = inject(AuthStore);
  profileForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    username: new FormControl('', [Validators.required, Validators.minLength(4)]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(100),
      Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/),
    ]),
  });
  protected onSubmit() {
    if (this.profileForm.valid) {
      const { email, username, password } = this.profileForm.value;
      this.userStore.register({
        email: email ?? '',
        username: username ?? '',
        password: password ?? '',
      });
    }
  }
}
