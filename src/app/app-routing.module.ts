import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ECommerceHomeComponent } from 'src/app/ecommerce-home/ecommerce-home.component';
import { ECommerceLoginComponent } from 'src/app/ecommerce-login/ecommerce-login.component';
import { ECommerceRegisterComponent } from 'src/app/ecommerce-register/ecommerce-register.component';
import { ECommerceEditRegisterComponent } from 'src/app/ecommerce-editregister/ecommerce-editregister.component';
import { ECommerceInventoryComponent } from 'src/app/ecommerce-inventory/ecommerce-inventory.component';
import { ECommerceAddInventoryComponent } from 'src/app/ecommerce-addinventory/ecommerce-addinventory.component';
import { ECommerceProductDetailComponent } from 'src/app/ecommerce-productdetail/ecommerce-productdetail.component';
import { ECommerceProductsComponent } from 'src/app/ecommerce-products/ecommerce-products.component';
import { ECommerceExistingProductComponent } from 'src/app/ecommerce-existingproduct/ecommerce-existingproduct.component';
import { ECommerceSearchProductsComponent } from './ecommerce-searchproducts/ecommerce-searchproducts.component';
import { ECommerceShoppingCartComponent } from './ecommerce-shoppingcart/ecommerce-shoppingcart.component';
import { ECommerceOrderConfirmationComponent } from './ecommerce-orderconfirmation/ecommerce-orderconfirmation.component';
import { ECommerceOrderStatusComponent } from './ecommerce-orderstatus/ecommerce-orderstatus.component';
import { ECommerceOrdersComponent } from './ecommerce-orders/ecommerce-orders.component';
import { ECommerceOrderHistoryComponent } from './ecommerce-orderhistory/ecommerce-orderhistory.component';
import { ECommerceSupplierPaymentComponent } from './ecommerce-supplierpayment/ecommerce-supplierpayment.component';
import { ECommerceCompanyPaymentComponent } from './ecommerce-companypayment/ecommerce-companypayment.component';
import { ECommerceRegistrationSuccessComponent } from './ecommerce-registrationsuccess/ecommerce-registrationsuccess.component';

import { Permissions } from './shared/authentication/permission';
import { CurrentLogin } from './shared/authentication/currentlogin';
import { ECommerceTermsAndConditionComponent } from './ecommerce-termsandcondition/ecommerce-termsandcondition.component';
import { ECommercePrivacyPolicyComponent } from './ecommerce-privacypolicy/ecommerce-privacypolicy.component';

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forRoot([
    {
      path: 'home', component: ECommerceHomeComponent 
    },
    {
      path: 'home/:loginStatus', component: ECommerceHomeComponent 
    },    
    {
      path: 'register', component: ECommerceRegisterComponent 
    },
    {
      path: 'editregister', component: ECommerceEditRegisterComponent 
    }, 
    {
      path: 'inventory', component: ECommerceInventoryComponent 
    },
    {
      path: 'existingproduct', /*canActivate: [Permissions],*/ component: ECommerceExistingProductComponent 
    },    
    {
      path: 'addinventory', component: ECommerceAddInventoryComponent 
    },
    {
      path: 'products', component: ECommerceProductsComponent 
    },
    {
      path: 'searchproducts', /*canActivate: [CurrentLogin],*/ component: ECommerceSearchProductsComponent 
    },    
    {
      path: 'productdetail', component: ECommerceProductDetailComponent 
    },
    {
      path: 'shoppingcart', component: ECommerceShoppingCartComponent 
    },
    {
      path: 'orderconfirmation', component: ECommerceOrderConfirmationComponent 
    },
    {
      path: 'orderstatus', component: ECommerceOrderStatusComponent 
    },    
    {
      path: 'orders', component: ECommerceOrdersComponent 
    },
    {
      path: 'orderhistory', component: ECommerceOrderHistoryComponent
    },    
    {
      path: 'supplierpayment', component: ECommerceSupplierPaymentComponent 
    },
    {
      path: 'companypayment', component: ECommerceCompanyPaymentComponent 
    }, 
    {
      path: 'registrationsuccess', component: ECommerceRegistrationSuccessComponent 
    },
    {
      path: 'termsandcondition', component: ECommerceTermsAndConditionComponent 
    },
    {
      path: 'privacypolicy', component: ECommercePrivacyPolicyComponent 
    },     
    {
      path: '**', component: ECommerceHomeComponent 
    },   
  ])],
  exports: [RouterModule]
})
export class AppRoutingModule { }
