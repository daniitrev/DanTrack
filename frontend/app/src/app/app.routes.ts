import { Routes } from '@angular/router';
import { LoginComponent } from './features/pages/auth/pages/page-login/page-login';
import { RegistrationComponent } from './features/pages/auth/pages/page-registration/page-registration';
import { MainPage } from './features/pages/page-main/page-main';
import { TimeEntriesPage } from './features/pages/active/page-time-entries/page-time-entries';
import { ReportsPage } from './features/pages/active/page-reports/page-reports';
import { TaskPage } from './features/pages/active/page-task/page-task';
import { ProjectPage } from './features/pages/active/page-project/page-project';
import {ProfilePage} from './features/pages/active/page-profile/page-profile';
import { AuthChildGuard, AuthGuard } from './guard/auth';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login',
  },
  {
    path: 'registration',
    component: RegistrationComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'main',
    component: MainPage,
    canActivate: [AuthGuard],
    canActivateChild: [AuthChildGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'projects',
      },
      {
        path: 'projects',
        component: ProjectPage,
      },
      {
        path: 'tasks',
        component: TaskPage,
      },
      {
        path: 'reports',
        component: ReportsPage,
      },
      {
        path: 'time-entries',
        component: TimeEntriesPage,
      },
      {
        path: 'profile',
        component: ProfilePage,
      }
    ],
  },
];
