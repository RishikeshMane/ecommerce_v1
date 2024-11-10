import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { SideBarService } from '../shared/services/side-bar.service';
import { LoginStatusService } from '../shared/services/login-status.service';
import { CurrentLoginService } from '../shared/services/current-login.service';
import { ShoppingCartDetails, ShoppingProductDetail } from '../shared/model/shoppingcartdetails.model';
import { ShoppingCartService } from '../shared/services/shopping-cart.service';
import { CartService } from '../shared/services/cart.service';
import { OrderService } from '../shared/services/order-service.service';
import { ECommerceDetails } from '../shared/data/eCommerce-details.data';
import { ECommerceRegisterService } from '../shared/services/ecommerce-register.service';
import { Country } from '../shared/model/country.model';
import { State } from '../shared/model/state.model';
import { City } from '../shared/model/city.model';
import { ShoppingAddress } from '../shared/model/shopping-address.model';
import { ECommerceUtils } from '../shared/utilities/eCommerce-utils';
import swal from 'sweetalert2';

declare var Razorpay: any;
declare var emailjs: any;

@Component({
  selector: 'app-ecommerce-shoppingcart',
  templateUrl: './ecommerce-shoppingcart.component.html',
  styleUrls: ['../app-bagwani.component.css'],
  ///standalone: true,
})

export class ECommerceShoppingCartComponent implements OnInit 
{
  shoppingCartImageUrl: string = 'assets/eCommerce-Images/ShoppingCart/ShoppingCart.jpg';
  isSideBarExpand: boolean = true;

  shoppingCart: ShoppingCartDetails = new ShoppingCartDetails();
  summaryTotal: number=0;
  shippingAddress1: string='';
  shippingAddress2: string='';
  shippingAddress3: string='';
  shippingAddress4: string='';

  allCountries: Country[]=[];
  allStates: State[]=[];
  allCities: City[]=[];  
  countries: string[]=[];
  states: string[]=[];
  cities: string[]=[];

  selectedCountryId:number=0;
  selectedCountry: string='';
  selectedStateId:number=0;
  selectedState: string='';
  selectedCityId: number=0;
  selectedCity: string='';
  pincode: number=0;
  address: string='';
  
  flagCode: string='in';

  shoppingAddress: ShoppingAddress[]=[];

  imageHome: string = "assets/eCommerce-Images";
  imageHomePath: string = ECommerceUtils.FILEHOSTING + 'FileSystem/Product/';

  handlingCharges: number = ECommerceUtils.getHandlingCharges();
  precentageFees: number = ECommerceUtils.getPercentageFees();

  moreAddressCount: number=0;
  shoppingAddressIndex: number=0;
  changeAddressIndex: number=0;

  pincodeRegExp = "^[1-9]{1}[0-9]{2}\\s{0,1}[0-9]{3}$";

  constructor(private router: Router,
    private activatedRoute: ActivatedRoute,
    private eCommerceService: ECommerceRegisterService,
    private sidebarservice: SideBarService,
    private loginStatusservice: LoginStatusService,
    private currentLoginservice: CurrentLoginService,
    private cartservice: CartService,
    private shoppingCartservice: ShoppingCartService,
    public orderservice: OrderService) { }

  ngOnInit(): void 
  {
    this.getSideBar();

    this.sidebarservice.getExpand().subscribe(
      (isExpand)=>{
        this.isSideBarExpand = isExpand;
        this.updateLayout();
      });

    this.updateLayout();
    
    this.getShoppingCartDetails();
    this.getShoppingAddress();
  }

  getShoppingCartDetails()
  {
    let mobileNo = sessionStorage.getItem('mobileno')?.toString() ?? '9999999999';

    this.shoppingCartservice.getShoppingCartDetails(mobileNo).subscribe(
      (response: ShoppingCartDetails) => {
        this.shoppingCart = response;
        this.updateSummaryTotal();
      },
      err => {
        console.log(err);
      }
    );
  }

