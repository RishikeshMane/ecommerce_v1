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
import { PaymentGatewayList } from '../model/paymentgateway-list.model';

@Injectable({
    providedIn: 'root'
})
export class ProductService
{
    readonly updateSizeUrl = ECommerceUtils.HOSTING + 'Product/UpsertSize';
    readonly updateColorUrl = ECommerceUtils.HOSTING + 'Product/UpsertColor';
    readonly updateSizesUrl = ECommerceUtils.HOSTING + 'Product/GetSizes';
    readonly updateColorsUrl = ECommerceUtils.HOSTING + 'Product/GetColors';
    readonly getCategoriesUrl = ECommerceUtils.HOSTING + 'Product/GetCategories';
    readonly getUpsertProductUrl = ECommerceUtils.FILEHOSTING + 'Product/UpsertProduct';
    readonly getProductsUrl = ECommerceUtils.HOSTING + 'Product/GetProducts';
    readonly getProductVariableUrl = ECommerceUtils.HOSTING + 'Product/GetProductVariable';
    readonly deleteProductUrl = ECommerceUtils.FILEHOSTING + 'Product/DeleteProduct';
    readonly uploadImageUrl = ECommerceUtils.FILEHOSTING + 'Product/UploadImage';
    readonly deleteFilesUrl = ECommerceUtils.FILEHOSTING + 'Product/DeleteFiles';
    readonly deleteJunkFilesUrl = ECommerceUtils.FILEHOSTING + 'Product/DeleteJunkFiles';
    readonly copyFilesUrl = ECommerceUtils.FILEHOSTING + 'Product/CopyFiles';
    
    constructor(private http: HttpClient) { }

    updateSize(size: SizeList): Observable<string>
    {
        return this.http.post<string>(this.updateSizeUrl, size);
    }

    updateColor(color: ColorList): Observable<string>
    {
        return this.http.post<string>(this.updateColorUrl, color);
    }

    getSizes(): Observable<SizeDetail[]>
    {
        return this.http.get<SizeDetail[]>(this.updateSizesUrl);
    }
    
    getColors(): Observable<ColorDetail[]>
    {
        return this.http.get<ColorDetail[]>(this.updateColorsUrl);
    }

    getCategories(): Observable<CategoryList>
    {
        return this.http.get<CategoryList>(this.getCategoriesUrl);
    }

    upsertProduct(productDetail: ProductDetail): Observable<string>
    {
        /**
        let formData: FormData = new FormData;
        let product = productDetail.toString();
        formData.append('productDetail', 'mobileno = 9999999');
        formData.append('productDetails', 'mobileno = 0000000');
        formData.append('image', productDetail.files[0]);
        return this.http.post<string>(this.getUpsertProductUrl, formData);
        */
        return this.http.post<string>(this.getUpsertProductUrl, productDetail);
    }

    getProductDetail(userProductId: string): Observable<ProductDetail[]>
    {
        let parameters = new HttpParams().set('userproductid', userProductId);
        return this.http.get<ProductDetail[]>(this.getProductsUrl, {params: parameters});
    }

    getProductVariable(productId: string): Observable<ProductVariable[]>
    {
        let parameters = new HttpParams().set('productId', productId);
        return this.http.get<ProductVariable[]>(this.getProductVariableUrl, {params: parameters});
    }

    deleteProduct(userProductId: string): Observable<string>
    {
        let parameters = new HttpParams().set('userproductid', userProductId);
        return this.http.delete<string>(this.deleteProductUrl, {params: parameters});
    }

    uploadFiles(formData: FormData): Observable<string>
    {
        return this.http.post<string>(this.uploadImageUrl, formData);
    }

    deleteFiles(deleteImage: VariableIndex, mobileno: string): Observable<string>
    {
        let parameters = new HttpParams().set('mobileno', mobileno);
        return this.http.post<string>(this.deleteFilesUrl, deleteImage, {params: parameters});
    }
    
    deleteJunkFiles(mobileno: string, productId: string, addUpdate: string): Observable<string>
    {
        let parameters = new HttpParams().set('mobileno', mobileno).set('productid', productId).set('addUpdate', addUpdate);
        return this.http.get<string>(this.deleteJunkFilesUrl, {params: parameters});
    }

    copyFiles(variableIndex: VariableIndex): Observable<string>
    {
        return this.http.post<string>(this.copyFilesUrl, variableIndex);
    }
}
