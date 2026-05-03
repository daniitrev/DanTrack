import { Routes } from '@angular/router';
import { LoginComponent } from './features/pages/auth/pages/login/login';
import { RegistrationComponent } from './features/pages/auth/pages/registration/registration';
import { MainPage } from './features/pages/main/main-page';
import { TimeEntriesPage } from './features/pages/active/task-entries/time-entries-page';
import {ReportsPage} from './features/pages/active/reports/reports';
import {TaskPage} from './features/pages/active/task-page/task-page';
import {ProjectPage} from './features/pages/active/project-page/project-page';

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
    ],
  },
];