  getShoppingAddress()
  {
    let mobileNo = sessionStorage.getItem('mobileno')?.toString() ?? '9999999999';

    this.shoppingCartservice.getShoppingAddress(mobileNo).subscribe(
      (response: string[]) => {
        this.moreAddressCount = response.length-1;
        this.shippingAddress1 = response[0];
        if (response.length === 2) {this.shippingAddress2 = response[1]};
        if (response.length === 3) {this.shippingAddress2 = response[1]; this.shippingAddress3 = response[2];};
        if (response.length === 4) {this.shippingAddress2 = response[1]; this.shippingAddress3 = response[2]; this.shippingAddress4 = response[3]};
        this.updateCurrentAddress(this.shoppingAddressIndex);
      },
      (err) => {
        console.log(err);
      }
    );
  }


  getShoppingAddressDetails(index: number)
  {
    let mobileNo = sessionStorage.getItem('mobileno')?.toString() ?? '9999999999';

    this.shoppingCartservice.getShoppingAddressDetails(mobileNo).subscribe(
      (response: ShoppingAddress[]) => {
        this.shoppingAddress = response;
        this.updateSelectedAddress(index);
        this.getCountry();
      },
      (err) => {
        console.log(err);
      }
    );
  }  

  getShoppingCartImage(product: ShoppingProductDetail)
  {
    if (product.image.length > 0)
      return this.imageHomePath + product.userProductId + '~' + product.index.toString() + '~' + product.image;
    else
      return this.imageHome + '/' + 'ShoppingCart' + '/' + 'NoImage.png';
  }

  getSideBar()
  {
    this.isSideBarExpand = this.sidebarservice.getExpanding();
  }

  onDecrementCount(i: number)
  {
    if (this.shoppingCart.productDetail[i].count >= 1)
      --this.shoppingCart.productDetail[i].count;

    this.updateSummaryTotal();
  }

  onIncrementCount(i: number)
  {
    ++this.shoppingCart.productDetail[i].count;

    this.updateSummaryTotal();
  }

  updateSummaryTotal()
  {
    this.summaryTotal = 0;

    this.shoppingCart.productDetail.forEach(product => {
      this.summaryTotal += (product.price * product.count);
    });
  }

  onDeleteProduct(index: number)
  {
    let mobileNo = sessionStorage.getItem('mobileno')?.toString() ?? '9999999999';

    this.shoppingCartservice.deleteProduct(mobileNo, this.shoppingCart.productDetail[index].userProductId, 
          this.shoppingCart.productDetail[index].sizeLinkId, this.shoppingCart.productDetail[index].colorLinkId).subscribe(
      (response: ShoppingCartDetails) => {
        this.shoppingCart = response;
        this.updateSummaryTotal();
        this.cartservice.setUpdate(true);
      },
      err => {
        console.log(err);
      }
    );
  }

  isValidPincode(pincode: number): boolean
  {
    let regexp = new RegExp(this.pincodeRegExp);
    return regexp.test(pincode.toString());
  }

  onShippingAddress(index: number)
  {
    this.shoppingAddressIndex = index;

    this.updateCurrentAddress(index);
  }

  onUpdateAddress()
  {
    let mobileNo = sessionStorage.getItem('mobileno')?.toString() ?? '9999999999';

    let address  = new ShoppingAddress();
    address.selectedCountry = this.selectedCountry;
    address.selectedState = this.selectedState;
    address.selectedCity = this.selectedCity;
    address.pincode = this.pincode;
    address.address = this.address;
    address.flagCode = this.flagCode;

    this.shoppingCartservice.updateAddress(mobileNo, address, this.changeAddressIndex).subscribe(
      (response: string[]) => {
        this.moreAddressCount = response.length-1;
        this.shippingAddress1 = response[0];
        if (response.length === 2) {this.shippingAddress2 = response[1]};
        if (response.length === 3) {this.shippingAddress2 = response[1]; this.shippingAddress3 = response[2];};
        if (response.length === 4) {this.shippingAddress2 = response[1]; this.shippingAddress3 = response[2]; this.shippingAddress4 = response[3]};
        this.updateCurrentAddress(this.shoppingAddressIndex);
    },
    err => {
      console.log(err);
    } 
    );
  }

  updateShippingAddress(addresses: string[])
  {
    ///this.shoppingAddress[0].flagCode = parseFlagCode(addresses[0]);
    ///this.shoppingAddress[0].selectedCountry = parseCity(addresses[0]);
  }

