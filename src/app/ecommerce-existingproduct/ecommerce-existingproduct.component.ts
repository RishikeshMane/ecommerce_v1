import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { ExistingProductService } from '../shared/services/existingproduct-service.service';
import { ProductDetail } from '../shared/model/product-detail.model';
import { ECommerceUtils } from '../shared/utilities/eCommerce-utils';
import { ProductService } from '../shared/services/product-service.service';
import { CategoryList } from '../shared/model/category-list.model';
import { ProductVariable } from '../shared/model/product-variable.model';
import { ImageStatusDetail } from '../shared/model/imagestatus-detail.model';
import { VariableIndex } from '../shared/model/variable-index.model';
import { ProductImageDetail } from '../shared/model/productimage-detail.model';
import { SideBarService } from '../shared/services/side-bar.service';
import { LoginStatusService } from '../shared/services/login-status.service';
import { CurrentLoginService } from '../shared/services/current-login.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-ecommerce-existingproduct',
  templateUrl: './ecommerce-existingproduct.component.html',
  styleUrls: ['../app-bagwani.component.css']
})
export class ECommerceExistingProductComponent implements OnInit 
{
  productData: any[]=[];
  productCount: number=10;
  productLimit: number=10;

  selectedProductIds: string[] = [];
  selectedProductId: string = '';

  categories: CategoryList = new CategoryList();

  productDetail: ProductDetail = new ProductDetail;
  variables = new Map<number, ProductVariable>([[1, new ProductVariable(1)]]);
  
  variableIndex: VariableIndex = new VariableIndex;

  imageHomePath: string = ECommerceUtils.FILEHOSTING + 'FileSystem/Product/';

  imageStatusDetail: ImageStatusDetail = new ImageStatusDetail;
  productimages: ProductImageDetail[] = [];

  toBeAddedProductIds: string[] = [];

  productAdded: boolean = true;

  isSideBarExpand: boolean = true;
  descriptionWidth: number = 370;  

  constructor(private router: Router,
              private productservice: ProductService,
              private existingProductservice: ExistingProductService,
              private sidebarservice: SideBarService,
              private loginStatusservice: LoginStatusService,
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
    this.initialize();
  }

  getSideBar()
  {
    this.isSideBarExpand = this.sidebarservice.getExpanding();
  }  

  initialize(): void
  {
    this.productAdded = true;
    this.getProductIds();
    this.getCategories();
  }

  getProductIds(): void
  {
    let productId = ECommerceUtils.getUserProductId();
    this.existingProductservice.getExistingProductIds(productId)
    .subscribe(
      (response) => {
        this.updateProductIds(response);
      },
      (error) => {
        console.error(error);
      }
    )    
  }

  getCategories(): void
  {
    this.productservice.getCategories()
    .subscribe(
      (response) => {
        this.updateCategories(response);
        this.refreshProductDetail();
      },
      (error) => {
        console.error(error);
      }
    )
  }

  refreshProductDetail()
  {
    let mobileNo = sessionStorage.getItem('mobileno')?.toString() ?? '9999999999';
    this.productDetail.userMobileNo = parseInt(mobileNo);

    let pincode = sessionStorage.getItem('pincode')?.toString() ?? '999999';
    
    let userProductId: string = ECommerceUtils.getProductId(mobileNo, pincode);

    this.getExistingProductDetails(userProductId);
  }
  
  getExistingProductDetails(userProductId: string)
  {
    this.existingProductservice.getExistingProductDetails(userProductId)
    .subscribe(
      (response) => {
        this.updateProductDetail(response);
      },
      (error) => {
        console.error(error);
      }
      )   
  }

  updateProductDetail(productDetails : ProductDetail[] )
  {
    let index = 1;
    this.productData = [];
    productDetails.forEach(productDetail => {
      
      let productData = { 
                          "id": "",
                          "productid": "",
                          "title": "",
                          "description": "",
                          "category": "",
                          "subcategory": "",
                        };
      
      productData.id = index.toString();
      productData.productid = productDetail.userProductId;
      productData.title = productDetail.title;
      productData.description = productDetail.description;

      productData.category = ECommerceUtils.getCategoryName(productDetail.categoryLinkId, this.categories);
      productData.subcategory = ECommerceUtils.getSubCategoryName(productDetail.categoryLinkId, productDetail.subCategoryLinkId, this.categories);

      index++;
      this.productData.push(productData);      
      });
  }

  updateCategories(categories: CategoryList)
  {
    this.categories.category = [];
    this.categories = categories;
  }

  updateProductIds(response: string[])
  {
    this.selectedProductIds = response;
  }

  onProductSelect(row: any)
  {
    this.initializeProductDetail();

    this.productAdded = true;
    this.productDetail.title = row.title;
    this.productDetail.description = row.description;
    this.productDetail.userProductId = row.productid;
    this.imageStatusDetail.showhide = false;

    this.variableIndex.productId = row.productid;

    this.getSelectedProductVariable(row);

    this.updateAllImages();
  }

  initializeProductDetail()
  {
    this.productDetail.title = '';
    this.productDetail.description = '';
    this.imageStatusDetail.showhide = false;

    this.productDetail.productVariables = [];

    this.variables.clear();
    this.variables = new Map<number, ProductVariable>([[1, new ProductVariable(1)]]);
  }

  updateAllImages()
  {
    this.productDetail.userProductId;
  }

