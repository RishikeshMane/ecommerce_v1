import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ProductList } from '../model/product-list.model';
import { ECommerceUtils } from '../utilities/eCommerce-utils';

@Injectable({
    providedIn: 'root'
})

export class ProductsService
{
    readonly getProductsUrl = ECommerceUtils.FILEHOSTING + 'Products/GetProducts';
    readonly getSearchProductsUrl = ECommerceUtils.FILEHOSTING + 'Products/GetSearchProducts';
    readonly getCitiesUrl = ECommerceUtils.HOSTING + 'Products/GetCities';
    readonly getPincodesUrl = ECommerceUtils.HOSTING + 'Products/GetPincodes';
    readonly getStoresUrl = ECommerceUtils.HOSTING + 'Products/GetStores';

    constructor(private http: HttpClient) { }

    getProducts(category: string, subCategory: string): Observable<ProductList>
    {
        let city: string = '';
        let pincode: string = '';
        let storename: string = '';

        let parameters = new HttpParams().set('category', category).set('subCategory', subCategory)
                        .set('city', 'null').set('pincode', 'null').set('storename', 'null');
        return this.http.get<ProductList>(this.getProductsUrl, {params: parameters});
    }

    getSearchProducts(search: string): Observable<ProductList>
    {
        let parameters = new HttpParams().set('search', search)
        return this.http.get<ProductList>(this.getSearchProductsUrl, {params: parameters});
    }
    
    getCities(): Observable<string[]>
    {
        return this.http.get<string[]>(this.getCitiesUrl);
    }

    getPincodes(): Observable<number[]>
    {
        return this.http.get<number[]>(this.getPincodesUrl);
    }
    
    getStores(): Observable<string[]>
    {
        return this.http.get<string[]>(this.getStoresUrl);
    }       
}
