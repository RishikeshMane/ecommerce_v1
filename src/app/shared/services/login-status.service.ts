import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';


@Injectable({
    providedIn: 'root'
})
export class LoginStatusService
{
    isLogin = new Subject<boolean>();
    isLogining: boolean = true;

    constructor() { }

    setLogin(expand: boolean)
    {
        this.isLogining = expand;        
        this.isLogin.next(expand);
    }

    getLogin(): Observable<boolean>
    {
        return this.isLogin.asObservable();
    }

    getLogining(): boolean
    {
        return this.isLogining;
    }
}