  updateSelectedAddress(index: number)
  {
    if (index === 0)
    {
      this.selectedCountry = ECommerceDetails.getComboDefaultCountry();
      this.selectedCountryId = parseInt(ECommerceDetails.getCountryId(this.selectedCountry)?.toString() ?? '1');
      this.selectedState = ECommerceDetails.getComboDefaultState();
      this.selectedStateId = parseInt(ECommerceDetails.getStateId(this.selectedState)?.toString() ?? '0');  
      this.selectedCity = ECommerceDetails.getComboDefaultCity();
      this.selectedCityId = parseInt(ECommerceDetails.getCityId(this.selectedCity)?.toString() ?? '0');
      
      this.pincode = 0;
      this.address = '';      
      this.flagCode = 'in';
    }
    else
    {
      this.selectedCountryId = this.shoppingAddress[index-1].selectedCountryLinkId;
      this.selectedCountry = this.shoppingAddress[index-1].selectedCountry;
      this.selectedStateId = this.shoppingAddress[index-1].selectedStateLinkId;
      this.selectedState = this.shoppingAddress[index-1].selectedState;    
      this.selectedCityId = this.shoppingAddress[index-1].selectedCityLinkId;
      this.selectedCity = this.shoppingAddress[index-1].selectedCity;
      
      this.pincode = this.shoppingAddress[index-1].pincode;
      this.address = this.shoppingAddress[index-1].address;
      this.flagCode = this.shoppingAddress[index-1].flagCode;
    }
  }

  updateCurrentAddress(index: number)
  {
    let e1 = document.getElementById('shippingAddress1');
    let e2 = document.getElementById('shippingAddress2');
    let e3 = document.getElementById('shippingAddress3');
    let e4 = document.getElementById('shippingAddress4');

    e1?.setAttribute("style", "width:100%; height:100px;");
    e2?.setAttribute("style", "width:100%; height:100px;");
    e3?.setAttribute("style", "width:100%; height:100px;");
    e4?.setAttribute("style", "width:100%; height:100px;");

    if (index === 0 ) e1?.setAttribute("style", "width:100%; height:100px; color: #111111; background-color:#D8FBD8; outline: none; font-weight: bold; border-color: 3px solid #339B7C; box-shadow: 0 0 11px #111111;");
    if (index === 1 ) e2?.setAttribute("style", "width:100%; height:100px; color: #111111; background-color:#D8FBD8; outline: none; font-weight: bold; border-color: 3px solid #339B7C; box-shadow: 0 0 11px #111111;");
    if (index === 2 ) e3?.setAttribute("style", "width:100%; height:100px; color: #111111; background-color:#D8FBD8; outline: none; font-weight: bold; border-color: 3px solid #339B7C; box-shadow: 0 0 11px #111111;");
    if (index === 3 ) e4?.setAttribute("style", "width:100%; height:100px; color: #111111; background-color:#D8FBD8; outline: none; font-weight: bold; border-color: 3px solid #339B7C; box-shadow: 0 0 11px #111111;");

  }

  onChangeAddresss(index: number)
  {
    this.changeAddressIndex = index;
    this.getShoppingAddressDetails(index);
  }
  
  onAddMoreAddresss()
  {
    this.changeAddressIndex = 0;
    this.updateSelectedAddress(this.changeAddressIndex);
    this.getCountry();

    this.changeAddressIndex = this.moreAddressCount+1;
  }

  onDeleteAddresss()
  {
    let mobileNo = sessionStorage.getItem('mobileno')?.toString() ?? '9999999999';

    this.shoppingCartservice.deleteAddress(mobileNo).subscribe(
      (response: string[]) => {
        this.moreAddressCount = response.length-1;
        if (this.shoppingAddressIndex === this.moreAddressCount+1) 
        {
          this.shoppingAddressIndex = this.moreAddressCount;
        }
        this.shippingAddress1 = response[0];
        this.shippingAddress2 = ''; this.shippingAddress3 = ''; this.shippingAddress4 = '';
        if (response.length === 2) {this.shippingAddress2 = response[1]};
        if (response.length === 3) {this.shippingAddress2 = response[1]; this.shippingAddress3 = response[2];};
        if (response.length === 4) {this.shippingAddress2 = response[1]; this.shippingAddress3 = response[2]; this.shippingAddress4 = response[3]};
        this.updateCurrentAddress(this.shoppingAddressIndex);
    },
    err => {
      console.log(err);
    } 
    );
  }

