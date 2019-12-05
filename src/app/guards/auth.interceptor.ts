import {
    HttpInterceptor,
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpErrorResponse
} from '@angular/common/http';
import {
    Observable
} from 'rxjs';
import {
    Injectable
} from '@angular/core';
import {
    Router,
} from '@angular/router';
import {
    tap
} from 'rxjs/operators';
import { AuthenticationService } from '../public service/authentication.service';



@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private router: Router, private authenticationService: AuthenticationService) { }


    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        let token = localStorage.getItem('currentUser');

        if (token != "undefined" && token !== null) {
            request = request.clone({
                setHeaders: {
                    Authorization: JSON.parse(localStorage.getItem('currentUser')).data.token
                }
            });
        }

        return next.handle(request).pipe(
            tap(
                () => { },
                err => {
                    if (err.status === 500) {
                        this.authenticationService.logout();
                        this.router.navigateByUrl('/login');
                    }
                }
            )
        );

    }
}
