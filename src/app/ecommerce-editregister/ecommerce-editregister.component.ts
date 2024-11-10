
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgForm, Validators } from '@angular/forms';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Country } from '../shared/model/country.model';
import { State } from '../shared/model/state.model';
import { City } from '../shared/model/city.model';

import { ECommerceRegisterService } from '../shared/services/ecommerce-register.service';

import { ECommerceDetails } from './../shared/data/eCommerce-details.data';

import { UserDetail } from './../shared/model/user-detail.model';
import { UserComponentService } from '../shared/services/user-component.service';
import { EncryptDecryptService } from '../shared/services/encrypt-decrypt.service';
import { SideBarService } from '../shared/services/side-bar.service';
import { LoginStatusService } from '../shared/services/login-status.service';
import { CurrentLoginService } from '../shared/services/current-login.service';
///import { forEach } from 'core-js/core/array';
import { AddressDetail } from '../shared/model/address-list.model';
import { MoreAddress } from '../shared/model/more-address.model';
import { ECommerceUtils } from '../shared/utilities/eCommerce-utils';

@Component({
  selector: 'app-ecommerce-editregister',
  templateUrl: './ecommerce-editregister.component.html',
  styleUrls: ['../app-bagwani.component.css']
})

export class ECommerceEditRegisterComponent implements OnInit 
{
  title: string='';
  eCommerceData: any = [];

  user: UserDetail = new UserDetail();

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
  selectedCity: string='';

  passwordRegExp = "^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]{8,}$";
  phoneRegExp = "^((\\+91-?)|0)?[0-9]{10}$"; 
  emailRegExp = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";
  pincodeRegExp = "^[1-9]{1}[0-9]{2}\\s{0,1}[0-9]{3}$";

  flagCode: string='in';
  registrationAttemptSuccessful: boolean = true;
  registrationMobilePresent: boolean = true;
  registrationError: boolean = true;

  pincodeText:string = '';

  address1:string = 'Delivery Address*';
  address2:string = 'Delivery Address';

  deliveryPincode: string = '411001';
  selDeliveryCode: string = '';
  
  flagCode1: string='in';
  flagCode2: string='in';
  flagCode3: string='in';

  moreAddress: MoreAddress[]=[];  
  moreAddressCount: number = 0;

  selectCountryOne: string='';
  selectCountryTwo: string='';
  selectCountryThree: string='';
  selectStateOne: string='';
  selectStateTwo: string='';
  selectStateThree: string='';
  selectCityOne: string='';
  selectCityTwo: string='';
  selectCityThree: string='';    

  MAXADDRESS: number = 3;

  constructor(private router: Router,
            private eCommerceService: ECommerceRegisterService,
            private userService: UserComponentService,
            private encryptService: EncryptDecryptService,
            private sidebarservice: SideBarService,
            private loginStatusservice: LoginStatusService,
            private currentLoginservice: CurrentLoginService
            ) { }

  ngOnInit(): void 
  {
    this.loginStatusservice.setLogin(false);
    this.currentLoginservice.setCurrentLogin(false);
    this.addMoreAddressDetail();
    this.updateUserDetails();
  }

  initialize(): void
  {
    this.getCountry();    
  }