  getSupplierMobileNos()
  {
    let mobileNos: string='';
    this.shoppingCart.productDetail.forEach(cart => {
      if (mobileNos.indexOf(cart.supplierMobileNo.toString()) < 0)
        mobileNos += (cart.supplierMobileNo + ',');
    });

    mobileNos = mobileNos.substring(0, mobileNos.length-1);

    return mobileNos;
  }

  getCountry()
  {
    this.eCommerceService.getCountry()
      .subscribe(
        (response: Country[]) => {
          console.log('Countries received');
          this.updateCountries(response);
          this.getState();
        },
        (error) => {
          console.error(error);
        }
        )
  }

  getState()
  {
    this.eCommerceService.getState()
    .subscribe(
      (response: State[] ) => {
        console.log('States received');
        this.updateStates(response);
        this.getCity();
      },
      (error) => {
        console.error(error);
      }
      )
  } 
  
  getCity()
  {
    this.eCommerceService.getCity()
    .subscribe(
      (response: City[]) => {
        console.log('Cities received');
        this.updateCities(response);
      },
      (error) => {
        console.error(error);
      }
      )
  }
  
  updateCountries(worldCountries: Country[])
  {
    this.allCountries = [];
    this.countries = [];

    worldCountries.forEach(country => {
      this.allCountries.push(country);
      this.countries.push(country.name);
    });
  }

  updateStates(worldStates: State[])
  {
    this.allStates = [];
    this.states = [];

    worldStates.forEach(state => {
      this.allStates.push(state);
      if (state.countryLinkId === this.selectedCountryId)
      {
        this.states.push(state.name);
      }
    });    
  }
  
  updateCities(worldCities: City[])
  {
    this.allCities = [];
    this.cities = [];

    worldCities.forEach(city => {
      this.allCities.push(city);
      if (city.countryLinkId === this.selectedCountryId && city.stateLinkId === this.selectedStateId)
      {
        this.cities.push(city.name);
      }
    });    
  }

  onSelectCountry(selCountry: string)
  {
    let countryId: number=0;
    let stateId: number=0;
    let cityId: number=0;

    this.states = [];
    this.cities = [];

    this.allCountries.filter(country=>{

      if (country.name === selCountry)
      {
        this.flagCode = country.flagCode;
        if (countryId === 0) { countryId = country.countryLinkId; this.selectedCountry = country.name; this.selectedCountryId = country.countryLinkId; };

        this.allStates.filter(state=>{
          if (state.countryLinkId === country.countryLinkId)
          {
            if (stateId === 0) { stateId = state.stateLinkId; this.selectedState = state.name; this.selectedStateId = state.stateLinkId; };
            this.states.push(state.name);

            this.allCities.filter(city=>{
              if (city.stateLinkId === stateId && city.countryLinkId === this.selectedCountryId && this.cities.indexOf(city.name) < 0)
              {
                if (cityId === 0) { cityId = city.cityLinkId; ; this.selectedCity = city.name; this.selectedCityId = city.cityLinkId; };
                this.cities.push(city.name);
              }
            });
          }
        });
      }
    });
  }

  onSelectState(selState: string)
  {
    let stateId: number=0;
    let cityId: number=0;

    this.cities = [];

    this.allStates.filter(state=>{
      if (state.countryLinkId === this.selectedCountryId && state.name === selState)
      {
        if (stateId === 0) { stateId = state.stateLinkId; this.selectedState = state.name; this.selectedStateId = state.stateLinkId; };

        this.allCities.filter(city=>{
          if (city.stateLinkId === stateId && city.countryLinkId === this.selectedCountryId)
          {
            if (cityId === 0) { cityId = city.cityLinkId; ; this.selectedCity = city.name; this.selectedCityId = city.cityLinkId; };
            this.cities.push(city.name);
          }
        });
      }
    });
  }
  
  onSelectCity(selCity: string)
  {
    this.allCities.filter(city=>{
      if (city.name === selCity)
      {
        this.selectedCity = city.name; 
        this.selectedCityId = city.cityLinkId;
      }
    });
  }  

