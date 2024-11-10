import { Component, OnInit, ElementRef } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { SideBarService } from '../shared/services/side-bar.service';

import Chart from 'chart.js/auto';
import { ChartTypeRegistry } from 'chart.js';
import { OrderService } from '../shared/services/order-service.service';
import { UserOrderDetail } from '../shared/model/userorder-detail.model';

@Component({
  selector: 'app-ecommerce-orderstatus',
  templateUrl: './ecommerce-orderstatus.component.html',
  styleUrls: ['../app-bagwani.component.css'],
  ///standalone: true,
})

export class ECommerceOrderStatusComponent implements OnInit 
{
  orderStatusImageUrl: string = 'assets/eCommerce-Images/OrderStatus/OrderStatus.jpg';
  isSideBarExpand: boolean = true;

  chart: any;
  orderStatusChartId: string='orderStatusChart';
  orderDetails: UserOrderDetail[]=[];
  charts: any[]=[];
  finalCharts: any[]=[];

  orderId: string = "";

  constructor(private router: Router,
    private activatedRoute: ActivatedRoute,
    private sidebarservice: SideBarService,
    private orderservice: OrderService,
    private elementRef: ElementRef
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

    this.updateLayout();
  }

  checkOrder()
  {
    this.orderDetails = [];
    this.orderId = this.orderId.trim();

    this.orderservice.getOrderStatus(this.orderId).subscribe(
      (response: UserOrderDetail[]) => {
        this.orderDetails = response;
        this.plotGraphs();
      },
      err => {
        console.log(err);
      }
    );
  }

  plotGraphs()
  {
    this.charts = [];

    this.orderDetails.forEach(orderDetail => {
      this.plotGraph(orderDetail.userProductId, 'doughnut', orderDetail.deliveryStatus);
    });

    this.updateFinalCharts();

    ///this.plotGraph('933678-1', 'doughnut', 'Order Received');
  }

  plotGraph(id: string, graphType: keyof ChartTypeRegistry, status: string)
  {
    let chart: any;
    ///if (this.chart != null) {this.chart.clear(); this.chart.destroy();};

    let orderReceived = 'rgb(51, 155, 124)';
    let outForDelivery = (status === 'Out for Delivery' || status === 'Delivered')? 'rgb(51, 155, 124)' : 'rgb(200, 200, 200)';
    let delivered = (status === 'Delivered')? 'rgb(51, 155, 124)' : 'rgb(200, 200, 200)';;

    ///chart = new Chart(id, {
      var doughnut = {
      type: graphType,

      data: {
        ///labels: ['Order Received', 'Out for Delivery', 'Delivered'], 
        datasets: [
          {
            label: "Order Status",
            data: ['33','33','33'],
            backgroundColor:  [
              orderReceived,
              outForDelivery,
              delivered
            ],
          },
        ]
      },
      options: {
        aspectRatio:15,
        responsive: true,
      }
    };

    let htmlRef = this.elementRef.nativeElement.select(id);
    this.charts.push(new Chart(htmlRef, doughnut));
  }

  updateFinalCharts()
  {
    this.charts.forEach(chart => {
      ///let htmlRef = this.elementRef.nativeElement.select(`#canvas`+j);
    });

  }

  getSideBar()
  {
    this.isSideBarExpand = this.sidebarservice.getExpanding();
  }  

  updateLayout()
  {
    if (this.isSideBarExpand === true){
      document.getElementById('orderstatushome')?.classList.remove('eCommerce-sidebar-home-collapse');
      document.getElementById('orderstatushome')?.classList.add('eCommerce-sidebar-home-expand');

      document.getElementById('orderstatustitle')?.classList.remove('eCommerce-sidebar-home-collapse');
      document.getElementById('orderstatustitle')?.classList.add('eCommerce-sidebar-home-expand');
      
      document.getElementById('orderstatusdescription')?.classList.remove('eCommerce-sidebar-home-collapse');
      document.getElementById('orderstatusdescription')?.classList.add('eCommerce-sidebar-home-expand');       

      document.getElementById('orderstatus')?.classList.remove('eCommerce-sidebar-home-collapse');
      document.getElementById('orderstatus')?.classList.add('eCommerce-sidebar-home-expand');       

      document.getElementById('about')?.classList.remove('eCommerce-sidebar-home-collapse');
      document.getElementById('about')?.classList.add('eCommerce-sidebar-home-expand');      

      document.getElementById('navbar')?.classList.remove('eCommerce-sidebar-home-collapse');
      document.getElementById('navbar')?.classList.add('eCommerce-sidebar-home-expand');      
    }
    else{    
      document.getElementById('orderstatushome')?.classList.remove('eCommerce-sidebar-home-expand');
      document.getElementById('orderstatushome')?.classList.add('eCommerce-sidebar-home-collapse');

      document.getElementById('orderstatustitle')?.classList.remove('eCommerce-sidebar-home-expand');
      document.getElementById('orderstatustitle')?.classList.add('eCommerce-sidebar-home-collapse');
      
      document.getElementById('orderstatusdescription')?.classList.remove('eCommerce-sidebar-home-expand');
      document.getElementById('orderstatusdescription')?.classList.add('eCommerce-sidebar-home-collapse');        

      document.getElementById('orderstatus')?.classList.remove('eCommerce-sidebar-home-expand');
      document.getElementById('orderstatus')?.classList.add('eCommerce-sidebar-home-collapse');        

      document.getElementById('about')?.classList.remove('eCommerce-sidebar-home-expand');
      document.getElementById('about')?.classList.add('eCommerce-sidebar-home-collapse'); 
      
      document.getElementById('navbar')?.classList.remove('eCommerce-sidebar-home-expand');
      document.getElementById('navbar')?.classList.add('eCommerce-sidebar-home-collapse');
    }  
  }
}




