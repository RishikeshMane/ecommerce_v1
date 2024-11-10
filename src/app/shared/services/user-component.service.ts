import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserDetail } from '../model/user-detail.model';
import { ECommerceUtils } from '../utilities/eCommerce-utils';
import { ChangePassword } from '../model/change.password';
import { TestDetail } from '../model/test-detail.model';

@Injectable({
    providedIn: 'root'
})
export class UserComponentService
{
    constructor(private http: HttpClient) { }

    readonly getUserUrl = ECommerceUtils.HOSTING + 'User/GetUser';
    readonly updateUserUrl = ECommerceUtils.HOSTING + 'User/UpsertUser';
    readonly updateRegisteredUserUrl = ECommerceUtils.HOSTING + 'User/UpsertRegisteredUser';
    readonly getLoginUrl = ECommerceUtils.HOSTING + 'User/GetLoginUrl';
    readonly changePasswordUrl = ECommerceUtils.HOSTING + 'User/ChangePassword';
    readonly resetPasswordUrl = ECommerceUtils.HOSTING + 'User/ResetPassword';
    readonly updateTestUrl = ECommerceUtils.HOSTING + 'User/UpsertTest';

    getUser(mobileno: string): Observable<UserDetail>
    {
        let parameters = new HttpParams().set('mobileno', mobileno);
        return this.http.get<UserDetail>(this.getUserUrl, {params: parameters});
    }

    updateUsers(user: UserDetail): Observable<string>
    {
        return this.http.post<string>(this.updateUserUrl, user);
    }

    updateRegisteredUsers(user: UserDetail): Observable<string>
    {
        return this.http.post<string>(this.updateRegisteredUserUrl, user);
    }    

    getLoginResponse(loginPhone: string, loginPassword: string): Observable<any>
    {
        let parameters = new HttpParams().set('number', loginPhone).set('password', loginPassword);
        return this.http.get<any>(this.getLoginUrl, {params: parameters});
    }

    changePassword(password: ChangePassword): Observable<string>
    {
        return this.http.post<string>(this.changePasswordUrl, password);
    }

    resetPassword(password: ChangePassword): Observable<string>
    {
        return this.http.post<string>(this.resetPasswordUrl, password);
    }
    
    updateTest(user: TestDetail): Observable<string>
    {
        return this.http.post<string>(this.updateTestUrl, user);
    }    
}