  getCountry()
  {
    this.eCommerceService.getCountry()
      .subscribe(
        (response) => {
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
      (response) => {
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
      (response) => {
        console.log('Cities received');
        this.updateCities(response);
        ///this.updateUserDetails();
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

    this.moreAddress[0].countries = [];
    this.moreAddress[1].countries = [];
    this.moreAddress[2].countries = [];    

    worldCountries.forEach(country => {

      if (this.countries.indexOf(country.name) < 0){
        this.allCountries.push(country);
        this.countries.push(country.name);

        this.moreAddress[0].countries.push(country.name);
        this.moreAddress[1].countries.push(country.name);
        this.moreAddress[2].countries.push(country.name);              
      }

      if (country.name === this.user.country){
        this.selectedCountryId = country.countryLinkId;
        this.flagCode = country.flagCode;       
      }

      if (country.name === this.user.address.addresses[0].country){
        this.moreAddress[0].selectedCountryId = country.countryLinkId;
        this.user.address.addresses[0].flagCode = country.flagCode;
        this.user.address.addresses[0].country = country.name;
        this.selectCountryOne = country.name;
      }

      if (country.name === this.user.address.addresses[1].country){
        this.moreAddress[1].selectedCountryId = country.countryLinkId;
        this.user.address.addresses[1].flagCode = country.flagCode;
        this.user.address.addresses[1].country = country.name;
        this.selectCountryTwo = country.name;
      }
      
      if (country.name === this.user.address.addresses[2].country){
        this.moreAddress[2].selectedCountryId = country.countryLinkId;
        this.user.address.addresses[2].flagCode = country.flagCode;
        this.user.address.addresses[2].country = country.name;
        this.selectCountryThree = country.name;
      }       
    });

    ///this.user.country = this.selectedCountry;
    this.selectedCountry = this.user.country;  
  }

  updateStates(worldStates: State[])
  {
    this.allStates = [];
    this.states = [];
    this.moreAddress[0].states = [];
    this.moreAddress[1].states = [];
    this.moreAddress[2].states = []; 

    worldStates.forEach(state => {
      this.allStates.push(state);
      
      if (state.countryLinkId === this.selectedCountryId)
      {
        this.states.push(state.name);
        if(state.name === this.user.state){
          this.selectedStateId = state.stateLinkId;
        }       
      }
      
      if (state.countryLinkId === this.moreAddress[0].selectedCountryId)
      {
        this.moreAddress[0].states.push(state.name);

        if (state.name === this.user.address.addresses[0].state)
        {
          this.moreAddress[0].selectedStateId = state.stateLinkId;
          this.user.address.addresses[0].state = state.name;
          this.selectStateOne = state.name;
        } 
      }

      if (state.countryLinkId === this.moreAddress[1].selectedCountryId)
      {
        this.moreAddress[1].states.push(state.name);

        if (state.name === this.user.address.addresses[1].state)
        {
          this.moreAddress[1].selectedStateId = state.stateLinkId;
          this.user.address.addresses[1].state = state.name;
          this.selectStateTwo = state.name;
        } 
      }
      
      if (state.countryLinkId === this.moreAddress[2].selectedCountryId)
      {
        this.moreAddress[2].states.push(state.name);

        if (state.name === this.user.address.addresses[2].state)
        {
          this.moreAddress[2].selectedStateId = state.stateLinkId;
          this.user.address.addresses[2].state = state.name;
          this.selectStateThree = state.name;
        } 
      }       
    });

    this.selectedCountry = this.user.country;
    this.selectedState = this.user.state;
  }

  updateCities(worldCities: City[])
  {
    this.allCities = [];
    this.cities = [];
    worldCities.forEach(city => {
      this.allCities.push(city);

      if(city.stateLinkId === this.selectedStateId){
        this.cities.push(city.name);
      }

      if(city.stateLinkId === this.moreAddress[0].selectedStateId && city.countryLinkId === this.moreAddress[0].selectedCountryId){
        this.moreAddress[0].cities.push(city.name);
        if (city.name === this.user.address.addresses[0].city)
        {
          this.moreAddress[0].selectedCity = city.name;
          this.user.address.addresses[0].city = city.name;
          this.selectCityOne = city.name;
        }        
      }

      if(city.stateLinkId === this.moreAddress[1].selectedStateId && city.countryLinkId === this.moreAddress[1].selectedCountryId){
        this.moreAddress[1].cities.push(city.name);
        if (city.name === this.user.address.addresses[1].city)
        {
          this.moreAddress[1].selectedCity = city.name;
          this.user.address.addresses[1].city = city.name;
          this.selectCityTwo = city.name;
        }        
      }
      
      if(city.stateLinkId === this.moreAddress[2].selectedStateId && city.countryLinkId === this.moreAddress[2].selectedCountryId){
        this.moreAddress[2].cities.push(city.name);
        if (city.name === this.user.address.addresses[2].city)
        {
          this.moreAddress[2].selectedCity = city.name;
          this.user.address.addresses[2].city = city.name;
          this.selectCityThree = city.name;
        }
      }       
    });

    this.selectedCountry = this.user.country;
    this.selectedState = this.user.state;
    this.selectedCity = this.user.city;
  }

  updateUserDetails()
  {
    let mobileno = sessionStorage.getItem('mobileno')?.toString() ?? '9999999999';
    this.userService.getUser(mobileno).subscribe(
      (response: UserDetail) => {
        console.log('User initialized');
        this.updateUser(response);
        this.initialize();
      },
      (error) => {
        console.log('User error');
      }
  )
  }

  updateUser(response: UserDetail)
  {
    this.user.firstName = response.firstName;
    this.user.lastName = response.lastName;
    this.user.phone = response.phone;
    this.user.email = response.email;
    this.user.password = response.password;
    this.encryptService.decrypt(this.user.password);

    this.user.country = response.country;
    this.user.state = response.state;
    this.user.city = response.city;
    this.user.pincode = response.pincode;
    this.pincodeText = this.user.pincode.toString();
    this.user.address1 = response.address1;
    this.user.address2 = response.address2;
    this.user.store = response.store;
    this.user.userRole = response.userRole;
    this.user.subscribe = response.subscribe;
    this.user.flagCode = response.flagCode;

    this.user.deliveryPinCodes = response.deliveryPinCodes;
    
    if (this.user.userRole === 'Supplier')
    {
      this.address1 = 'Supplier Address*';
      this.address2 = 'Supplier Address';
    }
    
    this.user.moreAddressCount = response.moreAddressCount;
    this.moreAddressCount = response.moreAddressCount;

    response.address.addresses.forEach( address => {
      this.user.address.addresses.push(address);
    });

    for(var index=this.moreAddressCount; index < this.MAXADDRESS; index++)
    {
      let addressDetail: AddressDetail = new AddressDetail;
      addressDetail.country = ECommerceDetails.getComboDefaultCountry();
      addressDetail.state = ECommerceDetails.getComboDefaultState();
      addressDetail.city = ECommerceDetails.getComboDefaultCity();
      this.user.address.addresses.push(addressDetail);
    }
  }

  isValidPhoneNumber(phone: string): boolean
  {
    let regexp = new RegExp(this.phoneRegExp);
    return regexp.test(phone);
  }

  isValidPassword(password: string): boolean
  {
    let regexp = new RegExp(this.passwordRegExp);
    const encodedData = btoa(password);
    return regexp.test(password.toString());
  }

  isValidEmail(email: string): boolean
  {
    return true;
  }

  isValidPincode(pincode: string): boolean
  {
    let regexp = new RegExp(this.pincodeRegExp);
    return regexp.test(pincode);
  }

  isValidCountry(): boolean
  {
    return (this.user.country.length !== 0);
  }

  isValidState(): boolean
  {
    return (this.user.state.length !== 0);
  }

  isValidCity(): boolean
  {
    return (this.user.city.length !== 0);
  }

  onSelectCountry(selectedCountry: any): void
  {
    let countryId: number=0;
    let stateId: number=0;
    this.states=[];
    this.cities=[];

    this.allCountries.filter(country=>{
      if (country.name === selectedCountry){
        countryId = country.countryLinkId;
        this.flagCode = country.flagCode;
        this.user.flagCode = country.flagCode;
        this.allStates.filter(state=>{

          if (state.countryLinkId === countryId){
            if (stateId === 0) stateId = state.stateLinkId;
            this.states.push(state.name);

              this.allCities.filter(city=>{
                if (city.stateLinkId === stateId && city.countryLinkId === countryId && this.cities.indexOf(city.name) < 0){
                  this.cities.push(city.name);
                }
              });
          }
        });
      }
    });

    this.selectedCountryId = countryId;
    this.selectedCity = this.cities[0];
    this.user.country = selectedCountry;
    this.user.state = this.states[0];
    this.user.city = this.cities[0];
  }

  onSelectState(selectedState: any): void
  {
    let stateId: number=0;
    this.cities=[];

    this.allStates.filter(state=>{
      if (state.name === selectedState){
        stateId = state.stateLinkId;

        this.allCities.filter(city=>{
          if (city.stateLinkId === stateId && city.countryLinkId === this.selectedCountryId)
          {
            this.cities.push(city.name);
          }
        });
      }
    });

    this.selectedStateId = stateId;
    this.user.state = selectedState;
    this.user.city = this.cities[0];
  }
  
  onSelectCity(selectedCity: any): void
  {
    this.user.city = selectedCity;
  }

  onSelectAddressCountry(index: number, selectedCountry: any)
  {
    let countryId: number=0;
    let stateId: number=0;
    this.moreAddress[index].states=[];
    this.moreAddress[index].cities=[];

    this.allCountries.filter(country=>{
      if (country.name === selectedCountry){
        countryId = country.countryLinkId;
        this.user.address.addresses[index].flagCode = country.flagCode;
        this.allStates.filter(state=>{

          if (state.countryLinkId === countryId){
            if (stateId === 0) stateId = state.stateLinkId;
            this.moreAddress[index].states.push(state.name);

              this.allCities.filter(city=>{
                if (city.stateLinkId === stateId && city.countryLinkId === countryId && this.moreAddress[index].cities.indexOf(city.name) < 0){
                  this.moreAddress[index].cities.push(city.name);
                }
              });
          }
        });
      }
    });

    this.moreAddress[index].selectedCountryId = countryId;
    this.user.address.addresses[index].country = selectedCountry;
    this.user.address.addresses[index].state = this.moreAddress[index].states[0];
    this.user.address.addresses[index].city = this.moreAddress[index].cities[0];
  }

  onSelectAddressState(index: number, selectedState: any)
  {
    let stateId: number=0;
    this.moreAddress[index].cities=[];

    this.allStates.filter(state=>{
      if (state.name === selectedState){
        stateId = state.stateLinkId;

        this.allCities.filter(city=>{
          if (city.stateLinkId === stateId && city.countryLinkId === this.moreAddress[index].selectedCountryId)
          {
            this.moreAddress[index].cities.push(city.name);
          }
        });
      }
    });

    this.user.address.addresses[index].state = selectedState;
    this.user.address.addresses[index].city = this.moreAddress[index].cities[0];    
  }

  onSelectAddressCity(index: number, selectedCity: any)
  {
    this.user.address.addresses[index].city = selectedCity;    
  }

  onRegister(user: UserDetail): void
  {
    let password:string = user.password;
    user.password = this.encryptService.decrypt(password);

    user.pincode = parseInt(this.pincodeText);
    user.moreAddressCount = this.moreAddressCount;

    this.updateUsers(user, password);
  }

  updateUsers(user: UserDetail, password: string)
  {
    this.userService.updateRegisteredUsers(user)
      .subscribe(
        (response) => {
          console.log('User updated');
          this.user.password = password;
          this.updateRegistration(response);
          this.router.navigate(['/registrationsuccess/'], {queryParams: {status: 'updated'}});  
        },
        (error) => {
          console.log('User error');
          console.error(error);
          user.password = password;
          this.updateRegistrationMessage();
        }
    )
  }
  
  updateRegistration(response: any)
  {
    if (response.id === 'duplicate number')
    {
      this.registrationAttemptSuccessful = true;
      this.registrationMobilePresent = false;
      this.registrationError = true;
    }else if (response.id === 'success'){
      this.registrationAttemptSuccessful = false;
      this.registrationMobilePresent = true;
      this.registrationError = true;
    }
  }
  
  updateRegistrationMessage()
  {
    this.registrationAttemptSuccessful = true;
    this.registrationMobilePresent = true;
    this.registrationError = false;
  }

  onSelectDeliveryCode(deliveryCode: string)
  {
    this.selDeliveryCode = deliveryCode;
  }

  onAddDeliveryCode()
  {
    if (this.user.deliveryPinCodes.indexOf(this.deliveryPincode) < 0)
      this.user.deliveryPinCodes.push(this.deliveryPincode);  
  }

  onSubtractDeliveryCode()
  {
    this.user.deliveryPinCodes = this.user.deliveryPinCodes.filter(deliveryPincode => deliveryPincode != this.selDeliveryCode);
  }

  onBuyerCheck()
  {
    this.address1 = 'Delivery Address*';
    this.address2 = 'Delivery Address';
  }

  onSupplierCheck()
  {
    this.address1 = 'Supplier Address*';
    this.address2 = 'Supplier Address';
  }

  onMoreAddress()
  {
    this.moreAddressCount++;
  }

  onDeleteAddress()
  {
    this.moreAddressCount--;
  }

  addMoreAddressDetail()
  {
    for(var index= 0; index < this.MAXADDRESS; index++)
    {
      let moreAddress: MoreAddress = new MoreAddress;
      this.moreAddress.push(moreAddress);      
    }
  }
}
