import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ProductList } from '../model/product-list.model';
import { ECommerceUtils } from '../utilities/eCommerce-utils';
import { ShoppingCart } from '../model/shoppingcart.model';
import { ShoppingCartDetails } from '../model/shoppingcartdetails.model';
import { UserOrderDetail } from '../model/userorder-detail.model';
import { UserOrderDetails, UserOrderHistoryDetail } from '../model/userorderhistory-detail.model';

@Injectable({
    providedIn: 'root'
})

export class OrderService
{
    readonly getOrderNoUrl = ECommerceUtils.HOSTING + 'Order/GetOrderNo';
    readonly getPaymentGatewayUrl = ECommerceUtils.HOSTING + 'Order/GetPaymentGateway';
    readonly getSMSServiceUrl = ECommerceUtils.HOSTING + 'Order/GetSMSService';
    readonly getEMailServiceUrl = ECommerceUtils.HOSTING + 'Order/GetEMailService';
    readonly addOrderUrl = ECommerceUtils.HOSTING + 'Order/AddOrder';
    readonly getOrdersUrl = ECommerceUtils.HOSTING + 'Order/GetOrders';
    readonly getOrderHistoryUrl = ECommerceUtils.HOSTING + 'Order/GetOrderHistory';
    readonly updateOrderStatusUrl = ECommerceUtils.HOSTING + 'Order/UpdateOrderStatus';
    readonly getOrderStatusUrl = ECommerceUtils.HOSTING + 'Order/GetOrderStatus';
    readonly checkAvailabilityAndTotalPaymentUrl = ECommerceUtils.HOSTING + 'Order/CheckAvailabilityAndTotalPayment';
    readonly cancelOrderUrl = ECommerceUtils.HOSTING + 'Order/CancelOrder';
    readonly getOrderDetailsUrl = ECommerceUtils.HOSTING + 'Order/GetOrderDetails';

    constructor(private http: HttpClient) { }

    getOrderNo(mobileNo: string, summaryTotal: number): Observable<any>
    {
        let parameters = new HttpParams().set('mobileNo', mobileNo).set('summaryTotal', summaryTotal.toString());

        return this.http.get<any>(this.getOrderNoUrl, {params: parameters});
    }
    
    getPaymentGateway(): Observable<any>
    {
        return this.http.get<any>(this.getPaymentGatewayUrl);
    }
    
    getSMSService(): Observable<any>
    {
        return this.http.get<any>(this.getSMSServiceUrl);
    }

    getEMailService(): Observable<any>
    {
        return this.http.get<any>(this.getEMailServiceUrl);
    }

    addOrder(shoppingCart: ShoppingCartDetails): Observable<any>
    {
        return this.http.post<any>(this.addOrderUrl, shoppingCart);
    }

    getOrders(mobileNo: string, fromDate: string, toDate: string): Observable<UserOrderDetail[]>
    {
        let parameters = new HttpParams().set('mobileNo', mobileNo).set('fromDate', fromDate).set('toDate', toDate);

        return this.http.get<UserOrderDetail[]>(this.getOrdersUrl, {params: parameters});
    }

    getOrderHistory(mobileNo: string): Observable<UserOrderHistoryDetail[]>
    {
        let parameters = new HttpParams().set('mobileNo', mobileNo);

        return this.http.get<UserOrderHistoryDetail[]>(this.getOrderHistoryUrl, {params: parameters});
    }

    getOrderDetails(userOrderId: string): Observable<UserOrderDetails[]>
    {
        let parameters = new HttpParams().set('userOrderId', userOrderId);

        return this.http.get<UserOrderDetails[]>(this.getOrderDetailsUrl, {params: parameters});
    }

    cancelOrder(userOrderId: string): Observable<any>
    {
        let parameters = new HttpParams().set('userOrderId', userOrderId);

        return this.http.post<any>(this.cancelOrderUrl, userOrderId, {params: parameters});
    }

    updateOrderStatus(userOrderId: string, productId: string, orderStatusLinkId: string, updatedDeliveryDate: string): Observable<any>
    {
        let parameters = new HttpParams().set('userOrderId', userOrderId).set('productId', productId)
                                            .set('orderStatusLinkId', orderStatusLinkId).set('updatedDeliveryDate', updatedDeliveryDate);

        return this.http.post<any>(this.updateOrderStatusUrl, userOrderId, {params: parameters});
    }

    getOrderStatus(userOrderId: string)
    {
        let parameters = new HttpParams().set('userOrderId', userOrderId);

        return this.http.get<UserOrderDetail[]>(this.getOrderStatusUrl, {params: parameters});
    }

    checkAvailabilityAndTotalPayment(shoppingCart: ShoppingCartDetails): Observable<any>
    {
        shoppingCart.orderId = 'Dummy';
        shoppingCart.paymentId = 'Dummy'
        return this.http.post<any>(this.checkAvailabilityAndTotalPaymentUrl, shoppingCart);
    }
}
