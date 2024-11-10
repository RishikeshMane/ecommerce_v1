import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ProductDetails } from '../model/product-details.model';
import { GoesWellWith } from '../model/goes-wellwith.model';
import { ProductComments } from '../model/product-comments.model';
import { ECommerceUtils } from '../utilities/eCommerce-utils';

@Injectable({
    providedIn: 'root'
})

export class ProductDetailService
{
    readonly getProductDetailUrl = ECommerceUtils.HOSTING + 'ProductDetail/GetProductDetail';
    readonly getGoesWellWithUrl = ECommerceUtils.FILEHOSTING + 'ProductDetail/GetGoesWellWith';
    readonly insertProductCommentUrl = ECommerceUtils.HOSTING + 'ProductDetail/InsertProductComment';
    readonly checkDeliveryUrl = ECommerceUtils.HOSTING + 'ProductDetail/CheckDelivery';

    constructor(private http: HttpClient) { }

    getProductDetail(productId: string): Observable<ProductDetails>
    {
        let parameters = new HttpParams().set('productId', productId);
        return this.http.get<ProductDetails>(this.getProductDetailUrl, {params: parameters});
    }

    getGoesWellWith(productId: string, pincode: string, storeName: string, city: string, goesWell: string): Observable<GoesWellWith[]>
    {
        let parameters = new HttpParams().set('productId', productId).set('pincode', pincode)
                                            .set('storeName', storeName).set('city', city)
                                            .set('goesWell', goesWell);
                                            
        return this.http.get<GoesWellWith[]>(this.getGoesWellWithUrl, {params: parameters});
    }

    insertProductComment(productId: string, userId: string, comment: string, rating: number): Observable<string>
    {
        let productComment = new ProductComments;
        productComment.userProductId = productId;
        productComment.userId = userId;
        productComment.comment = comment;
        productComment.rating = rating;

        return this.http.post<string>(this.insertProductCommentUrl, productComment);
    }

    checkDelivery(pincode: string, productId: string): Observable<string>
    {
        let parameters = new HttpParams().set('pincode', pincode).set('productId', productId);
        return this.http.get<string>(this.checkDeliveryUrl, {params: parameters});
    }
}
