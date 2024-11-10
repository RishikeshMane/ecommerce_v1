import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { SideBarService } from '../shared/services/side-bar.service';

@Component({
  selector: 'app-ecommerce-orderconfirmation',
  templateUrl: './ecommerce-orderconfirmation.component.html',
  styleUrls: ['../app-bagwani.component.css'],
  ///standalone: true,
})

export class ECommerceOrderConfirmationComponent implements OnInit 
{
  orderConfirmationImageUrl: string = 'assets/eCommerce-Images/OrderConfirmation/OrderConfirmation.jpg';
  isSideBarExpand: boolean = true;

  orderId: string = "";

  constructor(private router: Router,
    private activatedRoute: ActivatedRoute,
    private sidebarservice: SideBarService
  ) 
  { }

  ngOnInit(): void 
  {
    this.getSideBar();

    this.sidebarservice.getExpand().subscribe(
      (isExpand)=>{
        this.isSideBarExpand = isExpand;
        this.orderId = this.activatedRoute.snapshot.queryParamMap.get('orderId')?.toString() ?? '';

        this.updateLayout();
      });

    this.updateLayout();

    this.orderId = this.activatedRoute.snapshot.queryParamMap.get('orderId')?.toString() ?? '';
  }

  getSideBar()
  {
    this.isSideBarExpand = this.sidebarservice.getExpanding();
  }  

  updateLayout()
  {
    if (this.isSideBarExpand === true){
      document.getElementById('orderconfirmationshome')?.classList.remove('eCommerce-sidebar-home-collapse');
      document.getElementById('orderconfirmationshome')?.classList.add('eCommerce-sidebar-home-expand');

      document.getElementById('orderconfirmationtitle')?.classList.remove('eCommerce-sidebar-home-collapse');
      document.getElementById('orderconfirmationtitle')?.classList.add('eCommerce-sidebar-home-expand');
      
      document.getElementById('orderconfirmationdescription')?.classList.remove('eCommerce-sidebar-home-collapse');
      document.getElementById('orderconfirmationdescription')?.classList.add('eCommerce-sidebar-home-expand');       

      document.getElementById('about')?.classList.remove('eCommerce-sidebar-home-collapse');
      document.getElementById('about')?.classList.add('eCommerce-sidebar-home-expand');      

      document.getElementById('navbar')?.classList.remove('eCommerce-sidebar-home-collapse');
      document.getElementById('navbar')?.classList.add('eCommerce-sidebar-home-expand');      
    }
    else{    
      document.getElementById('orderconfirmationshome')?.classList.remove('eCommerce-sidebar-home-expand');
      document.getElementById('orderconfirmationshome')?.classList.add('eCommerce-sidebar-home-collapse');

      document.getElementById('orderconfirmationtitle')?.classList.remove('eCommerce-sidebar-home-expand');
      document.getElementById('orderconfirmationtitle')?.classList.add('eCommerce-sidebar-home-collapse');
      
      document.getElementById('orderconfirmationdescription')?.classList.remove('eCommerce-sidebar-home-expand');
      document.getElementById('orderconfirmationdescription')?.classList.add('eCommerce-sidebar-home-collapse');        

      document.getElementById('about')?.classList.remove('eCommerce-sidebar-home-expand');
      document.getElementById('about')?.classList.add('eCommerce-sidebar-home-collapse'); 
      
      document.getElementById('navbar')?.classList.remove('eCommerce-sidebar-home-expand');
      document.getElementById('navbar')?.classList.add('eCommerce-sidebar-home-collapse');
    }  
  }
}




