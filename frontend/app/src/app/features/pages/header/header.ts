import { Component, inject } from '@angular/core';
import {UiButton} from '../../../shared/ui/button';
import {AuthStore} from '../auth/store/auth';
import {RouterLink, RouterLinkActive} from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.html',
  styleUrl: './header.scss',
  imports: [UiButton, RouterLink, RouterLinkActive],
})
export class HeaderComponent {
  readonly authStore = inject(AuthStore);

  logout() {
    this.authStore.logout();
  }
}
