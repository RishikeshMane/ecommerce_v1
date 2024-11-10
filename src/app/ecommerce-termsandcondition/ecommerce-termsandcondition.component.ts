import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { SideBarService } from '../shared/services/side-bar.service';

@Component({
  selector: 'app-ecommerce-termsandcondition',
  templateUrl: './ecommerce-termsandcondition.component.html',
  styleUrls: ['../app-bagwani.component.css'],
  ///standalone: true,
})

export class ECommerceTermsAndConditionComponent implements OnInit 
{
  termsAndConditionImageUrl: string = 'assets/eCommerce-Images/TermsAndCondition/TermsAndCondition.jpg';
  isSideBarExpand: boolean = true;

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

        this.updateLayout();
      });

    this.updateLayout();
  }

  getSideBar()
  {
    this.isSideBarExpand = this.sidebarservice.getExpanding();
  }  

  updateLayout()
  {
    if (this.isSideBarExpand === true){
      document.getElementById('home')?.classList.remove('eCommerce-sidebar-home-collapse');
      document.getElementById('home')?.classList.add('eCommerce-sidebar-home-expand');

      document.getElementById('title')?.classList.remove('eCommerce-sidebar-home-collapse');
      document.getElementById('title')?.classList.add('eCommerce-sidebar-home-expand');
      
      document.getElementById('description')?.classList.remove('eCommerce-sidebar-home-collapse');
      document.getElementById('description')?.classList.add('eCommerce-sidebar-home-expand');       

      document.getElementById('about')?.classList.remove('eCommerce-sidebar-home-collapse');
      document.getElementById('about')?.classList.add('eCommerce-sidebar-home-expand');      

      document.getElementById('navbar')?.classList.remove('eCommerce-sidebar-home-collapse');
      document.getElementById('navbar')?.classList.add('eCommerce-sidebar-home-expand');      
    }
    else{    
      document.getElementById('home')?.classList.remove('eCommerce-sidebar-home-expand');
      document.getElementById('home')?.classList.add('eCommerce-sidebar-home-collapse');

      document.getElementById('title')?.classList.remove('eCommerce-sidebar-home-expand');
      document.getElementById('title')?.classList.add('eCommerce-sidebar-home-collapse');
      
      document.getElementById('description')?.classList.remove('eCommerce-sidebar-home-expand');
      document.getElementById('description')?.classList.add('eCommerce-sidebar-home-collapse');        

      document.getElementById('about')?.classList.remove('eCommerce-sidebar-home-expand');
      document.getElementById('about')?.classList.add('eCommerce-sidebar-home-collapse'); 
      
      document.getElementById('navbar')?.classList.remove('eCommerce-sidebar-home-expand');
      document.getElementById('navbar')?.classList.add('eCommerce-sidebar-home-collapse');
    }  
  }
}




