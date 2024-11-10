import { Component, OnInit } from '@angular/core';
import { ECommerceDetails } from './shared/data/eCommerce-details.data';

import { AppComponentService } from 'src/app/shared/services/app-component.service';
import { CategoryList } from './shared/model/category-list.model';
import { CountryList } from './shared/model/country-list.model';
import { CategoryDetail } from './shared/model/category-detail.model';
import { CountryDetail } from './shared/model/country-detail.model';
import { StateDetail } from './shared/model/state-detail.model';
import { City } from './shared/model/city.model';
import { Router } from '@angular/router';
import { UserComponentService } from './shared/services/user-component.service';
import { EncryptDecryptService } from './shared/services/encrypt-decrypt.service';
import { ProductService } from './shared/services/product-service.service';
import { ExistingProductService } from './shared/services/existingproduct-service.service';
import { SizeList } from './shared/model/size-list.model';
import { SizeDetail } from './shared/model/size-detail.model';
import { ColorList } from './shared/model/color-list.model';
import { ColorDetail } from './shared/model/color-detail.model';
import { SideBarService } from './shared/services/side-bar.service';
import { LoginStatusService } from './shared/services/login-status.service';
import { ECommerceUtils } from './shared/utilities/eCommerce-utils';
import { CurrentLoginService } from './shared/services/current-login.service';
import { ChangePassword } from './shared/model/change.password';

import { timer } from 'rxjs';
import {takeWhile, tap} from 'rxjs/operators';
import { CartService } from './shared/services/cart.service';
import { ShoppingCartService } from './shared/services/shopping-cart.service';
import { ShoppingCartDetails } from './shared/model/shoppingcartdetails.model';
import { PaymentGatewayDetail, PaymentGatewayList } from './shared/model/paymentgateway-list.model';
import { SMSServiceDetail, SMSServiceList } from './shared/model/smsservice-list.model';
import { EMailServiceDetail, EMailServiceList } from './shared/model/emailservice-list.model';
import { OrderStatusDetail, OrderStatusList } from './shared/model/orderstatus-list.model';
import { PaymentService } from './shared/services/payment-service.service';
import { PaymentStatusDetail, PaymentStatusList } from './shared/model/paymentstatus-list.model';
import { PaymentRangeDetail, PaymentRangeList } from './shared/model/paymentrange-list.model';
import { CityDetail } from './shared/model/city-detail.model';
import swal from 'sweetalert2';
import { OrderService } from './shared/services/order-service.service';
import { TestDetail } from './shared/model/test-detail.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app-bagwani.component.css']
})
export class AppComponent implements OnInit {

  title = ' eCommerce';
  categories: any = [];
  countries: any = [];
  userRoles: any = [];
  size: any = [];
  color: any = [];
  plusMinus: any = [];
  plusMinusMap: Map<string, string> = new Map;
  paymentGateways: any = [];
  smsServices: any = [];
  eMailServices: any = [];
  orderStatus: any = [];
  eCommerceData: any = [];
  paymentStatus: any = [];
  paymentRange: any = [];
  fast2smsServices: any = [];
  city: string='';
  initailCountry: string='';
  user: string='';

  captcha: any = [];
  generatedCapcha:string = '';
  inputCapcha:string = '';
  reGeneratedCapcha:string = '';
  capchaTimerNo: any;
  captchaMap: Map<number, string> = new Map;
  captchaImageNo: number = 1;

  isProductHide: boolean = true;
  isCityHide: boolean = false;
  isStoreHide: boolean = false;
  isLoginHide: boolean = false;
  isCompanyPaymentHide: boolean = true;
  isLoginFailed: boolean = false;
  isCurrentLogin: boolean = false;
  isOrderHistoryHide: boolean = false;

  loginPhone: string = '';
  loginPassword: string = "";
  isLoginSuccessful: boolean = true;

  passwordRegExp = "^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]{8,}$";
  phoneRegExp = "^((\\+91-?)|0)?[0-9]{10}$"; 
  existingPassword:string = "";
  newPassword:string = "";
  verifyPassword:string = "";
  mobileNo:string = "";
  renewPassword:string = "";
  generatedOTP:string = "";
  OTP:string = "";
  isPasswordMatch: boolean = false;
  isIncorrectPassword: boolean = false;
  timeLeft: number = 60;
  interval: number = 0;
  secondsLeft: number = 0;
  cartCount: number = 0;

  search:string = '';
  
  sideBarOpen: boolean = true;
  isShoppingCartUpdated: boolean = false;

