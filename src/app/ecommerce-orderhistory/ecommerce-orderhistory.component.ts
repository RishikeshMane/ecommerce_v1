import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { SideBarService } from '../shared/services/side-bar.service';
import { UserOrderDetail } from '../shared/model/userorder-detail.model';
import { OrderService } from '../shared/services/order-service.service';
import { ECommerceDetails } from '../shared/data/eCommerce-details.data';
import { NgbDateStruct, NgbDatepicker } from '@ng-bootstrap/ng-bootstrap';
import { ECommerceUtils } from '../shared/utilities/eCommerce-utils';
import { UserOrderDetails, UserOrderHistoryDetail } from '../shared/model/userorderhistory-detail.model';

@Component({
  selector: 'app-ecommerce-orderhistory',
  templateUrl: './ecommerce-orderhistory.component.html',
  styleUrls: ['../app-bagwani.component.css']
})

/**@ViewChild('deliveryDate') deliveryDatePicker: NgbDatepicker;*/

export class ECommerceOrderHistoryComponent implements OnInit
{
  orderData: any[]=[];
  orderCount: number=10;
  orderLimit: number=10;

  orderDetailsData: any[]=[];

  userOrderDetail: UserOrderHistoryDetail = new UserOrderHistoryDetail;
  selectedUserOrderId: string = '';
  updatedIndex: number = 0;

  orderWidth: number=181;
  addressWidth: number=216;

  isSideBarExpand: boolean = true;

  constructor(private router: Router,
              private sidebarservice: SideBarService,
              private orderService: OrderService
              )
              { }

  ngOnInit(): void
  {
    this.getSideBar();

    this.sidebarservice.getExpand().subscribe(
      (isExpand)=>{
        this.isSideBarExpand = isExpand;
        this.updateLayout();
      });

    this.initialize();
    this.updateLayout(); 
  }

  initialize(): void
  {
    let mobileno = sessionStorage.getItem('mobileno')?.toString() ?? '9999999999';

    this.orderService.getOrderHistory(mobileno)
    .subscribe(
      (response: UserOrderHistoryDetail[]) => {
        console.log('OrderHistory received');
        this.updateOrderHistoryDetail(response);
      },
      (error) => {
        console.error(error);
      }
      ) 
  }

  updateOrderHistoryDetail(userOrdeHistory : UserOrderHistoryDetail[] )
  {
    let index = 1;
    this.orderData = [];
    userOrdeHistory.forEach(userOrderDetail => {
      
      let orderData = { 
                          "id": "",
                          "userOrderid": "",
                          "address": "",
                          "price": "",
                          "orderDate": "",
                          "deliveryDate": "",
                          "cancel": true,
                          "orderStatus": "",                                                                                 
                        };
      
      orderData.id = index.toString();
      orderData.userOrderid = userOrderDetail.userOrderId;
      orderData.address = userOrderDetail.address;
      orderData.price = userOrderDetail.price;
      orderData.orderDate = userOrderDetail.orderDate;
      orderData.deliveryDate = userOrderDetail.deliveryDate;
      orderData.cancel = !userOrderDetail.canCancelOrder;
      orderData.orderStatus = userOrderDetail.deliveryStatus;          

      index++;
      this.orderData.push(orderData);      
      });
  }

  updateOrderDetails(userOrderDetails : UserOrderDetails[] )
  {
    let index = 1;
    this.orderDetailsData = [];
    userOrderDetails.forEach(userOrderDetails => {
      
      let orderDetailsData = { 
                          "id": "",
                          "userOrderid": "",
                          "title": "",
                          "color": "",
                          "size": "",
                          "price": "",
                          "quantity": "",                                                                                
                        };
      
      orderDetailsData.id = index.toString();
      orderDetailsData.userOrderid = userOrderDetails.userOrderId;
      orderDetailsData.title = userOrderDetails.title;
      orderDetailsData.color = userOrderDetails.color;
      orderDetailsData.size = userOrderDetails.size;
      orderDetailsData.price = userOrderDetails.price;
      orderDetailsData.quantity = userOrderDetails.quantity;        

      index++;
      this.orderDetailsData.push(orderDetailsData);      
      });
  }

  onOrderSelect(row: any)
  {
    this.selectedUserOrderId = row.userOrderid;
    this.orderService.getOrderDetails(this.selectedUserOrderId)
    .subscribe(
      (response: UserOrderDetails[]) => {
        console.log('Order Details');
        this.updateOrderDetails(response);      
      },
      (error) => {
        console.error(error);
      }
      )    
  }

  onCancelOrderSelect(row: any)
  {
    this.selectedUserOrderId = row.userOrderid;
    this.updatedIndex = row.id;
  }

  onClickCancelOrder()
  {
    this.orderService.cancelOrder(this.selectedUserOrderId)
    .subscribe(
      (response: any) => {
        console.log('Order cancel');
        this.orderData[this.updatedIndex-1].orderStatus = 'Order Cancel';
        this.orderData[this.updatedIndex-1].canCancelOrder = false;

        ///this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
        ///  this.router.navigate(['/orderhistory/'])});         
      },
      (error) => {
        console.error(error);
      }
      )
  }  

  getSideBar()
  {
    this.isSideBarExpand = this.sidebarservice.getExpanding();
  }

  updateLayout()
  {
    if (this.isSideBarExpand === true){
      document.getElementById('headingTable')?.classList.remove('eCommerce-sidebar-margin-colapse');
      document.getElementById('headingTable')?.classList.add('eCommerce-sidebar-margin-expand');

      document.getElementById('orderhistoryTable')?.classList.remove('eCommerce-sidebar-margin-colapse');
      document.getElementById('orderhistoryTable')?.classList.add('eCommerce-sidebar-margin-expand');
      
      this.orderWidth = 181;
      this.addressWidth = 216;
    }
    else{
      document.getElementById('headingTable')?.classList.remove('eCommerce-sidebar-margin-expand');
      document.getElementById('headingTable')?.classList.add('eCommerce-sidebar-margin-colapse');
      
      document.getElementById('orderhistoryTable')?.classList.remove('eCommerce-sidebar-margin-expand');
      document.getElementById('orderhistoryTable')?.classList.add('eCommerce-sidebar-margin-colapse');

      this.orderWidth = 209;
      this.addressWidth = 316;
    }    
  }
}
