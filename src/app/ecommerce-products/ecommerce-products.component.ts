import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { SideBarService } from '../shared/services/side-bar.service';
import { ProductsService } from '../shared/services/products-service.service';
import { ECommerceDetails } from '../shared/data/eCommerce-details.data';
import { ProductList } from '../shared/model/product-list.model';
import { Products } from '../shared/model/products.model';
import { LoginStatusService } from '../shared/services/login-status.service';
import { CurrentLoginService } from '../shared/services/current-login.service';
import { ECommerceUtils } from '../shared/utilities/eCommerce-utils';

@Component({
  selector: 'app-ecommerce-products',
  templateUrl: './ecommerce-products.component.html',
  styleUrls: ['../app-bagwani.component.css']
})

export class ECommerceProductsComponent implements OnInit 
{
  homeImageUrl: string = '';
  isSideBarExpand: boolean = true;

  categoryName: string = '';
  subCategoryName: string = '';

  city: string='';
  cities: string[] = [];
  
  pincode: number=0;
  pincodes: number[] = [];

  store: string='';
  stores: string[] = [];
  
  sort: string='';
  sorts: string[] = ['Price', 'Items left'];

  products: ProductList = new ProductList;
  viewproducts: ProductList = new ProductList;

  isAscending: boolean = true;

  imageHome: string = "assets/eCommerce-Images";
  imageHomePath: string = ECommerceUtils.FILEHOSTING + 'FileSystem/Product/';

  constructor(private router: Router,
    private activatedRoute:ActivatedRoute,
    private sidebarservice: SideBarService,
    private loginStatusservice: LoginStatusService,
    private productsservice: ProductsService,
    private currentLoginservice: CurrentLoginService) { }

  ngOnInit(): void 
  {
    this.loginStatusservice.setLogin(false);
    this.currentLoginservice.setCurrentLogin(false);

    this.getSideBar();

    this.sidebarservice.getExpand().subscribe(
      (isExpand)=>{
        this.isSideBarExpand = isExpand;
        this.updateLayout();
      });

    this.updateLayout();  
    
    this.getProducts();
    this.updateHomeImage();
  }

  getProducts()
  {
    this.categoryName = this.activatedRoute.snapshot.queryParamMap.get('category')?.toString() ?? '';
    this.subCategoryName = this.activatedRoute.snapshot.queryParamMap.get('subCategory')?.toString() ?? '';

    navigator.geolocation.getCurrentPosition(
      (position)=>{
        let latitude = position.coords.latitude;
        let longitude = position.coords.longitude;

        this.getPosition(latitude, longitude);
      }
    )

    this.productsservice.getProducts(this.categoryName, this.subCategoryName).subscribe(
      (response) => {

        this.updateViewProducts(response);

        this.getCities();
        this.getPincodes('');
        this.getStores('', '');        
      },
      (error) => {
        console.error(error);
      }
      );
  }

  getPosition(latitude: any, longitude: any)
  {
    var request = new XMLHttpRequest();

    var method = 'GET';
    var url = 'https://api.bigdatacloud.net/data/reverse-geocode-client?latitude='+latitude+'&longitude='+longitude+'&localityLanguage=en';
    var async = true;

    request.open(method, url, async);
    request.onreadystatechange = function(){
      if(request.readyState == 4 && request.status == 200){
        var data = JSON.parse(request.responseText);
      }
    };
    request.send();
  }

  getCities()
  {
    this.cities = [];
    this.products.products.forEach(product => {
      if (this.cities.indexOf(product.city) < 0)
      {
        this.cities.push(product.city);
      }
    });
  }

  getPincodes(city: string)
  {
      this.pincodes = [];
      this.products.products.forEach(product => {
        if (this.pincodes.indexOf(product.pincode) < 0 && city.length == 0)
        {
          this.pincodes.push(product.pincode);
        }else if (this.pincodes.indexOf(product.pincode) < 0 && product.city === city)
        {
          this.pincodes.push(product.pincode);
        }
      });
      
      if (city.length > 0)
        this.pincode = this.pincodes[0];
  }

