import {Component, inject, signal} from '@angular/core';
import { ProfilePageStore } from './store/page-profile';
import {UiButton} from '../../../../shared/ui/button';
import {UpdateProfileComponent} from './ui/update-profile/update-profile';

@Component({
  selector: 'page-profile',
  templateUrl: './page-profile.html',
  styleUrls: ['./page-profile.scss'],
  imports: [
    UiButton,
    UpdateProfileComponent
  ],
  standalone: true
})

export class ProfilePage {
  readonly store = inject(ProfilePageStore);
  isUpdateComponentOpen = signal<boolean>(false);

  constructor() {
    this.store.loadPage()
  }

  openUpdateComponent() {
    this.isUpdateComponentOpen.set(true);
  }

  closeUpdateComponent() {
    this.isUpdateComponentOpen.set(false);
  }
}
