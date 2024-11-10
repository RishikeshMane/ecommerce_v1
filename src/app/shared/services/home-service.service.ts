import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ECommerceUtils } from '../utilities/eCommerce-utils';

@Injectable({
    providedIn: 'root'
})

export class HomeService
{
    readonly getImageUrls = ECommerceUtils.HOSTING + 'Home/GetImageUrls';
    readonly getLongImageUrls = ECommerceUtils.HOSTING + 'Home/GetLongImageUrls';
    readonly getDealImageUrls = ECommerceUtils.HOSTING + 'Home/GetDealImageUrls';
    readonly getHappyImageUrls = ECommerceUtils.HOSTING + 'Home/GetHappyImageUrls';

    constructor(private http: HttpClient) { }

    getImageLinks(): Observable<string[]>
    {
        return this.http.get<string[]>(this.getImageUrls);
    }
    
    getLongImageLinks(): Observable<string[]>
    {
        return this.http.get<string[]>(this.getLongImageUrls);
    }
    
    getDealImageLinks(): Observable<string[]>
    {
        return this.http.get<string[]>(this.getDealImageUrls);
    }

    getHappyImageLinks(): Observable<string[]>
    {
        return this.http.get<string[]>(this.getHappyImageUrls);
    }    
}
