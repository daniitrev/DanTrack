import { Component, inject } from '@angular/core';
import { AuthStore } from '../auth/store/auth';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class HeaderComponent {
  readonly authStore = inject(AuthStore);

  logout() {
    this.authStore.logout();
  }
}
