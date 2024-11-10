import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { SideBarService } from '../shared/services/side-bar.service';
import { UserOrderDetail } from '../shared/model/userorder-detail.model';
import { OrderService } from '../shared/services/order-service.service';
import { ECommerceDetails } from '../shared/data/eCommerce-details.data';
import { NgbDatepicker } from '@ng-bootstrap/ng-bootstrap';
import { PaymentService } from '../shared/services/payment-service.service';
import { SupplierPaymentDetail } from '../shared/model/supplierpayment-detail.model';
import { ECommerceUtils } from '../shared/utilities/eCommerce-utils';

@Component({
  selector: 'app-ecommerce-supplierpayment',
  templateUrl: './ecommerce-supplierpayment.component.html',
  styleUrls: ['../app-bagwani.component.css']
})

export class ECommerceSupplierPaymentComponent implements OnInit
{
  selectedPaymentStatus: string = '';
  updatedIndex: number=0;

  paymentData: any[]=[];
  paymentCount: number=10;
  paymentLimit: number=10;

  isCashOnDelivery: boolean=false;

  supplierPaymentDetail: SupplierPaymentDetail = new SupplierPaymentDetail;
  paymentCODStatuses: string[]=[];
  paymentNonCODStatuses: string[]=[];

  fromDate: string="yyyy-mm-dd";
  toDate: string="yyyy-mm-dd";
  updatedPaymentDate: string="0000-00-00";
  dDate: string = "yyyy-mm-dd";
  disableDate:string = 'false';
  disableTransactionId:string = 'false';

  isSideBarExpand: boolean = true;

  commentWidth: number=110;

  constructor(private router: Router,
              private sidebarservice: SideBarService,
              private orderService: OrderService,
              private paymentService: PaymentService
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

    ECommerceDetails.getPaymentStatus().forEach( paymentStatus => {
      if (paymentStatus.PaymentStatusLinkId == "1" || paymentStatus.PaymentStatusLinkId == "3" ||
          paymentStatus.PaymentStatusLinkId == "4" || paymentStatus.PaymentStatusLinkId == "5")
        this.paymentCODStatuses.push(paymentStatus.PaymentStatus);
      
        if (paymentStatus.PaymentStatusLinkId == "1" || paymentStatus.PaymentStatusLinkId == "2" ||
          paymentStatus.PaymentStatusLinkId == "4" || paymentStatus.PaymentStatusLinkId == "5" ||
          paymentStatus.PaymentStatusLinkId == "6")
        this.paymentNonCODStatuses.push(paymentStatus.PaymentStatus);
    });

    this.paymentService.getSupplierPayments(mobileno, '2024-01-01', '2050-12-12', this.isCashOnDelivery === true ? 'true' : 'false')
    .subscribe(
      (response: SupplierPaymentDetail[]) => {
        console.log('Payments received');
        this.updatePaymentDetail(response);
      },
      (error) => {
        console.error(error);
      }
      )       
  }

  updatePaymentDetail(paymentDetails : SupplierPaymentDetail[] )
  {
    let index = 1;
    this.paymentData = [];
    paymentDetails.forEach(paymentDetail => {
      
      let paymentData = {
                          "id": "",
                          "userOrderid": "",
                          "price": "",
                          "orderDate": "",
                          "deliveryStatus": "",
                          "paymentStatus": "",
                          "payment": "",
                          "paymentDate": "",                         
                          "transactionId": "",
                          "comments": "",                                                                               
                        };

      paymentData.id = index.toString();
      paymentData.userOrderid = paymentDetail.userOrderId;
      paymentData.price = paymentDetail.price;
      paymentData.orderDate = paymentDetail.orderDate;
      paymentData.deliveryStatus = paymentDetail.deliveryStatus;

      if (paymentData.userOrderid.indexOf('COD-') == 0)
        paymentData.paymentStatus = paymentDetail.supplierPaymentStatus;
      else
        paymentData.paymentStatus = paymentDetail.companyPaymentStatus;

      if (paymentData.userOrderid.indexOf('COD-') == 0)
        paymentData.payment = paymentDetail.supplierPayment;
      else
        paymentData.payment = paymentDetail.companyPayment;

      if (paymentData.userOrderid.indexOf('COD-') == 0)
        paymentData.paymentDate = paymentDetail.supplierPaymentDate;
      else
        paymentData.paymentDate = paymentDetail.companyPaymentDate;

      if (paymentDetail.transactionId !== 'TX')
        paymentData.transactionId = paymentDetail.transactionId;
      
      if (paymentDetail.comments !== 'CO')
        paymentData.comments = paymentDetail.comments;         

      index++;
      this.paymentData.push(paymentData); 
      });

  }
  
