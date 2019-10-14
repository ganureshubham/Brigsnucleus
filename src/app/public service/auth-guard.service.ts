import { Injectable }       from '@angular/core';
import {
  CanActivate, Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
}                           from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate {
  redirectUrl: string;

  constructor(private router: Router) {}
//   canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
//     if (localStorage.getItem('currentUser')) {
//         // logged in so return true
//         return true;
//     }
//     // not logged in so redirect to login page with the return url
//     this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
//     return false;
// }


canActivate(
  next: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): boolean {
  let url: string = state.url;

  return this.checkLogin(url);
}

checkLogin(url: string): boolean {
  if (localStorage.getItem("currentUser")) {
    // localStorage.getItem('inkpencilUser')
    return true;
  }
  // Store the attempted URL for redirecting
  this.redirectUrl = url;

  // Store the attempted URL for redirecting
  // this.redirectUrl = url;
  // not logged in so redirect to login page with the return url
  // Navigate to the login page with extras
  this.router.navigate(["/login"]);
  return false;
}
}