  onProceedPayment()
  {
    this.orderservice.checkAvailabilityAndTotalPayment(this.shoppingCart).subscribe(
      (response: any) => {
        if (this.summaryTotal.toString() !== response.summaryTotal)
        {
          alert('Some products are out of order !! Payments will be adjusted accordingly !!');
        }

        this.summaryTotal = parseInt(response.summaryTotal);
        this.paymentGateway();
      },
      (err) => {
        console.log(err);
      }
    );
  }

  paymentGateway()
  {
    this.orderservice.getPaymentGateway().subscribe(
      (response: any) => {
        if (response.id == 'RazorPay')
          this.proceedRazorPay();
      },
      (err) => {
        console.log(err);
      }
    );
  }

  onCashOnDelivery()
  {
    let mobileNo = sessionStorage.getItem('mobileno')?.toString() ?? '9999999999';
    let order = ECommerceDetails.getRandomString(14);
    sendSMS('COD-'+order, mobileNo, this);
    sendEMail('COD-'+order, this);
    this.addOrder('COD-'+order, '');
  }  

  addOrder(razorpay_order_id: string, razorpay_payment_id: string)
  {
    this.shoppingCart.shoppingAddressIndex = this.shoppingAddressIndex;
    this.shoppingCart.orderId = razorpay_order_id;
    this.shoppingCart.paymentId = razorpay_payment_id;
    this.shoppingCart.clearShoppingCart = 1;

    this.orderservice.addOrder(this.shoppingCart).subscribe(
      (response: any) => {
        console.log('Order added');

        this.router.navigate(['/orderconfirmation/'], {queryParams: {orderId: razorpay_order_id}});
        this.cartservice.setUpdate(true);

        if (response.id === 'Out of Stock')
          alert('Some order may be Out of Stock !! Payments adjusted accordingly !!');

        ///swal.fire('Congratulations', 'Your Order has been placed with Order Id : ' + razorpay_order_id);
        swal.fire({
          title: 'Congratulations',
          text: 'Your Order has been placed with Order Id : ' + razorpay_order_id,
          ///background: '#339B7C',
          confirmButtonText: 'Ok',
          confirmButtonColor: '#339B7C'
        });         
      },
      (err) => {
        console.log(err);
      }
    );
  }

  proceedRazorPay()
  {
    /**
    const razorpayOptions = 
    {
      description: 'Bagwani',
      currency: 'INR',
      amount: 30000,
      name: 'Achinta',
      key: 'rzp_test_X5wvPICarmDtOf',
      image: 'assets/images/welcome.png',
      prefills: 
      {
        name: 'Achinta',
        email: 'achinta.mazumdar@gmail.com',
        phone: '9822637436',
      },
      theme:
      {
        color: '#339B7C',
      },
      modal:
      {
        ondismiss: () =>
        {

        }
      }
    }

    const onSuccess = (paymentId: any) =>
    {

    }

    const onFailure = (error: any) =>
    {
      
    }
    */
    ///Razorpay.open(razorpayOptions, onSuccess, onFailure);

    ///let razorpay: Razorpay = new Razorpay({key_id: 'rzp_test_X5wvPICarmDtOf', key_secret: 'PXgUCCh2LR7slxwM2NVvdzeU'});

    let shippingAddress = '';
    if (this.shoppingAddressIndex === 0)
      shippingAddress = this.shippingAddress1;
    else if (this.shoppingAddressIndex === 1)
      shippingAddress = this.shippingAddress2;
    else if (this.shoppingAddressIndex === 2)
      shippingAddress = this.shippingAddress3;
    else if (this.shoppingAddressIndex === 3)
      shippingAddress = this.shippingAddress4;

    alert('We are using Razorpay payment gateway. \nMake sure your device has internet access to the Razorpay website! www.razorpay.com ! \n\nPlease check your shipping address is correct !\n\n' + shippingAddress);

    ///alert('Make sure your shipping address is correct !'); 
    
    let mobileNo = sessionStorage.getItem('mobileno')?.toString() ?? '9999999999';

    this.orderservice.getOrderNo(mobileNo, this.summaryTotal).subscribe(
      (response: any) => {
        this.payNowRazorPay(response.orderId, response.razorPayKey, this);
      },
      (err) => {
        console.log(err);
      }
    );
  } 
  
