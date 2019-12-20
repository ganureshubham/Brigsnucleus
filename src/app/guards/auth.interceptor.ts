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
import { MatSnackBar } from '@angular/material';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {

	constructor(
		private router: Router,
		private authenticationService: AuthenticationService,
		private snackBar: MatSnackBar
	) { }

	intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

		let currentUser: any = JSON.parse(localStorage.getItem('currentUser'));

		if (currentUser != undefined && currentUser != null && currentUser.data.token != undefined && currentUser.data.token != null) {
			request = request.clone({
				setHeaders: {
					Authorization: currentUser.data.token
				}
			});
		} else {
			request = request.clone({
				setHeaders: {
					Authorization: ''
				}
			});
		}

		return next.handle(request).pipe(
			tap(
				() => { },
				err => {
					if (err.status === 500) {
						this.showSnackBar('Token expired, kindly login..!!');
						this.authenticationService.logout();
						this.router.navigateByUrl('/login');
					}
				}
			)
		);

	}

	showSnackBar(message: string) {
		this.snackBar.open(message, '', { duration: 3000 });
	}

}
