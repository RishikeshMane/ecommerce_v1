import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';


@Injectable({
    providedIn: 'root'
})
export class CurrentLoginService
{
    isCurrentLogin = new Subject<boolean>();
    isCurrentLogining: boolean = false;

    constructor() { }

    setCurrentLogin(expand: boolean)
    {
        this.isCurrentLogining = expand;        
        this.isCurrentLogin.next(expand);
    }

    getCurrentLogin(): Observable<boolean>
    {
        return this.isCurrentLogin.asObservable();
    }

    getCurrentLogining(): boolean
    {
        return this.isCurrentLogining;
    }
}
