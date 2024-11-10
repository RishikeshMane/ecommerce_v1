import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { SideBarService } from '../shared/services/side-bar.service';
import { UserOrderDetail } from '../shared/model/userorder-detail.model';
import { OrderService } from '../shared/services/order-service.service';
import { ECommerceDetails } from '../shared/data/eCommerce-details.data';
import { NgbDateStruct, NgbDatepicker } from '@ng-bootstrap/ng-bootstrap';
import { ECommerceUtils } from '../shared/utilities/eCommerce-utils';

@Component({
  selector: 'app-ecommerce-orders',
  templateUrl: './ecommerce-orders.component.html',
  styleUrls: ['../app-bagwani.component.css']
})

/**@ViewChild('deliveryDate') deliveryDatePicker: NgbDatepicker;*/

export class ECommerceOrdersComponent implements OnInit
{
  orderData: any[]=[];
  orderCount: number=10;
  orderLimit: number=10;

  userOrderDetail: UserOrderDetail = new UserOrderDetail;
  selectedDeliveryStatus: string = '';
  deliveryStatuses: string[]=[];
  updatedIndex: number=0;

  fromDate: string="yyyy-mm-dd";
  toDate: string="yyyy-mm-dd";
  updatedDeliveryDate: string="0000-00-00";
  dDate: string = "yyyy-mm-dd";

  orderWidth: number=121;
  colorWidth: number=50;
  sizeWidth: number=50;
  addressWidth: number=106;
  titleWidth: number = 106;

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

    ECommerceDetails.getOrderStatus().forEach( orderStatus => {

      if (orderStatus.OrderStatus !== 'Order Cancel')
      {
        this.deliveryStatuses.push(orderStatus.OrderStatus);
      }
    });

