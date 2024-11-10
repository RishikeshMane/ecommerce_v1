import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CategoryList } from '../model/category-list.model';
import { CountryList } from '../model/country-list.model';
import { City } from '../model/city.model';
import { ECommerceUtils } from '../utilities/eCommerce-utils';
import { PaymentGatewayList } from '../model/paymentgateway-list.model';
import { SMSServiceList } from '../model/smsservice-list.model';
import { EMailServiceList } from '../model/emailservice-list.model';
import { OrderStatusList } from '../model/orderstatus-list.model';

@Injectable({
    providedIn: 'root'
})
export class AppComponentService
{
    constructor(private http: HttpClient) { }

    readonly updateCategoriesUrl = ECommerceUtils.HOSTING + 'Category/UpsertCategory';
    readonly updateCountryUrl = ECommerceUtils.HOSTING + 'Country/UpsertCountry';
    readonly updateUserRoleUrl = ECommerceUtils.HOSTING + 'User/UpsertUserRole';
    readonly updateAdminUrl = ECommerceUtils.HOSTING + 'User/UpsertAdmin';
    readonly getCitiesUrl = ECommerceUtils.HOSTING + 'Country/GetCitiesOfCountry';
    readonly updatePaymentGatewayUrl = ECommerceUtils.HOSTING + 'Product/UpdatePaymentGateway';
    readonly updateSMSServiceUrl = ECommerceUtils.HOSTING + 'Product/UpdateSMSService';
    readonly updateEMailServiceUrl = ECommerceUtils.HOSTING + 'Product/UpdateEmailService';
    readonly updateOrderStausUrl = ECommerceUtils.HOSTING + 'Product/UpdateOrderStatus';

    updateCategories(categories: CategoryList)
    {
        return this.http.post(this.updateCategoriesUrl, categories);
    }

    updateCountries(countries: CountryList)
    {
        return this.http.post(this.updateCountryUrl, countries);
    }  
    
    updateUserRoles(userRoles: string[])
    {
        return this.http.post(this.updateUserRoleUrl, userRoles);
    }

    updateAdmin()
    {
        let dummy: string[] = ['null'];
        return this.http.post(this.updateAdminUrl, dummy);
    }

    getCities(country: string): Observable<City[]>
    {
        let parameters = new HttpParams().set('country', country);
        return this.http.get<City[]>(this.getCitiesUrl, {params: parameters});
    }

    updatePaymentGateway(paymentGateways: PaymentGatewayList): Observable<string>
    {
        return this.http.post<string>(this.updatePaymentGatewayUrl, paymentGateways);
    }

    updateSMSService(smsServices: SMSServiceList): Observable<string>
    {
        return this.http.post<string>(this.updateSMSServiceUrl, smsServices);
    }

    updateEMailService(eMailServices: EMailServiceList): Observable<string>
    {
        return this.http.post<string>(this.updateEMailServiceUrl, eMailServices);
    }
    
    updateOrderStaus(orderStatus: OrderStatusList): Observable<string>
    {
        return this.http.post<string>(this.updateOrderStausUrl, orderStatus);
    }
}