  getStores(city: string, pincode: string)
  {
      this.stores = [];
      this.products.products.forEach(product => {
        if (this.stores.indexOf(product.store) < 0 && city.length == 0 && pincode.length == 0)
        {
          this.stores.push(product.store);
        }else if (this.stores.indexOf(product.store) < 0 && product.city === city && product.pincode.toString() === pincode)
        {
          this.stores.push(product.store);
        }else if (this.stores.indexOf(product.store) < 0 && product.city === city && pincode.length == 0)
        {
          this.stores.push(product.store);
        }else if (this.stores.indexOf(product.store) < 0 && product.pincode.toString() === pincode)
        {
          this.stores.push(product.store);
        }
      });

      if (city.length > 0 || pincode.length > 0)
        this.store = this.stores[0];          
  }    

  updateHomeImage()
  {
    this.homeImageUrl = this.imageHome + '/' + 'Products' + '/' + this.categoryName + '/' + this.subCategoryName + '.jpg';
  }

  getSideBar()
  {
    this.isSideBarExpand = this.sidebarservice.getExpanding();
  }

  getDescription(): string|undefined
  {
    return ECommerceDetails.getDetails(this.categoryName+'-'+this.subCategoryName);
  }

  onProductClick(productId: number, storeName: string, pincode: number, city: string)
  {
    this.router.navigate(['/productdetail/'], {queryParams: {productId: productId.toString(), storeName: storeName, pincode: pincode.toString(), city: city}});    
  }

  getImageName(product: Products): string
  {
    return this.imageHomePath + product.productId + '~' + '1' + '~' + product.image;
  }

  getTooltipImageName(product: Products): string
  {
    return product.productId.toString();
  }

  onSelectCity(city: string): void
  {
    this.getPincodes(city);
    this.getStores(city, this.pincode.toString());

    this.updateProducts(city, this.pincode.toString(), this.store);
  }

  onSelectPincode(pincode: string): void
  {
    this.getStores(this.city, pincode);

    this.updateProducts(this.city, pincode, this.store);
  }

  onSelectStore(store: string): void
  {
    this.store = store;

    this.updateProducts(this.city, this.pincode.toString(), store);
  }

  onSelectSort(sort: string): void
  {
    if (sort === 'Price')
      this.viewproducts.products.sort(function(a, b){return a.price - b.price});
    else if (sort === 'Items left')
      this.viewproducts.products.sort(function(a, b){return a.count - b.count});   
  }
  
  onClickSort(): void
  {
    this.isAscending = !this.isAscending;

    if (this.isAscending === true)
    {
      document.getElementById('sort')?.classList.remove('bi-sort-alpha-down');
      document.getElementById('sort')?.classList.add('bi-sort-alpha-up');
    }else
    {
      document.getElementById('sort')?.classList.remove('bi-sort-alpha-up');
      document.getElementById('sort')?.classList.add('bi-sort-alpha-down');
    }

    if (this.isAscending === true && this.sort === 'Price')
      this.viewproducts.products.sort(function(a, b){return a.price - b.price});
    else if (this.isAscending === false && this.sort === 'Price')
      this.viewproducts.products.sort(function(a, b){return b.price - a.price});
    else if (this.isAscending === true && this.sort === 'Items left')
      this.viewproducts.products.sort(function(a, b){return a.count - b.count});
    else if (this.isAscending === false && this.sort === 'Items left')
      this.viewproducts.products.sort(function(a, b){return b.count - a.count});         
  }

  updateViewProducts(response: any)
  {
    this.products = response;

    this.products.products.forEach(product => {
      this.viewproducts.products.push(product);
    });
  }

  updateProducts(city: string, pincode: string, store: string)
  {
    this.viewproducts.products = [];

    this.products.products.forEach(product => {
      if (city.length === 0 &&
        (pincode.length === 1 || pincode.length === 0) &&
        store.length === 0)
      {
        this.viewproducts.products.push(product);
      }      
      else if (city.length > 0 && product.city === city && 
          pincode.length > 0 && product.pincode.toString() === pincode
          && store.length > 0 && product.store === store)
      {
        this.viewproducts.products.push(product);
      }else if (city.length === 0 && 
                pincode.length > 0 && product.pincode.toString() === pincode
                && store.length > 0 && product.store === store)
      {
        this.viewproducts.products.push(product);
      }else if (city.length === 0 && 
                (pincode.length === 1 || pincode.length === 0) &&
                store.length > 0 && product.store === store)
      {
        this.viewproducts.products.push(product);
      }else if (city.length > 0 && product.city === city && 
                pincode.length === 1 &&
                store.length > 0 && product.store === store)
      {
        this.viewproducts.products.push(product);
      }else if (city.length > 0 && product.city === city && 
        pincode.length > 0 && product.pincode.toString() === pincode &&
        store.length === 0)
      {
        this.viewproducts.products.push(product);
      }
    });
  }