  payNowRazorPay(orderId: string, razorPayKey: string, shoppingCartComponent: ECommerceShoppingCartComponent)
  {
    let eCommerceData = ECommerceDetails.geteCommerceDetails();
    let title = eCommerceData[0].title; 

    let mobileNo = sessionStorage.getItem('mobileno')?.toString() ?? '9999999999';
    let firstName = sessionStorage.getItem('user')?.toString() ?? '';
    let lastName = sessionStorage.getItem('lastname')?.toString() ?? '';
    let fullName = firstName + ' ' + lastName
    let email = sessionStorage.getItem('email')?.toString() ?? '';

    let order = 'order_TAiSxbq6B5rlKl'.replace('order_', '');
    let paymentid = 'pay_RTAbazrRXWaK6q4'.replace('pay_', '');
    ///shoppingCartComponent.addOrder('RZ-'+order, 'RZ-'+paymentid);

    let amount: number = (this.summaryTotal) + (this.handlingCharges);
    amount += amount * (ECommerceUtils.getPercentageFees() / 100.0);
    amount = Math.ceil(amount); 

    const Razarpayopt = {
      description: title + ' products',
      currency: 'INR',
      ///amount: (this.summaryTotal * 100) + this.handlingCharges,
      ///amount: (amount * 100),
      name: fullName,
      key: razorPayKey,
      order_id: orderId,
      prefill: {
        name: fullName,
        email: email,
        phone: mobileNo,
      },
      theme:{
        color: '#339B7C'
      },
      modal:{
        ondismiss:() =>{
          console.log('Dismissed');
        }
      },
      handler: function(razorpay_object: any){
        console.log(razorpay_object.razorpay_payment_id);

        let order = razorpay_object.razorpay_order_id.replace('order_', '');
        let paymentid = razorpay_object.razorpay_payment_id.replace('pay_', '');

        sendSMS('RZ-'+order, mobileNo, shoppingCartComponent);
        sendEMail('RZ-'+order, shoppingCartComponent);

        shoppingCartComponent.addOrder('RZ-'+order, 'RZ-'+paymentid);
      },  
    };
  
    let razrpay = Razorpay.open(Razarpayopt);
    razrpay.on('payment.failed', function(response: any){
      console.log(response);
    });
  }

  updateLayout()
  {
    if (this.isSideBarExpand === true){
      document.getElementById('productshome')?.classList.remove('eCommerce-sidebar-home-collapse');
      document.getElementById('productshome')?.classList.add('eCommerce-sidebar-home-expand');

      document.getElementById('productstitle')?.classList.remove('eCommerce-sidebar-home-collapse');
      document.getElementById('productstitle')?.classList.add('eCommerce-sidebar-home-expand');
      
      document.getElementById('productscart')?.classList.remove('eCommerce-sidebar-home-collapse');
      document.getElementById('productscart')?.classList.add('eCommerce-sidebar-home-expand');
      
      document.getElementById('productscartrow')?.classList.remove('eCommerce-sidebar-home-collapse');
      document.getElementById('productscartrow')?.classList.add('eCommerce-sidebar-home-expand');
      
      document.getElementById('productscartshippingaddress')?.classList.remove('eCommerce-sidebar-home-collapse');
      document.getElementById('productscartshippingaddress')?.classList.add('eCommerce-sidebar-home-expand');       

      document.getElementById('about')?.classList.remove('eCommerce-sidebar-home-collapse');
      document.getElementById('about')?.classList.add('eCommerce-sidebar-home-expand');      

      document.getElementById('navbar')?.classList.remove('eCommerce-sidebar-home-collapse');
      document.getElementById('navbar')?.classList.add('eCommerce-sidebar-home-expand');      
    }
    else{    
      document.getElementById('productshome')?.classList.remove('eCommerce-sidebar-home-expand');
      document.getElementById('productshome')?.classList.add('eCommerce-sidebar-home-collapse');

      document.getElementById('productstitle')?.classList.remove('eCommerce-sidebar-home-expand');
      document.getElementById('productstitle')?.classList.add('eCommerce-sidebar-home-collapse');
      
      document.getElementById('productscart')?.classList.remove('eCommerce-sidebar-home-expand');
      document.getElementById('productscart')?.classList.add('eCommerce-sidebar-home-collapse');
      
      document.getElementById('productscartrow')?.classList.remove('eCommerce-sidebar-home-expand');
      document.getElementById('productscartrow')?.classList.add('eCommerce-sidebar-home-collapse');
      
      document.getElementById('productscartshippingaddress')?.classList.remove('eCommerce-sidebar-home-expand');
      document.getElementById('productscartshippingaddress')?.classList.add('eCommerce-sidebar-home-collapse');      

      document.getElementById('about')?.classList.remove('eCommerce-sidebar-home-expand');
      document.getElementById('about')?.classList.add('eCommerce-sidebar-home-collapse'); 
      
      document.getElementById('navbar')?.classList.remove('eCommerce-sidebar-home-expand');
      document.getElementById('navbar')?.classList.add('eCommerce-sidebar-home-collapse');
    }  
  }
}