    this.orderService.getOrders(mobileno, '2024-01-01', '2050-12-12')
    .subscribe(
      (response: UserOrderDetail[]) => {
        console.log('Orders received');
        this.updateOrderDetail(response);
      },
      (error) => {
        console.error(error);
      }
      ) 
  }

  updateOrderDetail(userOrderDetails : UserOrderDetail[] )
  {
    let index = 1;
    this.orderData = [];
    userOrderDetails.forEach(userOrderDetail => {
      
      let orderData = { 
                          "id": "",
                          "userOrderid": "",
                          "productid": "",
                          "title": "",
                          "address": "",
                          "color": "",
                          "size": "",
                          "price": "",
                          "count": "",
                          "orderDate": "",
                          "deliveryDate": "",
                          "orderStatus": "",                                                                                 
                        };
      
      orderData.id = index.toString();
      orderData.userOrderid = userOrderDetail.userOrderId;
      orderData.productid = userOrderDetail.userProductId;
      orderData.title = userOrderDetail.title;
      orderData.address = userOrderDetail.address;
      orderData.color = userOrderDetail.color;
      orderData.size = userOrderDetail.size;
      orderData.price = userOrderDetail.price;
      orderData.count = userOrderDetail.count;
      orderData.orderDate = userOrderDetail.orderDate;
      orderData.deliveryDate = userOrderDetail.deliveryDate;
      orderData.orderStatus = userOrderDetail.deliveryStatus;          

      index++;
      this.orderData.push(orderData);      
      });
  }
  
  getOrders()
  {
    let mobileno = sessionStorage.getItem('mobileno')?.toString() ?? '9999999999';

    this.orderService.getOrders(mobileno, this.fromDate, this.toDate)
    .subscribe(
      (response: UserOrderDetail[]) => {
        console.log('Orders received');
        this.updateOrderDetail(response);
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

  onSelectDeliveryStatus(deliveryStatus: string)
  {
    this.selectedDeliveryStatus = deliveryStatus;
    this.userOrderDetail.deliveryStatus = deliveryStatus;
  }

  onOrderSelect(userOrderDetail: any)
  {
    this.userOrderDetail.userOrderId = userOrderDetail.userOrderid;
    this.userOrderDetail.userProductId = userOrderDetail.productid;
    this.userOrderDetail.title = userOrderDetail.title;
    this.userOrderDetail.address = userOrderDetail.address;
    this.userOrderDetail.color = userOrderDetail.color;
    this.userOrderDetail.size = userOrderDetail.size;
    this.userOrderDetail.price = userOrderDetail.price;
    this.userOrderDetail.count = userOrderDetail.count;
    this.userOrderDetail.orderDate = userOrderDetail.orderDate;
    this.userOrderDetail.deliveryDate = userOrderDetail.deliveryDate;
    this.selectedDeliveryStatus = userOrderDetail.orderStatus;
    this.userOrderDetail.deliveryStatus = userOrderDetail.orderStatus;
    this.updatedIndex = userOrderDetail.id;

    this.updatedDeliveryDate="0000-00-00";
    ///this.dDate="0001-01-01";
    this.dDate = ECommerceUtils.getYYYYMMDD(this.userOrderDetail.deliveryDate);
  }

  onUpdateOrderStatus()
  {
    let orderStatusLinkId = '1';
    let orderStatuses = 'Order Received';
    ECommerceDetails.getOrderStatus().forEach( orderStatus => {
      if (orderStatus.OrderStatus === this.selectedDeliveryStatus)
      {
        orderStatusLinkId = orderStatus.OrderLinkId;
        orderStatuses = orderStatus.OrderStatus;
      }
    });

    this.orderService.updateOrderStatus(this.userOrderDetail.userOrderId, this.userOrderDetail.userProductId, orderStatusLinkId, this.updatedDeliveryDate)
    .subscribe(
      (response) => {
        console.log('Order updated');
        this.orderData[this.updatedIndex-1].orderStatus = orderStatuses;
        if (this.updatedDeliveryDate !== '0000-00-00')
        {
          let date: string[] = this.updatedDeliveryDate.split('-');
          this.orderData[this.updatedIndex-1].deliveryDate = date[2]+'-'+date[1]+'-'+date[0]+' 00:00:00';
        }
        this.updatedDeliveryDate="0000-00-00";
        this.dDate="yyyy-mm-dd";
      },
      (error) => {
        console.error(error);
        this.updatedDeliveryDate="0000-00-00";
        this.dDate="yyyy-mm-dd";        
      }
      ) 
  }

  onCancel()
  {
    this.updatedDeliveryDate="0000-00-00";
    this.dDate="yyyy-mm-dd";
  }

  onFromDateSelect(event: any)
  {
    this.fromDate = event.year + '-';
    this.fromDate += ((event.month < 10) ? '0' + event.month : event.month) + '-';
    this.fromDate += (event.day < 10) ? '0' + event.day : event.day;

    let from: Date = new Date(this.fromDate);
    let to: Date = new Date(this.toDate);

    if (to > from)
      this.getOrders();
  }

  onToDateSelect(event: any)
  {
    this.toDate = event.year + '-';
    this.toDate += ((event.month < 10) ? '0' + event.month : event.month) + '-';
    this.toDate += (event.day < 10) ? '0' + event.day : event.day;

    let from: Date = new Date(this.fromDate);
    let to: Date = new Date(this.toDate);

    if (to > from)
      this.getOrders();
  }

  onDeliveryDateSelect(event: any)
  {
    let deliveryDate = event.year + '-';
    deliveryDate += ((event.month < 10) ? '0' + event.month : event.month) + '-';
    deliveryDate += (event.day < 10) ? '0' + event.day : event.day;

    this.updatedDeliveryDate = deliveryDate;
  }  

  updateLayout()
  {
    if (this.isSideBarExpand === true){
      document.getElementById('headingTable')?.classList.remove('eCommerce-sidebar-margin-colapse');
      document.getElementById('headingTable')?.classList.add('eCommerce-sidebar-margin-expand');

      document.getElementById('orderTable')?.classList.remove('eCommerce-sidebar-margin-colapse');
      document.getElementById('orderTable')?.classList.add('eCommerce-sidebar-margin-expand');
      
      this.orderWidth = 121;
      this.colorWidth = 50;
      this.sizeWidth = 50;
      this.addressWidth = 106;
      this.titleWidth = 106;
    }
    else{
      document.getElementById('headingTable')?.classList.remove('eCommerce-sidebar-margin-expand');
      document.getElementById('headingTable')?.classList.add('eCommerce-sidebar-margin-colapse');
      
      document.getElementById('orderTable')?.classList.remove('eCommerce-sidebar-margin-expand');
      document.getElementById('orderTable')?.classList.add('eCommerce-sidebar-margin-colapse');

      this.orderWidth = 141;
      this.colorWidth = 70;
      this.sizeWidth = 70;
      this.addressWidth = 266;
      this.titleWidth = 136;
    }    
  }
}
