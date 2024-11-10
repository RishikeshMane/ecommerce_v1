import { NgModule } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormBuilder } from '@angular/forms';

import { AppComponentService } from 'src/app/shared/services/app-component.service';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { ECommerceHomeComponent } from 'src/app/ecommerce-home/ecommerce-home.component';
import { ECommerceLoginComponent } from 'src/app/ecommerce-login/ecommerce-login.component';
import { ECommerceRegisterComponent } from 'src/app/ecommerce-register/ecommerce-register.component';
import { ECommerceEditRegisterComponent } from 'src/app/ecommerce-editregister/ecommerce-editregister.component';
import { ECommerceInventoryComponent } from 'src/app/ecommerce-inventory/ecommerce-inventory.component';
import { ECommerceAddInventoryComponent } from 'src/app/ecommerce-addinventory/ecommerce-addinventory.component';
import { ECommerceExistingProductComponent } from 'src/app/ecommerce-existingproduct/ecommerce-existingproduct.component';
import { ECommerceProductDetailComponent } from 'src/app/ecommerce-productdetail/ecommerce-productdetail.component';
import { ECommerceProductsComponent } from 'src/app/ecommerce-products/ecommerce-products.component';
import { ECommerceSearchProductsComponent } from 'src/app/ecommerce-searchproducts/ecommerce-searchproducts.component';
import { ProductVariableComponent} from './shared/reusable/product-variable/product-variable.component';
import { ExistingProductVariableComponent} from './shared/reusable/existingproduct-variable/existingproduct-variable.component';
import { ProductHeaderComponent } from './shared/reusable/product-header/product-header.component';
import { ExistingProductHeaderComponent } from './shared/reusable/existingproduct-header/existingproduct-header.component';
import { ECommerceOrderConfirmationComponent } from './ecommerce-orderconfirmation/ecommerce-orderconfirmation.component';
import { ECommerceOrderStatusComponent } from './ecommerce-orderstatus/ecommerce-orderstatus.component';
import { ECommerceShoppingCartComponent } from './ecommerce-shoppingcart/ecommerce-shoppingcart.component';
import { ECommerceOrdersComponent } from './ecommerce-orders/ecommerce-orders.component';
import { ECommerceOrderHistoryComponent } from './ecommerce-orderhistory/ecommerce-orderhistory.component';
import { ECommerceSupplierPaymentComponent } from './ecommerce-supplierpayment/ecommerce-supplierpayment.component';
import { ECommerceCompanyPaymentComponent } from './ecommerce-companypayment/ecommerce-companypayment.component';
import { ProductAboutComponent } from './shared/reusable/product-about/product-about.component';
import { ProductNavigationComponent } from './shared/reusable/product-navigation/product-navigation.component';
import { ECommerceRegistrationSuccessComponent } from './ecommerce-registrationsuccess/ecommerce-registrationsuccess.component';
import { ECommerceTermsAndConditionComponent } from './ecommerce-termsandcondition/ecommerce-termsandcondition.component';
import { ECommercePrivacyPolicyComponent } from './ecommerce-privacypolicy/ecommerce-privacypolicy.component';
import { CustomInterceptor } from './shared/services/custom-interceptor.service';
import { ECommerceRegisterService } from './shared/services/ecommerce-register.service';
import { EncryptDecryptService } from './shared/services/encrypt-decrypt.service';
import { UserComponentService } from './shared/services/user-component.service';
import { ProductService } from './shared/services/product-service.service';
import { ProductsService } from './shared/services/products-service.service';
import { ShoppingCartService } from './shared/services/shopping-cart.service';
import { ExistingProductService } from './shared/services/existingproduct-service.service';
import { SideBarService } from './shared/services/side-bar.service';
import { LoginStatusService } from './shared/services/login-status.service';
import { HomeService } from './shared/services/home-service.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgxPaginationModule } from 'ngx-pagination';
import { ProductDetailService } from './shared/services/productdetail-service.service';

@NgModule({
  declarations: [
    AppComponent,
    ECommerceHomeComponent,
    ECommerceLoginComponent,
    ECommerceRegisterComponent,
    ECommerceEditRegisterComponent,
    ECommerceInventoryComponent,
    ECommerceExistingProductComponent,
    ECommerceAddInventoryComponent,
    ECommerceProductDetailComponent,
    ECommerceProductsComponent,
    ECommerceSearchProductsComponent,
    ProductVariableComponent,
    ProductHeaderComponent,
    ExistingProductVariableComponent,
    ExistingProductHeaderComponent,
    ECommerceShoppingCartComponent,
    ECommerceOrderConfirmationComponent,
    ECommerceOrderStatusComponent,
    ECommerceOrderHistoryComponent,
    ECommerceOrdersComponent,
    ProductAboutComponent,
    ProductNavigationComponent,
    ECommerceSupplierPaymentComponent,
    ECommerceCompanyPaymentComponent,
    ECommerceRegistrationSuccessComponent,
    ECommerceTermsAndConditionComponent,
    ECommercePrivacyPolicyComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    NgbModule,
    NgxDatatableModule,
    NgxPaginationModule
  ],
  providers: [
    AppComponentService, 
    ECommerceRegisterService,
    UserComponentService,
    EncryptDecryptService,
    ProductService,
    ProductsService,
    ShoppingCartService,
    ProductDetailService,
    ExistingProductService,
    SideBarService,
    HomeService,
    LoginStatusService
    /*{ provide: HTTP_INTERCEPTORS, useClass: CustomInterceptor, multi: true }*/
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