  onSelectDelete(row: any, event: any)
  {
    if (event.target.checked)
      this.toBeAddedProductIds.push(row.productid);
    else
      this.toBeAddedProductIds.splice(this.toBeAddedProductIds.indexOf(row.productid));
  }

  onSelectProductId(productId: string)
  {
    let userProductId = ECommerceUtils.getUserProductId();
    
    if (productId.length === 0)
      productId = '*';
    
    this.getSelectedProducts(userProductId, productId);
  }

  getSelectedProducts(userProductId: string, productId: string)
  {
    this.existingProductservice.getSelectedProducts(userProductId, productId)
    .subscribe(
      (response) => {
        this.updateProductDetail(response);
      },
      (error) => {
        console.error(error);
      }
      )
  }

  getSelectedProductVariable(row: any)
  {
    this.productservice.getProductVariable(row.productid).subscribe(
      response => {
        console.log("getSelectedProductVariable");
        this.updateProductVariables(response);
      },
      error => {
        console.log(error);
        if (error.status){
          console.log("getSelectedProductVariable");
        }else{
          console.log(error);
        }
      }
    );
  }
  
  updateProductVariables(productVariables: ProductVariable[]){
    this.variables.clear();

    productVariables.forEach(variable =>{
      this.variables.set(variable.index, variable);
      this.productDetail.productVariables.push(variable);
    });
  }  

  onShowImages(imageStatusDetail: ImageStatusDetail)
  {
    let variables = new Map<number, ProductVariable>([[1, new ProductVariable(1)]]);
    
    this.variables.forEach((value: ProductVariable, key: number) => {
      
      if (key === imageStatusDetail.index){
        value.imageShow = imageStatusDetail.showhide;
      }

      variables.set(key, value);
    });

    this.variables.clear();

    variables.forEach((value: ProductVariable, key: number) => {
      this.variables.set(key, value);
    });

    this.imageStatusDetail = imageStatusDetail;

    this.updateImages();
  }

  updateImages(): void
  {
    this.productimages = [];

    this.variables.forEach((value: ProductVariable, key: number) => {
      
      if (key === this.imageStatusDetail.index){
        value.imageUrls.forEach(image => {
          this.productimages.push(new ProductImageDetail(this.imageHomePath+this.productDetail.userProductId+'~'+this.imageStatusDetail.index+'~'+image, false));
        });
      }
    });    
  }


  onAddProduct()
  {
    let mobileNo = sessionStorage.getItem('mobileno')?.toString() ?? '9999999999';
    let userProductId = ECommerceUtils.getUserProductId();
    this.productAdded = true;

    this.existingProductservice.copyProduct(mobileNo, this.productDetail.userProductId, userProductId).subscribe(
      response => {
        this.productAdded = false;
        console.log("copyProduct");
      },
      error => {
        console.log(error);
        if (error.status){
          console.log("copyProduct");
        }else{
          console.log(error);
        }
      }
    );    
  }

  onAddExistingProduct()
  {
    let mobileNo = sessionStorage.getItem('mobileno')?.toString() ?? '9999999999';
    let userProductId = ECommerceUtils.getUserProductId();
    this.productAdded = true;

    if (this.toBeAddedProductIds.length > 0){
      this.existingProductservice.copyProducts(mobileNo, this.toBeAddedProductIds, userProductId).subscribe(
        response => {
          this.productAdded = false;
          console.log("copyProduct");
        },
        error => {
          console.log(error);
          if (error.status){
            console.log("copyProduct");
          }else{
            console.log(error);
          }
        }
      );
    }
    else{
      swal.fire({
        title: 'Select Product',
        text: 'Please Select Product',
        ///background: '#339B7C',
        confirmButtonText: 'Ok',
        confirmButtonColor: '#339B7C'
      });      
    }  
  }

  updateLayout()
  {
    if (this.isSideBarExpand === true){
      document.getElementById('navMain')?.classList.remove('eCommerce-sidebar-margin-colapse');
      document.getElementById('navMain')?.classList.add('eCommerce-sidebar-margin-expand');

      document.getElementById('navSuccess')?.classList.remove('eCommerce-sidebar-margin-colapse');
      document.getElementById('navSuccess')?.classList.add('eCommerce-sidebar-margin-expand');
      
      document.getElementById('productTable')?.classList.remove('eCommerce-sidebar-margin-colapse');
      document.getElementById('productTable')?.classList.add('eCommerce-sidebar-margin-expand');

      document.getElementById('headingTable')?.classList.remove('eCommerce-sidebar-margin-colapse');
      document.getElementById('headingTable')?.classList.add('eCommerce-sidebar-margin-expand');

      this.descriptionWidth = 370;     
    }
    else{
      document.getElementById('navMain')?.classList.remove('eCommerce-sidebar-margin-expand');
      document.getElementById('navMain')?.classList.add('eCommerce-sidebar-margin-colapse');

      document.getElementById('navSuccess')?.classList.remove('eCommerce-sidebar-margin-expand');
      document.getElementById('navSuccess')?.classList.add('eCommerce-sidebar-margin-colapse');
      
      document.getElementById('productTable')?.classList.remove('eCommerce-sidebar-margin-expand');
      document.getElementById('productTable')?.classList.add('eCommerce-sidebar-margin-colapse');

      document.getElementById('headingTable')?.classList.remove('eCommerce-sidebar-margin-expand');
      document.getElementById('headingTable')?.classList.add('eCommerce-sidebar-margin-colapse');      
      
      this.descriptionWidth = 512;
    }    
  }  
}
