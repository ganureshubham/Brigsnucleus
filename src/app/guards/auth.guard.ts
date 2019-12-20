import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthenticationService } from '../public service/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {

    return this.isUserAlreadyLoggedIn();

  }

  isUserAlreadyLoggedIn(): boolean {

    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser != undefined && currentUser != null && currentUser.auth != undefined && currentUser.auth != null && currentUser.auth) {
      return true;
    }
    this.router.navigate(['/login']);
    return false;

  }

}
