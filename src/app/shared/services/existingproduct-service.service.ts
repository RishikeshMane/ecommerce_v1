import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserDetail } from '../model/user-detail.model';
import { SizeList } from '../model/size-list.model';
import { ColorList } from '../model/color-list.model';
import { SizeDetail } from '../model/size-detail.model';
import { ColorDetail } from '../model/color-detail.model';
import { CategoryList } from '../model/category-list.model';
import { ProductDetail } from '../model/product-detail.model';
import { ProductVariable } from '../model/product-variable.model';
import { VariableIndex } from '../model/variable-index.model';
import { ECommerceUtils } from '../utilities/eCommerce-utils';

@Injectable({
    providedIn: 'root'
})

export class ExistingProductService
{
    readonly getExistingProductsUrl = ECommerceUtils.HOSTING + 'ExistingProduct/GetProducts';
    readonly getExistingProductsIdsUrl = ECommerceUtils.HOSTING + 'ExistingProduct/GetProductIds';
    readonly getSelectedProductsUrl = ECommerceUtils.HOSTING + 'ExistingProduct/GetSelectedProducts';
    readonly copyProductUrl = ECommerceUtils.FILEHOSTING + 'ExistingProduct/CopyProduct';
    readonly copyProductsUrl = ECommerceUtils.FILEHOSTING + 'ExistingProduct/CopyProducts';

    constructor(private http: HttpClient) { }

    getExistingProductDetails(userProductId: string): Observable<ProductDetail[]>
    {
        let parameters = new HttpParams().set('userproductid', userProductId);
        return this.http.get<ProductDetail[]>(this.getExistingProductsUrl, {params: parameters});
    }

    getExistingProductIds(userProductId: string): Observable<string[]>
    {
        let parameters = new HttpParams().set('userproductid', userProductId);
        return this.http.get<string[]>(this.getExistingProductsIdsUrl, {params: parameters});
    }   
    
    getSelectedProducts(userProductId: string, productId: string): Observable<ProductDetail[]>
    {
        let parameters = new HttpParams().set('userproductid', userProductId).set('productId', productId);
        return this.http.get<ProductDetail[]>(this.getSelectedProductsUrl, {params: parameters});
    }

    copyProduct(mobileNo: string, fromUserProductId: string, toUserProductId: string): Observable<string>
    {
        let parameters = new HttpParams().set('mobileNo', mobileNo).set('fromUserProductId', fromUserProductId).set('toUserProductId', toUserProductId);
        return this.http.get<string>(this.copyProductUrl, {params: parameters});
    }

    copyProducts(mobileNo: string, toBeAddedProductIds: string[], toUserProductId: string): Observable<string>
    {
        let parameters = new HttpParams().set('mobileNo', mobileNo).set('toBeAddedProductIds', toBeAddedProductIds.toString()).set('toUserProductId', toUserProductId);
        return this.http.get<string>(this.copyProductsUrl, {params: parameters});
    }
}
