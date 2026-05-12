import {Component, inject} from '@angular/core';
import {Router, RouterLink, RouterLinkActive} from '@angular/router';
import {UiButton} from '../ui/button';
import {AuthStore} from '../../features/pages/auth/store/auth';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.scss'],
  imports: [
    RouterLink,
    RouterLinkActive,
    UiButton
  ],

  standalone: true
})

export class SidebarComponent {
  readonly router = inject(Router);
  readonly auth = inject(AuthStore)

  logout(){
    this.auth.logout();
  }
}
