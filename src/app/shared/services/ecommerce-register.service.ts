import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CategoryList } from '../model/category-list.model';
import { CountryList } from '../model/country-list.model';
import { Country } from '../model/country.model';
import { State } from '../model/state.model';
import { City } from '../model/city.model';
import { ECommerceUtils } from '../utilities/eCommerce-utils';

@Injectable({
    providedIn: 'root'
})
export class ECommerceRegisterService
{
    readonly updateCategoriesUrl = ECommerceUtils.HOSTING + 'Category/UpsertCategory';
    readonly getCountryUrl = ECommerceUtils.HOSTING + 'Country/GetCountry';
    readonly getTestCountryUrl = ECommerceUtils.HOSTING + 'Country/GetTestCountry';
    readonly getStateUrl = ECommerceUtils.HOSTING + 'Country/GetState';
    readonly getCityUrl = ECommerceUtils.HOSTING + 'Country/GetCity';

    countries: Country[]=[];

    constructor(private http: HttpClient) { }

    getTestCountry(): Observable<Country[]> 
    {
        return this.http.get<Country[]>(this.getTestCountryUrl);
    }

    getCountry(): Observable<Country[]> 
    {
        return this.http.get<Country[]>(this.getCountryUrl);
    }

    getState(): Observable<State[]> 
    {
        return this.http.get<State[]>(this.getStateUrl);
    }

    getCity(): Observable<City[]> 
    {
        return this.http.get<City[]>(this.getCityUrl);
    }
}