function sendSMS(orderId: string, mobileNo: string, shoppingCartComponent: ECommerceShoppingCartComponent)
{
  shoppingCartComponent.orderservice.getSMSService().subscribe(
    (response: any) => {
      if (response.id === 'FAST2SMS')
      {
        sendFAST2SMS('Thankyou%20for%20choosing%20Bagwani%20products.%20Your%20Order%20no%20is:%20'+orderId, mobileNo, response.fast2smsKey);
        ///sendFAST2SMSToSupplier('You%20have%20new%20order:%20'+orderId, shoppingCartComponent, response.fast2smsKey);
      }
    },
    (err) => {
      console.log(err);
    }
  );
}

function sendFAST2SMS(msg: string, mobileNos: string, fast2smsKey: string)
{
  ///Fast2SMS Api Key - o9345gnYW7lSmTQf18sDczdeVIZjLavGxPuKRhtAMkJUb2OXrFiRtD5svUP79ugSy8W3KQwHOh0LcNqo
  ///https://docs.fast2sms.com/?javascript#get-method9
  ///https://docs.fast2sms.com/?javascript#quick-sms-api

  var request = new XMLHttpRequest();

  var method = 'GET';
  var url = 'https://www.fast2sms.com/dev/bulkV2?authorization=' + fast2smsKey + '&message=' + msg +'&language=english&route=q&numbers=' + mobileNos;
  ///var url = 'https://www.fast2sms.com/dev/bulkV2?authorization=o9345gnYW7lSmTQf18sDczdeVIZjLavGxPuKRhtAMkJUb2OXrFiRtD5svUP79ugSy8W3KQwHOh0LcNqo&route=q&message=' + msg + '&flash=0&numbers=' + mobileNos;
  var async = true;

  request.open(method, url, async);
  request.onreadystatechange = function(){
    if(request.readyState == 3 && request.status == 200){
      var data = JSON.parse(request.responseText);
    }
  };
  request.send(); 
}

function sendFAST2SMSToSupplier(msg: string, shoppingCartComponent: ECommerceShoppingCartComponent, fast2smsKey: string)
{
  let mobileNos = shoppingCartComponent.getSupplierMobileNos();
  sendFAST2SMS(msg, mobileNos, fast2smsKey);
}

function sendEMail(orderId: string, shoppingCartComponent: ECommerceShoppingCartComponent) 
{
  shoppingCartComponent.orderservice.getEMailService().subscribe(
    (response: any) => {
      if (response.id === 'EMailJS')
        sendEMailJS(orderId, response.eMailJSKeyId, response.eMailJSServiceId, response.eMailJSTemplateId, shoppingCartComponent);
    },
    (err) => {
      console.log(err);
    }
  );
}

function sendEMailJS(orderId: string,
                      eMailJSKeyId: string, 
                      eMailJSServiceId: string, 
                      eMailJSTemplateId: string, 
                      shoppingCartComponent: ECommerceShoppingCartComponent) 
{
  let eCommerceData = ECommerceDetails.geteCommerceDetails();
  let title = eCommerceData[0].title;
  let firstName = sessionStorage.getItem('user')?.toString() ?? '';
  let email = sessionStorage.getItem('email')?.toString() ?? '';

  if (email.length > 0)
  {
    emailjs.init(eMailJSKeyId);

    emailjs.send(eMailJSServiceId, eMailJSTemplateId,{
      from_name: title,
      to_name: firstName,
      product: title,
      orderId: orderId,
      reply_to: email,
      },
      eMailJSKeyId);
  }
}