  updateLayout()
  {
    if (this.isSideBarExpand === true){
      document.getElementById('productshome')?.classList.remove('eCommerce-sidebar-home-collapse');
      document.getElementById('productshome')?.classList.add('eCommerce-sidebar-home-expand');

      document.getElementById('productshomeimage')?.classList.remove('eCommerce-sidebar-home-collapse');
      document.getElementById('productshomeimage')?.classList.add('eCommerce-sidebar-home-expand');

      document.getElementById('productstitle')?.classList.remove('eCommerce-sidebar-home-collapse');
      document.getElementById('productstitle')?.classList.add('eCommerce-sidebar-home-expand');
      
      document.getElementById('productsdescription')?.classList.remove('eCommerce-sidebar-home-collapse');
      document.getElementById('productsdescription')?.classList.add('eCommerce-sidebar-home-expand');
      
      document.getElementById('products')?.classList.remove('eCommerce-sidebar-home-collapse');
      document.getElementById('products')?.classList.add('eCommerce-sidebar-home-expand');
      
      document.getElementById('about')?.classList.remove('eCommerce-sidebar-home-collapse');
      document.getElementById('about')?.classList.add('eCommerce-sidebar-home-expand');
      
      document.getElementById('navbar')?.classList.remove('eCommerce-sidebar-home-collapse');
      document.getElementById('navbar')?.classList.add('eCommerce-sidebar-home-expand');
      
      document.getElementById('filter')?.classList.remove('eCommerce-sidebar-home-collapse');
      document.getElementById('filter')?.classList.add('eCommerce-sidebar-home-expand');
      
      document.getElementById('breadcrumb')?.classList.remove('eCommerce-sidebar-home-collapse');
      document.getElementById('breadcrumb')?.classList.add('eCommerce-sidebar-home-expand');         
    }
    else{    
      document.getElementById('productshome')?.classList.remove('eCommerce-sidebar-home-expand');
      document.getElementById('productshome')?.classList.add('eCommerce-sidebar-home-collapse');

      document.getElementById('productshomeimage')?.classList.remove('eCommerce-sidebar-home-expand');
      document.getElementById('productshomeimage')?.classList.add('eCommerce-sidebar-home-collapse');

      document.getElementById('productstitle')?.classList.remove('eCommerce-sidebar-home-expand');
      document.getElementById('productstitle')?.classList.add('eCommerce-sidebar-home-collapse');

      document.getElementById('productsdescription')?.classList.remove('eCommerce-sidebar-home-expand');
      document.getElementById('productsdescription')?.classList.add('eCommerce-sidebar-home-collapse');
      
      document.getElementById('products')?.classList.remove('eCommerce-sidebar-home-expand');
      document.getElementById('products')?.classList.add('eCommerce-sidebar-home-collapse');
      
      document.getElementById('about')?.classList.remove('eCommerce-sidebar-home-expand');
      document.getElementById('about')?.classList.add('eCommerce-sidebar-home-collapse');
      
      document.getElementById('navbar')?.classList.remove('eCommerce-sidebar-home-expand');
      document.getElementById('navbar')?.classList.add('eCommerce-sidebar-home-collapse');
      
      document.getElementById('filter')?.classList.remove('eCommerce-sidebar-home-expand');
      document.getElementById('filter')?.classList.add('eCommerce-sidebar-home-collapse');
      
      document.getElementById('breadcrumb')?.classList.remove('eCommerce-sidebar-home-expand');
      document.getElementById('breadcrumb')?.classList.add('eCommerce-sidebar-home-collapse');       
    }  
  }
}
