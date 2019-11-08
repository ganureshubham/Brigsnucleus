import { Routes } from '@angular/router';
import { LoginComponent } from './login.component';
import { AuthGuard } from '../guards/auth.guard';

export const LoginRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'login',
        component: LoginComponent,
        canActivate: [AuthGuard]
      }
    ]
  }
];