  constructor( private router: Router,
    public appComponentservice: AppComponentService,
    private userService: UserComponentService,
    private encryptService: EncryptDecryptService,
    private productservice: ProductService,
    private sidebarservice: SideBarService,
    private loginStatusservice: LoginStatusService,
    private currentLoginservice: CurrentLoginService,
    private shoppingCartservice: ShoppingCartService,
    private cartservice: CartService,
    private paymentservice: PaymentService,
    private orderservice: OrderService
    ){}

  ngOnInit(): void 
  {
    this.eCommerceData = ECommerceDetails.geteCommerceDetails();
    this.categories = ECommerceDetails.getCategories();
    this.countries = ECommerceDetails.getCountries();
    this.userRoles = ECommerceDetails.getUserRoles();
    this.plusMinus = ECommerceDetails.getPlusMinus();
    this.size = ECommerceDetails.getSize();
    this.color = ECommerceDetails.getColor();
    this.paymentGateways = ECommerceDetails.getPaymentGateways();
    this.smsServices = ECommerceDetails.getSMSServices();
    this.eMailServices = ECommerceDetails.getEMailServices();
    this.orderStatus = ECommerceDetails.getOrderStatus();
    this.paymentStatus = ECommerceDetails.getPaymentStatus();
    this.paymentRange = ECommerceDetails.getPaymentRange();
    this.captcha = ECommerceDetails.getCaptcha()

    this.title = this.eCommerceData[0].title;
    this.initailCountry = this.eCommerceData[0].initialCountry;
    this. isLoginSuccessful = true;

    this.loginStatusservice.getLogin().subscribe(
      (isLogin)=>{
        this.isLoginFailed = isLogin;
      });

    this.currentLoginservice.getCurrentLogin().subscribe(
      (isCurrentLogin)=>{
        this.isCurrentLogin = isCurrentLogin;
      });

    this.cartservice.getUpdate().subscribe(
      (isShoppingCartUpdated)=>{
        this.getShoppingCartDetails();
      });     

    this.updateCaptcha();
    this.updatePlusMinus();
    this.updateData();
    this.getShoppingCartDetails();

    this.initNavigationKeys();

    this.loginNow();

    let testDetail: TestDetail = new TestDetail();    
    this.userService.updateTest(testDetail)
    .subscribe(
      (response: any) => {
        console.log('TestDetail ' + response.id);
      },
      (error) => {
        console.log('TestDetail upsert unsuccessful');
      }
      )
  }

  generateCapcha()
  {
    clearInterval(this.capchaTimerNo);
    this.generatedCapcha = ECommerceDetails.getRandomString(6);

    this.capchaTimerNo = setInterval(() => {
      this.generatedCapcha = ECommerceDetails.getRandomString(6);
    }, 60000);
  }

  updateCaptcha()
  {
    for (var captcha of this.captcha)
    {
      this.captchaMap.set(captcha.captchaKey, captcha.captchaValue);
    } 
  }

  reGenerateCapcha()
  {
    clearInterval(this.capchaTimerNo);
    this.captchaImageNo = parseInt(ECommerceDetails.getRandomNumber(2)) % this.captchaMap.size;
    this.reGeneratedCapcha = this.captchaMap.get(this.captchaImageNo)??'';

    this.capchaTimerNo = setInterval(() => {
      this.captchaImageNo = parseInt(ECommerceDetails.getRandomNumber(2)) % this.captchaMap.size;
      this.reGeneratedCapcha = this.captchaMap.get(this.captchaImageNo)??'';
    }, 60000);
  }

  isValidCapcha(): boolean
  {
    ///return (this.generatedCapcha === this.inputCapcha);
    return (this.reGeneratedCapcha === this.inputCapcha);
  }

  onLogin(): void
  {
    this.inputCapcha = '';
    ///this.generatedCapcha = ECommerceDetails.getRandomString(6);
    ///this.generateCapcha();
    this.reGenerateCapcha();
  }  

  loginNow()
  {
    this.loginPhone = localStorage.getItem('logingarden')??'';
    this.loginPassword = localStorage.getItem('passwordgarden')??''

    if (this.loginPhone.length !== 0 && this.loginPassword.length !== 0)
      this.onClickLogin();
  }

  getShoppingCartDetails()
  {
    let mobileNo = sessionStorage.getItem('mobileno')?.toString() ?? '9999999999';

    this.shoppingCartservice.getShoppingCartDetails(mobileNo).subscribe(
      (response: ShoppingCartDetails) => {
        this.cartCount = response.productDetail.length;
      },
      err => {
        console.log(err);
      }
    );
  }