  getPayments()
  {
    let mobileno = sessionStorage.getItem('mobileno')?.toString() ?? '9999999999';

    this.paymentService.getSupplierPayments(mobileno, this.fromDate, this.toDate, this.isCashOnDelivery == true ? 'true' : 'false')
    .subscribe(
      (response: SupplierPaymentDetail[]) => {
        console.log('Payments received');
        this.updatePaymentDetail(response);
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

  onOrderSelect(supplierPaymentDetail: any)
  {
    this.disableTransactionId = 'false';
    this.disableDate = 'false';
    this.supplierPaymentDetail.userOrderId = supplierPaymentDetail.userOrderid;
    this.supplierPaymentDetail.price = supplierPaymentDetail.price;
    if (this.supplierPaymentDetail.userOrderId.indexOf('COD-') !== 0)
    {
      this.supplierPaymentDetail.companyPayment = supplierPaymentDetail.payment;
      this.supplierPaymentDetail.companyPaymentStatus = supplierPaymentDetail.paymentStatus;
      this.supplierPaymentDetail.companyPaymentDate = supplierPaymentDetail.paymentDate;

      this.dDate = ECommerceUtils.getYYYYMMDD(this.supplierPaymentDetail.companyPaymentDate);

      this.disableDate = 'true';
      this.disableTransactionId = 'true';      
    }
    else
    {
      this.supplierPaymentDetail.supplierPayment = supplierPaymentDetail.payment == '0' ? 
                                                    ECommerceDetails.getPercentagePaymentSupplier(supplierPaymentDetail.price):
                                                    supplierPaymentDetail.payment;
      this.supplierPaymentDetail.supplierPaymentStatus = supplierPaymentDetail.paymentStatus;
      this.supplierPaymentDetail.supplierPaymentDate = supplierPaymentDetail.paymentDate;

      this.dDate = ECommerceUtils.getYYYYMMDD(this.supplierPaymentDetail.supplierPaymentDate);

      if (supplierPaymentDetail.paymentStatus === 'Accepted')
      {
        this.disableDate = 'true';
      }
    }

    this.supplierPaymentDetail.orderDate = supplierPaymentDetail.orderDate;
    this.supplierPaymentDetail.deliveryStatus = supplierPaymentDetail.deliveryStatus;
    this.supplierPaymentDetail.transactionId = supplierPaymentDetail.transactionId;
    this.supplierPaymentDetail.comments = supplierPaymentDetail.comments;
    this.selectedPaymentStatus = supplierPaymentDetail.paymentStatus;
    this.updatedIndex = supplierPaymentDetail.id;

    this.updatedPaymentDate="0000-00-00";
    ///this.dDate="0001-01-01";
  }

  onUpdatePayments()
  {
    let mobileno = sessionStorage.getItem('mobileno')?.toString() ?? '9999999999';
    let paymentStatusLinkId = '1';
    let paymentStatuses = 'Unsettled';
    ECommerceDetails.getPaymentStatus().forEach( paymentStatus => {
      if (paymentStatus.PaymentStatus === this.selectedPaymentStatus)
      {
        paymentStatusLinkId = paymentStatus.PaymentStatusLinkId;
        paymentStatuses = paymentStatus.PaymentStatus;
      }
    });

    let payment: any = (this.supplierPaymentDetail.userOrderId.indexOf("COD-") == 0) ? 
                        this.supplierPaymentDetail.supplierPayment :  this.supplierPaymentDetail.companyPayment;
    
    this.paymentService.updatePaymentsStatusSupplier(this.supplierPaymentDetail.userOrderId, mobileno, this.supplierPaymentDetail.price, paymentStatusLinkId, payment, this.updatedPaymentDate,
                                                    this.supplierPaymentDetail.transactionId.trim().length === 0 ? 'TX' : this.supplierPaymentDetail.transactionId,
                                                    this.supplierPaymentDetail.comments.trim().length === 0 ? 'CO' : this.supplierPaymentDetail.comments)
    .subscribe(
      (response) => {
        console.log('Order updated');

        this.paymentData[this.updatedIndex-1].paymentStatus = paymentStatuses;
        this.paymentData[this.updatedIndex-1].payment = payment;
        this.paymentData[this.updatedIndex-1].transactionId = this.supplierPaymentDetail.transactionId;
        this.paymentData[this.updatedIndex-1].comments = this.supplierPaymentDetail.comments;

        if (this.updatedPaymentDate !== '0000-00-00')
        {
          let date: string[] = this.updatedPaymentDate.split('-');
          this.paymentData[this.updatedIndex-1].paymentDate = date[2]+'-'+date[1]+'-'+date[0]+' 00:00:00';
        }
        this.updatedPaymentDate="0000-00-00";
        this.dDate="yyyy-mm-dd";
      },
      (error) => {
        console.error(error);
        this.updatedPaymentDate="0000-00-00";
        this.dDate="yyyy-mm-dd";        
      }
      )
    
  }

  onCancel()
  {
    this.updatedPaymentDate="0000-00-00";
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
      this.getPayments();
  }

  onToDateSelect(event: any)
  {
    this.toDate = event.year + '-';
    this.toDate += ((event.month < 10) ? '0' + event.month : event.month) + '-';
    this.toDate += (event.day < 10) ? '0' + event.day : event.day;

    let from: Date = new Date(this.fromDate);
    let to: Date = new Date(this.toDate);

    if (to > from)
      this.getPayments();
  }

  onPaymentDateSelect(event: any)
  {
    let paymentDate = event.year + '-';
    paymentDate += ((event.month < 10) ? '0' + event.month : event.month) + '-';
    paymentDate += (event.day < 10) ? '0' + event.day : event.day;

    this.updatedPaymentDate = paymentDate;
  }

  onCashOnDelivery(event: any)
  {
    let from: Date = new Date(this.fromDate);
    let to: Date = new Date(this.toDate);

    if (to > from)
      this.getPayments();
  }

  onSelectPaymentStatus(paymentStatus: any)
  {
    this.selectedPaymentStatus = paymentStatus;

    if (this.supplierPaymentDetail.userOrderId.indexOf('COD-') === 0)
      this.supplierPaymentDetail.supplierPaymentStatus = paymentStatus;
    else
      this.supplierPaymentDetail.companyPaymentStatus = paymentStatus;
  }  

  updateLayout()
  {
    if (this.isSideBarExpand === true){
      document.getElementById('headingTable')?.classList.remove('eCommerce-sidebar-margin-colapse');
      document.getElementById('headingTable')?.classList.add('eCommerce-sidebar-margin-expand');

      document.getElementById('headingTable2')?.classList.remove('eCommerce-sidebar-margin-colapse');
      document.getElementById('headingTable2')?.classList.add('eCommerce-sidebar-margin-expand');
      
      document.getElementById('payments')?.classList.remove('eCommerce-sidebar-margin-colapse');
      document.getElementById('payments')?.classList.add('eCommerce-sidebar-margin-expand');      

      document.getElementById('paymentTable')?.classList.remove('eCommerce-sidebar-margin-colapse');
      document.getElementById('paymentTable')?.classList.add('eCommerce-sidebar-margin-expand');

      this.commentWidth = 110;
    }
    else{
      document.getElementById('headingTable')?.classList.remove('eCommerce-sidebar-margin-expand');
      document.getElementById('headingTable')?.classList.add('eCommerce-sidebar-margin-colapse');

      document.getElementById('headingTable2')?.classList.remove('eCommerce-sidebar-margin-expand');
      document.getElementById('headingTable2')?.classList.add('eCommerce-sidebar-margin-colapse');

      document.getElementById('payments')?.classList.remove('eCommerce-sidebar-margin-expand');
      document.getElementById('payments')?.classList.add('eCommerce-sidebar-margin-colapse');              
      
      document.getElementById('paymentTable')?.classList.remove('eCommerce-sidebar-margin-expand');
      document.getElementById('paymentTable')?.classList.add('eCommerce-sidebar-margin-colapse');

      this.commentWidth = 246;
    }    
  }
}
