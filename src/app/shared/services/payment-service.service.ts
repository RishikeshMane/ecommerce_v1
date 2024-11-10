import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ProductList } from '../model/product-list.model';
import { ECommerceUtils } from '../utilities/eCommerce-utils';
import { ShoppingCart } from '../model/shoppingcart.model';
import { ShoppingCartDetails } from '../model/shoppingcartdetails.model';
import { UserOrderDetail } from '../model/userorder-detail.model';
import { PaymentStatusList } from '../model/paymentstatus-list.model';
import { PaymentRangeList } from '../model/paymentrange-list.model';
import { SupplierPaymentDetail } from '../model/supplierpayment-detail.model';
import { SupplierInfo } from '../model/supplierInfo.model';

@Injectable({
    providedIn: 'root'
})

export class PaymentService
{
    readonly updatePaymentStatusUrl = ECommerceUtils.HOSTING + 'Payment/UpdatePaymentStatus';
    readonly updatePaymentsStatusSupplierUrl = ECommerceUtils.HOSTING + 'Payment/UpdatePaymentsSupplier';
    readonly updatePaymentRangeUrl = ECommerceUtils.HOSTING + 'Payment/UpdatePaymentRange';
    readonly getSupplierPaymentsUrl = ECommerceUtils.HOSTING + 'Payment/GetSupplierPayments';
    readonly getCompanyPaymentsUrl = ECommerceUtils.HOSTING + 'Payment/GetCompanyPayments';
    readonly getSupplierInfoUrl = ECommerceUtils.HOSTING + 'Payment/GetSupplierInfo';

    constructor(private http: HttpClient) { }

    updatePaymentStatus(paymentStatus: PaymentStatusList): Observable<string>
    {
        return this.http.post<string>(this.updatePaymentStatusUrl, paymentStatus);
    }
    
    updatePaymentRange(paymentRange: PaymentRangeList): Observable<string>
    {
        return this.http.post<string>(this.updatePaymentRangeUrl, paymentRange);
    }

    getCompanyPayments(mobileNo: string, fromDate: string, toDate: string, isCashOnDelivery: string): Observable<SupplierPaymentDetail[]>
    {
        let parameters = new HttpParams().set('mobileNo', mobileNo).set('fromDate', fromDate).set('toDate', toDate).set('onlyCOD', isCashOnDelivery);

        return this.http.get<SupplierPaymentDetail[]>(this.getCompanyPaymentsUrl, {params: parameters});
    }    

    getSupplierPayments(mobileNo: string, fromDate: string, toDate: string, isCashOnDelivery: string): Observable<SupplierPaymentDetail[]>
    {
        let parameters = new HttpParams().set('mobileNo', mobileNo).set('fromDate', fromDate).set('toDate', toDate).set('onlyCOD', isCashOnDelivery);

        return this.http.get<SupplierPaymentDetail[]>(this.getSupplierPaymentsUrl, {params: parameters});
    }

    updatePaymentsStatusSupplier(userOrderId: string, mobileno: string, price: string, paymentStatusLinkId: string, payment: string, updatedPaymentDate: string,
                            transactionId: string, comments: string): Observable<any>
    {
        let parameters = new HttpParams().set('userOrderId', userOrderId).set('mobileno', mobileno).set('price', price)
                            .set('paymentStatusLinkId', paymentStatusLinkId).set('payment', payment).set('updatedPaymentDate', updatedPaymentDate)
                            .set('transactionId', transactionId).set('comments', comments);

        return this.http.post<any>(this.updatePaymentsStatusSupplierUrl, userOrderId, {params: parameters});
    }

    getSupplierInfo(): Observable<SupplierInfo[]>
    {
        return this.http.get<SupplierInfo[]>(this.getSupplierInfoUrl);
    }
}