  initNavigationKeys()
  {
    let valIsProductHide = sessionStorage.getItem('isProductHide');
    let valIsCityHide = sessionStorage.getItem('isCityHide');
    let valIsStoreHide = sessionStorage.getItem('isStoreHide');
    let valIsLoginHide = sessionStorage.getItem('isLoginHide');
    let valIsCompanyPaymentHide = sessionStorage.getItem('isCompanyPaymentHide');
    let valIsOrderHistoryHide = sessionStorage.getItem('isOrderHistoryHide');

    let user = sessionStorage.getItem('user');

    if (user !== null)
      this.user = user;    

    if (valIsProductHide !== null)
      this.isProductHide = String(valIsProductHide).toLowerCase() === 'true';    

    if (valIsCityHide !== null)
      this.isCityHide = String(valIsCityHide).toLowerCase() === 'true';

    if (valIsStoreHide !== null)
      this.isStoreHide = String(valIsStoreHide).toLowerCase() === 'true';
      
    if (valIsLoginHide !== null)
      this.isLoginHide = String(valIsLoginHide).toLowerCase() === 'true';
    
    if (valIsCompanyPaymentHide !== null)
      this.isCompanyPaymentHide = String(valIsCompanyPaymentHide).toLowerCase() === 'true'; 
    
    if (valIsOrderHistoryHide !== null)
      this.isOrderHistoryHide = String(valIsOrderHistoryHide).toLowerCase() === 'true';    
  }

  getPlusMinus(categoryLinkId: string): string
  {
    return this.plusMinusMap.get(categoryLinkId)??'+';
  }

  updatePlusMinus()
  {
    for (var plusMinus of this.plusMinus)
    {
      this.plusMinusMap.set(plusMinus.categoryLinkId, plusMinus.plusminus);
    }  
  }

  updateData(): void
  {
    let categories: CategoryList = this.convertCategories();
    let countries: CountryList = this.convertCountries();
    let userRoles: string[] = this.convertUserRoles();
    let sizes: SizeList = this.convertSize();
    let colors: ColorList = this.convertColor();
    let paymentGateways: PaymentGatewayList = this.convertPaymentGateway();
    let smsServices: SMSServiceList = this.convertSMSService();
    let eMailServices: EMailServiceList = this.convertEMailService();
    let orderStaus: OrderStatusList = this.convertOrderStatus();
    let paymentStatus: PaymentStatusList = this.convertPaymentStatus();
    let paymentRange: PaymentRangeList = this.convertPaymentRange();

    this.appComponentservice.updateCategories(categories).subscribe(
      response => {
        console.log("Categories updated");
      },
      err => {
        console.log(err);
        if (err.status){
          console.log("Categories updated");
        }else{
          console.log(err);
        }
      }
    );

    this.appComponentservice.updateCountries(countries).subscribe(
      response => {
        console.log("Countries updated");
      },
      err => {
        console.log(err);
        if (err.status){
          console.log("Countries updated");
        }else{
          console.log(err);
        }
      }
    );

    this.appComponentservice.updateUserRoles(userRoles).subscribe(
      response => {
        console.log("UserRoles updated");
      },
      err => {
        console.log(err);
        if (err.status){
          console.log("UserRoles updated");
        }else{
          console.log(err);
        }
      }
    );

    this.appComponentservice.updateAdmin().subscribe(
      response => {
        console.log("Admin updated");
      },
      err => {
        console.log(err);
        if (err.status){
          console.log("Admin updated");
        }else{
          console.log(err);
        }
      }
    );    

    this.productservice.updateColor(colors).subscribe(
      response => {
        console.log("Colors updated");
      },
      err => {
        console.log(err);
      }
    );
    
    this.productservice.updateSize(sizes).subscribe(
      response => {
        console.log("Sizes updated");
      },
      err => {
        console.log(err);
      }
    );
    
    this.appComponentservice.updatePaymentGateway(paymentGateways).subscribe(
      (response) => {
        console.log("PaymentGateway updated");
      },
      err => {
        console.log(err);
        if (err.status){
          console.log("PaymentGateway updated");
        }else{
          console.log(err);
        }
      }
    );
    
    this.appComponentservice.updateSMSService(smsServices).subscribe(
      (response) => {
        console.log("SMSService updated");
      },
      err => {
        console.log(err);
        if (err.status){
          console.log("SMSService updated");
        }else{
          console.log(err);
        }
      }
    );
    
    this.appComponentservice.updateEMailService(eMailServices).subscribe(
      (response) => {
        console.log("EMailService updated");
      },
      err => {
        console.log(err);
        if (err.status){
          console.log("EMailService updated");
        }else{
          console.log(err);
        }
      }
    );
    
    this.appComponentservice.updateOrderStaus(orderStaus).subscribe(
      (response) => {
        console.log("Orders updated");
      },
      err => {
        console.log(err);
        if (err.status){
          console.log("Orders updated");
        }else{
          console.log(err);
        }
      }
    );
    
    this.paymentservice.updatePaymentStatus(paymentStatus).subscribe(
      (response) => {
        console.log("PaymentStatus updated");
      },
      err => {
        console.log(err);
        if (err.status){
          console.log("Payment updated");
        }else{
          console.log(err);
        }
      }
    );

    this.paymentservice.updatePaymentRange(paymentRange).subscribe(
      (response) => {
        console.log("PaymentRange updated");
      },
      err => {
        console.log(err);
        if (err.status){
          console.log("PaymentRange updated");
        }else{
          console.log(err);
        }
      }
    );
  }

