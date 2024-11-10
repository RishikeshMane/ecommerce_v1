import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ECommerceUtils } from '../utilities/eCommerce-utils';
import { ShoppingCart } from '../model/shoppingcart.model';
import { ShoppingCartDetails } from '../model/shoppingcartdetails.model';
import { ShoppingAddress } from '../model/shopping-address.model';

@Injectable({
    providedIn: 'root'
})
export class ShoppingCartService
{
    readonly updateShoppingCartUrl = ECommerceUtils.HOSTING + 'ShoppingCart/UpsertShoppingCart';
    readonly getShoppingCartUrl = ECommerceUtils.FILEHOSTING + 'ShoppingCart/GetShoppingCartDetails';
    readonly deleteProductUrl = ECommerceUtils.FILEHOSTING + 'ShoppingCart/DeleteProduct';
    readonly getShoppingAddressUrl = ECommerceUtils.HOSTING + 'ShoppingCart/GetShoppingAddress';
    readonly getShoppingAddressDetailsUrl = ECommerceUtils.HOSTING + 'ShoppingCart/GetShoppingAddressDetails';
    readonly updateAddressUrl = ECommerceUtils.HOSTING + 'ShoppingCart/UpdateAddress';
    readonly deleteAddressUrl = ECommerceUtils.HOSTING + 'ShoppingCart/DeleteAddress';

    constructor(private http: HttpClient) { }

    updateShoppingCart(shoppingCart: ShoppingCart): Observable<string>
    {
        return this.http.post<string>(this.updateShoppingCartUrl, shoppingCart);
    }

    getShoppingCartDetails(mobileNo: string): Observable<ShoppingCartDetails>
    {
        let parameters = new HttpParams().set('mobileNo', mobileNo);
        return this.http.get<ShoppingCartDetails>(this.getShoppingCartUrl, {params: parameters});
    }

    getShoppingAddress(mobileNo: string): Observable<string[]>
    {
        let parameters = new HttpParams().set('mobileNo', mobileNo);
        return this.http.get<string[]>(this.getShoppingAddressUrl, {params: parameters});
    }

    getShoppingAddressDetails(mobileNo: string): Observable<ShoppingAddress[]>
    {
        let parameters = new HttpParams().set('mobileNo', mobileNo);
        return this.http.get<ShoppingAddress[]>(this.getShoppingAddressDetailsUrl, {params: parameters});
    }    

    deleteProduct(mobileNo: string, userProductId: string, sizeLinkId: number, colorLinkId: number)
    {
        let parameters = new HttpParams().set('mobileNo', mobileNo).set('userProductId', userProductId)
                                            .set('sizeLinkId', sizeLinkId.toString()).set('colorLinkId', colorLinkId.toString());
        return this.http.get<ShoppingCartDetails>(this.deleteProductUrl, {params: parameters});        
    }
    
    updateAddress( mobileNo: string, address: ShoppingAddress, index: number)
    {
        let parameters = new HttpParams().set('mobileNo', mobileNo).set('index', index.toString());
        return this.http.post<string[]>(this.updateAddressUrl, address, {params: parameters});  
    }

    deleteAddress(mobileNo: string)
    {
        let parameters = new HttpParams().set('mobileNo', mobileNo);
        return this.http.post<string[]>(this.deleteAddressUrl, mobileNo, {params: parameters});          
    }
}
