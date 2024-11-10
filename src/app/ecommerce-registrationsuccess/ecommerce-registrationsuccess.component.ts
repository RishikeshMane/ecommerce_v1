import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { SideBarService } from '../shared/services/side-bar.service';

@Component({
  selector: 'app-ecommerce-registrationsuccess',
  templateUrl: './ecommerce-registrationsuccess.component.html',
  styleUrls: ['../app-bagwani.component.css'],
  ///standalone: true,
})

export class ECommerceRegistrationSuccessComponent implements OnInit 
{
  registrationSuccessImageUrl: string = 'assets/eCommerce-Images/RegistrationSuccess/RegistrationSuccess.jpg';
  isSideBarExpand: boolean = true;

  status: string = "done";

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

    this.status = this.activatedRoute.snapshot.queryParamMap.get('status')?.toString() ?? 'done';
    
  }

  getSideBar()
  {
    this.isSideBarExpand = this.sidebarservice.getExpanding();
  }  

  updateLayout()
  {
    if (this.isSideBarExpand === true){
      document.getElementById('registrationsuccesshome')?.classList.remove('eCommerce-sidebar-home-collapse');
      document.getElementById('registrationsuccesshome')?.classList.add('eCommerce-sidebar-home-expand');

      document.getElementById('registrationsuccesstitle')?.classList.remove('eCommerce-sidebar-home-collapse');
      document.getElementById('registrationsuccesstitle')?.classList.add('eCommerce-sidebar-home-expand');
      
      document.getElementById('registrationsuccessdescription')?.classList.remove('eCommerce-sidebar-home-collapse');
      document.getElementById('registrationsuccessdescription')?.classList.add('eCommerce-sidebar-home-expand');       

      document.getElementById('about')?.classList.remove('eCommerce-sidebar-home-collapse');
      document.getElementById('about')?.classList.add('eCommerce-sidebar-home-expand');      

      document.getElementById('navbar')?.classList.remove('eCommerce-sidebar-home-collapse');
      document.getElementById('navbar')?.classList.add('eCommerce-sidebar-home-expand');      
    }
    else{    
      document.getElementById('registrationsuccesshome')?.classList.remove('eCommerce-sidebar-home-expand');
      document.getElementById('registrationsuccesshome')?.classList.add('eCommerce-sidebar-home-collapse');

      document.getElementById('registrationsuccesstitle')?.classList.remove('eCommerce-sidebar-home-expand');
      document.getElementById('registrationsuccesstitle')?.classList.add('eCommerce-sidebar-home-collapse');
      
      document.getElementById('registrationsuccessdescription')?.classList.remove('eCommerce-sidebar-home-expand');
      document.getElementById('registrationsuccessdescription')?.classList.add('eCommerce-sidebar-home-collapse');        

      document.getElementById('about')?.classList.remove('eCommerce-sidebar-home-expand');
      document.getElementById('about')?.classList.add('eCommerce-sidebar-home-collapse'); 
      
      document.getElementById('navbar')?.classList.remove('eCommerce-sidebar-home-expand');
      document.getElementById('navbar')?.classList.add('eCommerce-sidebar-home-collapse');
    }  
  }
}