  /**
  fillCities(): void
  {
    this.appComponentservice.getCities(this.initailCountry)
    .subscribe(
      (response) => {
        console.log('Cities received');
        this.updateCities(response);
      },
      (error) => {
        console.error(error);
      }
      )      
  }

  updateCities(cities: City[])
  {
    this.cities = [];
    cities.forEach(city => {
      this.cities.push(city.name);
    });
  }
  */

  onClickCategory(categoryLinkId: string)
  {
    for (var plusMinus of this.plusMinus)
    {
      if (plusMinus.categoryLinkId == categoryLinkId && this.plusMinusMap.get(plusMinus.categoryLinkId) == '+')
        this.plusMinusMap.set(plusMinus.categoryLinkId, '-');
      else if (plusMinus.categoryLinkId == categoryLinkId && this.plusMinusMap.get(plusMinus.categoryLinkId) == '-')
        this.plusMinusMap.set(plusMinus.categoryLinkId, '+');
      else
        this.plusMinusMap.set(plusMinus.categoryLinkId, '+');
    }
  }

  onClickProductCategory(category: any, subCategory: any): void
  {
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
      this.router.navigate(['/products/'], {queryParams: {category: category, subCategory: subCategory}})}); 
  } 

  onClickLogin(): void
  {
    this.getLoginResponse(this.loginPhone, this.loginPassword);
  }

  getLoginResponse(loginPhone: string, loginPassword: string): string
  {
    loginPassword = this.encryptService.encrypt(loginPassword);

    let decrypttest = this.encryptService.decrypt(loginPassword);
    decrypttest = this.encryptService.decrypt('7085851152609758064720493805023051090524');
    decrypttest = this.encryptService.decrypt('7080851172611058101720643804923050090514');

    this.userService.getLoginResponse(loginPhone, loginPassword)
    .subscribe(
      (response) => {
        if (response.id === 'true')
        {
          console.log('Login successful');
          this.updateRememberMe();
          this.updateLoginResponse(response.id);
          this.updateNavigationDisplay(response);
          this.isLoginFailed = false;
          ///this.loginStatusservice.setLogin(true);
          this.currentLoginservice.setCurrentLogin(false);
          this.cartservice.setUpdate(true);
          ///this.router.navigate(['/home/']);

          this.navigateToProductDetails();

        }else{
          this.updateLoginResponse(response.id);
          this.isLoginFailed = true;
        }
      },
      (error) => {
        console.error(error);
        console.log('Login unsuccessful');
        this.updateLoginResponseMessage('false');
        this.isLoginFailed = true;
        ///this.loginStatusservice.setLogin(false);
        this.currentLoginservice.setCurrentLogin(true);
      }
      )     
    return 'false';
  }

  navigateToProductDetails()
  {
    let productId = sessionStorage.getItem('productproductid')?.toString()??'';
    let storeName = sessionStorage.getItem('productstoreName')?.toString()??'';
    let pincode = sessionStorage.getItem('productpincode')?.toString()??'';
    let city = sessionStorage.getItem('productcity')?.toString()??'';

    sessionStorage.setItem('productproductid', '');
    sessionStorage.setItem('productstoreName', '');
    sessionStorage.setItem('productpincode', '');
    sessionStorage.setItem('productcity', '');    

    if (productId.length > 0)
    {
      this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
        this.router.navigate(['/productdetail/'], {queryParams: {productId: productId, storeName: storeName, pincode: pincode.toString(), city: city}})}); 
    }
  }

  updateRememberMe()
  {
    localStorage.setItem('logingarden', this.loginPhone);
    localStorage.setItem('passwordgarden', this.loginPassword);

    ///fs.writeFile('Bagwani.txt', this.loginPhone+this.loginPassword, (err) => {});
  }

  updateLoginResponse(response: string)
  {
    let loginResponse = response;

    this.updateLoginResponseMessage(loginResponse);
  }

  updateLoginResponseMessage(loginResponse: any)
  {
    /// TODO
    this. isLoginSuccessful = loginResponse;
  
    ///if (window.location.pathname.includes('/home')){
      ///sessionStorage.setItem('loginPassword', this.loginPassword);
      ///this.router.navigate(['/home/', this.loginPassword]);
      ///window.location.reload();

    ///  let currentUrl = this.router.url;

    ///  if (loginResponse === 'false' && currentUrl.includes('true'))
    ///    currentUrl = currentUrl.replace('true', 'false');
    ///  else if (loginResponse === 'true' && currentUrl.includes('false'))
    ///    currentUrl = currentUrl.replace('false', 'true');
    ///  else if (!currentUrl.includes('true') && !currentUrl.includes('false'))
    ///    currentUrl = currentUrl.concat('/'+loginResponse);
      
    ///  this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
    ///      this.router.navigate([currentUrl]);
    ///  });      
    ///}else{
    ///  this.router.navigate(['/home/', loginResponse]);
    ///}
  }

  onClickUpdatePassword()
  {
    if (this.newPassword !== this.verifyPassword)
    {
      //swal.fire('Password', 'Passwords donot match');
      swal.fire({
        title: 'Password',
        text: 'Passwords donot match',
        ///background: '#339B7C',
        confirmButtonText: 'Ok',
        confirmButtonColor: '#339B7C'
      });

    }
    else if (!this.isValidPassword(this.newPassword))
    {
      ///swal.fire('Password', 'Passwords donot match validation criteria');
      swal.fire({
        title: 'Password',
        text: 'Passwords donot match validation criteria !! (Password must be minimum 8 characters and must contain alphabetic, numeric, one capital character and atleast one non alphanumeric characters)',
        ///background: '#339B7C',
        confirmButtonText: 'Ok',
        confirmButtonColor: '#339B7C'
      });      
    }
    else
    {
      let changePassword: ChangePassword  = new ChangePassword();
      changePassword.mobileNo = sessionStorage.getItem('mobileno')?.toString() ?? '9999999999';
      changePassword.existingPassword = this.encryptService.encrypt(this.existingPassword);
      changePassword.newPassword = this.encryptService.encrypt(this.newPassword);
      
      this.userService.changePassword(changePassword)
      .subscribe(
        (response: any) => {
          if (response.id === 'wrongpassword')
            ///swal.fire('Password', 'Existing password not correct');
            swal.fire({
              title: 'Password',
              text: 'Existing password not correct',
              confirmButtonText: 'Ok',
              confirmButtonColor: '#339B7C'
            });            
          else if (response.id === 'true')
            ///swal.fire('Password', 'Password updated successfully');
            swal.fire({
              title: 'Password',
              text: 'Password updated successfully',
              confirmButtonText: 'Ok',
              confirmButtonColor: '#339B7C'
            });           
          else
            console.log('Password updated');
        },
        (error) => {
          console.log('Login unsuccessful');
        }
        )
    }
  }

  onClickResetPassword()
  {
    if (!this.isValidPassword(this.renewPassword))
    {
      ///swal.fire('Password', 'Passwords donot match validation criteria');
      swal.fire({
        title: 'Password',
        text: 'Passwords donot match validation criteria !! (Password must be minimum 8 characters and must contain alphabetic, numeric, one capital character and atleast one non alphanumeric characters)',
        confirmButtonText: 'Ok',
        confirmButtonColor: '#339B7C'
      });       
    }
    else if (this.OTP !== this.generatedOTP)
    {
      ///swal.fire('OTP', 'Wrong OTP');
      swal.fire({
        title: 'OTP',
        text: 'Wrong OTP',
        confirmButtonText: 'Ok',
        confirmButtonColor: '#339B7C'
      });       
    }
    else
    {
      let resetPassword: ChangePassword  = new ChangePassword();
      resetPassword.mobileNo = this.mobileNo;
      resetPassword.newPassword = this.encryptService.encrypt(this.renewPassword);
      resetPassword.oTP = this.OTP;
      
      this.userService.resetPassword(resetPassword)
      .subscribe(
        (response: any) => {
          if (response.id === 'false')
            ///swal.fire('Mobile no : ' + this.mobileNo +' doesnot exist');
            swal.fire({
              title: 'Mobile no',
              text: 'Mobile no : ' + this.mobileNo +' doesnot exist. Please register first.',
              confirmButtonText: 'Ok',
              confirmButtonColor: '#339B7C'
            });            
          else if (response.id === 'true')
          {
            ///swal.fire('Password updated successfully');
            swal.fire({
              title: 'Password',
              text: 'Password updated successfully',
              confirmButtonText: 'Ok',
              confirmButtonColor: '#339B7C'
            });
            this.generatedOTP = '000000';
          }         
          else
            console.log('Password updated');
        },
        (error) => {
          console.log('Reset unsuccessful');
        }
        )
    }  
  }

  onClickResetOTP()
  {
    if (this.isValidPhoneNumber(this.mobileNo))
    {
      this.startTimer();
      this.generateOTP();
    }  
  }

  onForgotPassword()
  {
    this.secondsLeft = 0;
  }

  generateOTP()
  {
    this.generatedOTP = Math.floor(Math.random() * 989898).toString().substring(0, 6);
    this.sendSMS(this.generatedOTP, this.mobileNo);
  }

  isValidPhoneNumber(phone: string): boolean
  {
    let regexp = new RegExp(this.phoneRegExp);
    return regexp.test(phone);
  }

  startTimer() 
  {
    this.secondsLeft = 120;
    timer(1000, 1000)
      .pipe(
        takeWhile( () => this.secondsLeft > 0 ),
        tap(() => this.secondsLeft--)
      )
      .subscribe( () => {
      } );
  }

  ///Duplicate
  isValidPassword(password: string): boolean
  {
    let regexp = new RegExp(this.passwordRegExp);
    const encodedData = btoa(password);
    return regexp.test(password.toString());
  }  

  updateNavigationDisplay(response: any)
  {
    if(response.id === 'true')
    {
      let userRole:string = response.role;

      this.user = response.user;

      sessionStorage.setItem('user', response.user);
      sessionStorage.setItem('lastname', response.lastname);
      sessionStorage.setItem('userId', response.userId);
      sessionStorage.setItem('email', response.email);
      sessionStorage.setItem('role', response.role);
      sessionStorage.setItem('mobileno', response.mobileno);
      sessionStorage.setItem('pincode', response.pincode);

      switch(userRole){
        case 'Admin':
          this.updateNavigation(true, true, true, true, false, false);
          break;
        case 'Supplier':
          this.updateNavigation(false, true, true, true, true, false);
          break;
        case 'Buyer':
          this.updateNavigation(true, false, false, true, true, true);        
          break;
      }
    }
  }

  updateNavigation(isProductHide: boolean, isCityHide: boolean, 
    isStoreHide: boolean, isLoginHide: boolean, isCompanyPaymentHide: boolean,
    isOrderHistoryHide: boolean)
  {
    this.isProductHide = isProductHide;
    this.isCityHide = isCityHide;
    this.isStoreHide = isStoreHide;
    this.isLoginHide = isLoginHide;
    this.isCompanyPaymentHide = isCompanyPaymentHide;
    this.isOrderHistoryHide = isOrderHistoryHide;

    sessionStorage.setItem('isProductHide', Boolean(isProductHide).toString());
    sessionStorage.setItem('isCityHide', Boolean(isCityHide).toString());
    sessionStorage.setItem('isStoreHide', Boolean(isStoreHide).toString());
    sessionStorage.setItem('isLoginHide', Boolean(isLoginHide).toString());
    sessionStorage.setItem('isCompanyPaymentHide', Boolean(isCompanyPaymentHide).toString());
    sessionStorage.setItem('isOrderHistoryHide', Boolean(isOrderHistoryHide).toString());      
  }

  onEditUser()
  {
    let mobileno = sessionStorage.getItem('mobileno');
    this.router.navigate(['/editregister/'], {queryParams: {mobileno: mobileno}}); 
  }  

  onLogout()
  {
    this.updateNavigation(true, false, false, false, true, false); 
    this.loginPhone = '';
    this.loginPassword = '';
    sessionStorage.clear();
    this.cartservice.setUpdate(true);

    localStorage.setItem('logingarden', '');
    localStorage.setItem('passwordgarden', '');
  }

  sendSMS(otp: string, mobileNo: string)
  {
    this.orderservice.getSMSService().subscribe(
      (response: any) => {
        if (response.id === 'FAST2SMS')
        {
          this.sendFAST2SMS('Your%20OTP%20is%20:%20'+otp, mobileNo, response.fast2smsKey);
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  sendFAST2SMS(msg: string, mobileNos: string, fast2smsKey: string)
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
      if(request.readyState === 3 && request.status === 200){
        var data = JSON.parse(request.responseText);
      }
    };
    request.send(); 
  }  

  /**
  onSelectCity(city: string): void
  {

  }

  onSelectStore(city: string): void
  {

  }  
  */
  convertCategories(): CategoryList
  {
    let categories = new CategoryList;

    for (var category of this.categories) 
    {
      let categoryDetail = new CategoryDetail;
      categoryDetail.category = category.CategoryName;
      categoryDetail.categoryLinkId = category.categoryLinkId;
      
      for (var subCategory of category.subCategory)
      {
        categoryDetail.subCategoryLinkIds.push(subCategory.subCategoryLinkId);
        categoryDetail.subCategories.push(subCategory.subCategoryName);
      }
      
      categories.category.push(categoryDetail);
    }

    return categories;
  }

  convertCountries(): CountryList
  {
    let countries = new CountryList;

    for (var country of this.countries) 
    {
      let countryDetail = new CountryDetail;
      countryDetail.countryLinkId = country.countryLinkId;
      countryDetail.country = country.countryName;
      countryDetail.flagCode = country.flagCode;
      
      for (var state of country.state)
      {
        let stateDetail = new StateDetail;
        stateDetail.stateLinkId = state.stateLinkId;
        stateDetail.state = state.stateName;

        for (var city of state.city)
        {
          let cityDetail = new CityDetail;
          cityDetail.cityLinkId = city.cityLinkId;
          cityDetail.city = city.cityName;
          stateDetail.cities.push(cityDetail);      
          ///stateDetail.cities.push(city.cityName);
        }

        countryDetail.states.push(stateDetail);
      }
      
      countries.country.push(countryDetail);
    }

    return countries;
  }

  convertUserRoles(): string[]
  {
    let userRoles:string[] = [];

    for (var userRole of this.userRoles)
    {
      userRoles.push(userRole.role);
    }

    return userRoles;
  }

  convertSize(): SizeList
  {
    let sizeList = new SizeList;

    for (var size of this.size)
    {
      let sizeDetail: SizeDetail = new SizeDetail;

      sizeDetail.sizeLinkId = size.sizeLinkId;
      sizeDetail.sizeCode = size.sizeCode;
      sizeDetail.description = size.description;
      
      sizeList.size.push(sizeDetail);
    }

    return sizeList;
  }

  convertColor(): ColorList
  {
    let colorList = new ColorList;

    for (var color of this.color)
    {
      let colorDetail: ColorDetail = new ColorDetail;

      colorDetail.colorLinkId = color.colorLinkId;
      colorDetail.red = color.red;
      colorDetail.green = color.green;
      colorDetail.blue = color.blue;
      colorDetail.description = color.description;
      
      colorList.color.push(colorDetail);
    }

    return colorList;
  }

  convertPaymentGateway(): PaymentGatewayList
  {
    let paymentGatewayList = new PaymentGatewayList;

    for (var paymentGateway of this.paymentGateways)
    {
      let paymentGatewayDetail: PaymentGatewayDetail = new PaymentGatewayDetail;

      paymentGatewayDetail.paymentGatewayLinkId = parseInt(paymentGateway.PaymentGatewayLinkId);
      paymentGatewayDetail.paymentGatewayName = paymentGateway.PaymentGatewayName;
      paymentGatewayDetail.activeNow = parseInt(paymentGateway.activeNow);

      paymentGatewayList.paymentGatewayDetail.push(paymentGatewayDetail);
    }

    return paymentGatewayList;
  }

  convertSMSService(): SMSServiceList
  {
    let smsServiceList = new SMSServiceList;

    for (var smsService of this.smsServices)
    {
      let smsServiceDetail: SMSServiceDetail = new SMSServiceDetail;

      smsServiceDetail.smsServiceLinkId = parseInt(smsService.SMSServiceLinkId);
      smsServiceDetail.smsServiceName = smsService.SMSServiceName;
      smsServiceDetail.activeNow = parseInt(smsService.activeNow);

      smsServiceList.smsServiceDetail.push(smsServiceDetail);
    }

    return smsServiceList;
  }

  convertEMailService(): EMailServiceList
  {
    let eMailServiceList = new EMailServiceList;

    for (var eMailService of this.eMailServices)
    {
      let eMailServiceDetail: EMailServiceDetail = new EMailServiceDetail;

      eMailServiceDetail.eMailServiceLinkId = parseInt(eMailService.EMailServiceLinkId);
      eMailServiceDetail.eMailServiceName = eMailService.EMailServiceName;
      eMailServiceDetail.activeNow = parseInt(eMailService.activeNow);

      eMailServiceList.eMailServiceDetail.push(eMailServiceDetail);
    }

    return eMailServiceList;
  }

  convertOrderStatus(): OrderStatusList
  {
    let orderStatusList = new OrderStatusList;

    for (var orderStatus of this.orderStatus)
    {
      let orderStatusDetail: OrderStatusDetail = new OrderStatusDetail;

      orderStatusDetail.orderStatusLinkId = parseInt(orderStatus.OrderLinkId);
      orderStatusDetail.orderStatus = orderStatus.OrderStatus;

      orderStatusList.orderStatusDetail.push(orderStatusDetail);
    }

    return orderStatusList;    
  }

  convertPaymentStatus(): PaymentStatusList
  {
    let paymentStatusList = new PaymentStatusList;

    for (var paymentStatus of this.paymentStatus)
    {
      let paymentStatusDetail: PaymentStatusDetail = new PaymentStatusDetail;

      paymentStatusDetail.paymentStatusLinkId = parseInt(paymentStatus.PaymentStatusLinkId);
      paymentStatusDetail.paymentStatus = paymentStatus.PaymentStatus;

      paymentStatusList.paymentStatusDetail.push(paymentStatusDetail);
    }

    return paymentStatusList;    
  }
  
  convertPaymentRange(): PaymentRangeList
  {
    let paymentRangeList = new PaymentRangeList;

    for (var paymentRange of this.paymentRange)
    {
      let paymentRangeDetail: PaymentRangeDetail = new PaymentRangeDetail;

      paymentRangeDetail.paymentRangeLinkId = parseInt(paymentRange.PaymentRangeLinkId);
      paymentRangeDetail.minimumValue = paymentRange.MinimumValue;
      paymentRangeDetail.maximumValue = paymentRange.MaximumValue;
      paymentRangeDetail.percentageFees = paymentRange.PercentageFees;
      paymentRangeList.paymentRangeDetail.push(paymentRangeDetail);
    }

    return paymentRangeList;    
  }

  convertFast2SMS(): string
  {
    let keyId: string = '';

    for (var fast2smsServices of this.fast2smsServices)
    {
      keyId = fast2smsServices.KeyId;
    }    

    return keyId;
  }

  onClickOffers()
  {

  }

  onClickDrGreen()
  {

  }

  onSearch()
  {
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
      this.router.navigate(['/searchproducts/'], {queryParams: {search: this.search}})}); 
  }

  toggleSideBar(toggle: boolean)
  {
    if (toggle === true){
      document.getElementById('sideBar')?.classList.remove('eCommerce-sidebar-hide');
      document.getElementById('sideBar')?.classList.add('eCommerce-sidebar-show');

      document.getElementById('navBar')?.classList.remove('eCommerce-sidebar-margin-colapse');
      document.getElementById('navBar')?.classList.add('eCommerce-sidebar-margin-expand');

      document.getElementById('loginSuccess')?.classList.remove('eCommerce-sidebar-margin-colapse');
      document.getElementById('loginSuccess')?.classList.add('eCommerce-sidebar-margin-expand');

      this.sidebarservice.setExpand(true);
    }
    else{
      document.getElementById('sideBar')?.classList.remove('eCommerce-sidebar-show');
      document.getElementById('sideBar')?.classList.add('eCommerce-sidebar-hide');

      document.getElementById('navBar')?.classList.remove('eCommerce-sidebar-margin-expand');
      document.getElementById('navBar')?.classList.add('eCommerce-sidebar-margin-colapse');

      document.getElementById('loginSuccess')?.classList.remove('eCommerce-sidebar-margin-expand');
      document.getElementById('loginSuccess')?.classList.add('eCommerce-sidebar-margin-colapse');

      this.sidebarservice.setExpand(false);
    }

    this.sideBarOpen = toggle;
  }

}
