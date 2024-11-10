import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { LoginStatusService } from '../services/login-status.service';

@Injectable({
    providedIn: 'root'
})

export class Permissions
{
    constructor(private router: Router,
                private loginStatusservice: LoginStatusService) {}

    canActivate(): boolean {
        const isLoggedIn = this.loginStatusservice.getLogin();

        if (!isLoggedIn) {
            return false;
        }
        return true;
    }
}
