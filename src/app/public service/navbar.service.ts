import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable({
    providedIn: 'root'
})
export class NavbarService {

    private shouldReloadOrgFeatures = new BehaviorSubject<boolean>(false);

    setShouldReloadOrgFeatures(shouldReload: boolean) {
        this.shouldReloadOrgFeatures.next(shouldReload);
    }

    getShouldReloadOrgFeatures() {
        return this.shouldReloadOrgFeatures.asObservable();
    }

}
