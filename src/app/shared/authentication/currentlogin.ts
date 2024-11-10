import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { LoginStatusService } from '../services/login-status.service';
import { CurrentLoginService } from '../services/current-login.service';

@Injectable({
    providedIn: 'root'
})

export class CurrentLogin
{
    constructor(private router: Router,
                private loginStatusservice: LoginStatusService,
                private currentLoginservice: CurrentLoginService) {}

    canActivate(): boolean {
        const isLoggedIn = sessionStorage.getItem('isLoginHide');

        if (!isLoggedIn) {
            this.currentLoginservice.setCurrentLogin(true);
            return false;
        }

        this.currentLoginservice.setCurrentLogin(false);
        return true;
    }
}
