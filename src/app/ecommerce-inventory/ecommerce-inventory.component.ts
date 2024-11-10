import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { ProductService } from '../shared/services/product-service.service';
import { ProductDetail } from '../shared/model/product-detail.model';
import { ProductVariable } from '../shared/model/product-variable.model';
import { CategoryList } from '../shared/model/category-list.model';
import { ECommerceUtils } from '../shared/utilities/eCommerce-utils';
import { ImageStatusDetail } from '../shared/model/imagestatus-detail.model';
import { ProductImageDetail } from '../shared/model/productimage-detail.model';
import { VariableIndex } from '../shared/model/variable-index.model';
import { SideBarService } from '../shared/services/side-bar.service';
import { LoginStatusService } from '../shared/services/login-status.service';
import { CurrentLoginService } from '../shared/services/current-login.service';

@Component({
  selector: 'app-ecommerce-inventory',
  templateUrl: './ecommerce-inventory.component.html',
  styleUrls: ['../app-bagwani.component.css']
})

export class ECommerceInventoryComponent implements OnInit
{
  productData: any[]=[];
  productCount: number=10;
  productLimit: number=10;

  productDetail: ProductDetail = new ProductDetail;
  variables = new Map<number, ProductVariable>([[1, new ProductVariable(1)]]);

  categories: CategoryList = new CategoryList();
  subCategories: string[] = [];

  selectedCategory: string = '';
  selectedSubCategory: string = '';

  variableIndex: VariableIndex = new VariableIndex;

  imageHomePath: string = ECommerceUtils.FILEHOSTING + 'FileSystem/Product/';
  productimages: ProductImageDetail[] = [];

  tbdRow: any;

  imageStatusDetail: ImageStatusDetail = new ImageStatusDetail;
  productAdded: boolean = true;

  title: string = '';

  files: File[]=[];

  isSideBarExpand: boolean = true;
  descriptionWidth: number = 330;

  image2: string = '';

  constructor(private router: Router,
              private productservice: ProductService,
              private sidebarservice: SideBarService,
              private loginStatusservice: LoginStatusService,
              private currentLoginservice: CurrentLoginService) { }

  ngOnInit(): void
  {
    this.productAdded = true;

    this.loginStatusservice.setLogin(false);
    this.currentLoginservice.setCurrentLogin(false);

    this.getSideBar();

    this.sidebarservice.getExpand().subscribe(
      (isExpand)=>{
        this.isSideBarExpand = isExpand;
        this.updateLayout();
      });

    this.initialize();
    this.updateLayout();
  }

  initialize(): void
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

  initializeProductDetail()
  {
    this.productDetail.title = '';
    this.productDetail.description = '';
    this.imageStatusDetail.showhide = false;

    this.productDetail.productVariables = [];

    this.variables.clear();
    this.variables = new Map<number, ProductVariable>([[1, new ProductVariable(1)]]);
  }

  getSideBar()
  {
    this.isSideBarExpand = this.sidebarservice.getExpanding();
  }  

  onAddNewProduct()
  {  
    this.productDetail.addUpdate = 'Add';
    this.productDetail.userProductId = 'Add';
    this.variableIndex.productId = 'Add';
    this.title = 'Add Product';
    this.productAdded = true;
    this.onCancelProduct();
    this.initializeProductDetail();
  }

  refreshProductDetail()
  {
    let mobileNo = sessionStorage.getItem('mobileno')?.toString() ?? '9999999999';
    this.productDetail.userMobileNo = parseInt(mobileNo);

    let pincode = sessionStorage.getItem('pincode')?.toString() ?? '999999';
    
    let userProductId: string = ECommerceUtils.getProductId(mobileNo, pincode);

    this.getProductDetail(userProductId);
  }

  getProductDetail(userProductId: string)
  {
    this.productservice.getProductDetail(userProductId)
    .subscribe(
      (response) => {
        this.updateProductDetail(response);
      },
      (error) => {
        console.error(error);
      }
      )      
  }

  updateCategories(categories: CategoryList)
  {
    this.categories.category = [];
    this.categories = categories;
    this.selectedCategory = categories.category[0].category;
    this.getSubCategories(categories.category[0].category);
    this.selectedSubCategory = categories.category[0].subCategories[0];

    this.productDetail.categoryLinkId = categories.category[0].categoryLinkId;
    this.productDetail.subCategoryLinkId = categories.category[0].subCategoryLinkIds[0];
  }

  updateProductDetail(productDetails : ProductDetail[])
  {
    let index = 1;
    this.productData = [];
    productDetails.forEach(productDetail => {
      
      let productData = { 
                          "id": "",
                          "productid": "",
                          "title": "",
                          "description": "",
                          "count": "",
                          "category": "",
                          "subcategory": "",
                        };
      
      productData.id = index.toString();
      productData.productid = productDetail.userProductId;
      productData.title = productDetail.title;
      productData.description = productDetail.description;
      productData.category = ECommerceUtils.getCategoryName(productDetail.categoryLinkId, this.categories);
      productData.subcategory = ECommerceUtils.getSubCategoryName(productDetail.categoryLinkId, productDetail.subCategoryLinkId, this.categories);

      let count = 0;
      productDetail.productVariables?.forEach(variable => {
                                              count += variable.inventory;
                                            });
      productData.count = count.toString();
      index++;
      this.productData.push(productData);
    }
    
    );
  }

  onSelectCategory(category: string)
  {
    this.getSubCategories(category);
  }

  onSelectSubCategory(subCategory: string)
  {
    this.categories.category.filter(categoryDetail => {
      if (categoryDetail.categoryLinkId === this.productDetail.categoryLinkId)
      {
        let index = 0;
        categoryDetail.subCategories.forEach(subcategory => {
          if (subcategory === subCategory)
          {
            this.productDetail.subCategoryLinkId = categoryDetail.subCategoryLinkIds[index];
          }
          index = index+1;
        });
      }
    });    
  }
  
  getSubCategories(category: string, subcategory: string='')
  {
    this.subCategories = [];

    this.categories.category.filter(categoryDetail => {
      if (categoryDetail.category === category)
      {
        let index = 0;
        categoryDetail.subCategories.forEach(subCategory => {
          this.subCategories.push(subCategory);

          if (subcategory === subCategory)
          {
            this.productDetail.subCategoryLinkId = categoryDetail.subCategoryLinkIds[index];
          }
          else if (subcategory.length == 0)
          {
            this.productDetail.subCategoryLinkId = 1;
          }

          ++index;
        });      

        this.productDetail.categoryLinkId = categoryDetail.categoryLinkId;
      }
    });
  }

  onProductSelect(row: any)
  {
    this.title = row.productid;
    this.productDetail.addUpdate = 'Update';
    this.productDetail.userProductId = row.productid;    
    this.onCancelProductSel();
    this.initializeProductDetail();

    this.productDetail.userProductId = row.productid;
    this.productDetail.title = row.title;
    this.productDetail.description = row.description;    
    this.imageStatusDetail.showhide = false;
    this.productAdded = true;

    this.variableIndex.productId = row.productid;

    this.getSelectedProductVariable(row);

    this.getSubCategories(row.category, row.subcategory);
    this.selectedCategory = row.category;
    this.selectedSubCategory = row.subcategory;

    ///this.copyFiles(this.productDetail.userProductId);
    this.updateAllImages();
  }

  onAddProductVariable(): void
  {
    let max:number=0;
    this.variables.forEach((value: ProductVariable, key: number) => {
      max=Math.max(max, key);
    });
    this.variables.set(max+1, new ProductVariable(max+1));
  }

  onDeleteRow(index: number)
  {
    this.updateImageShowHide(index);    
    this.variables.delete(index);

    this.deleteImages(index);
    this.deleteIndexedImages(index);
  }

  onUpdateProductVariable(productVariable: ProductVariable)
  {
    this.variables.set(productVariable.index, productVariable);
  }

  updateImageShowHide(index: number)
  {
    if (this.imageStatusDetail.index === index)
      this.imageStatusDetail.showhide = false;
  }

  mapProductVariable()
  {
    this.productDetail.productVariables = [];

    this.variables.forEach((value: ProductVariable, key: number) => {
      this.productDetail.productVariables.push(value);
    });
  }

  onUpsertProduct(): void
  {
    let mobileNo = sessionStorage.getItem('mobileno')?.toString() ?? '9999999999';
    this.productDetail.userMobileNo = parseInt(mobileNo);

    let pincode = sessionStorage.getItem('pincode')?.toString() ?? '999999';

    if (this.productDetail.addUpdate === 'Add')
      this.productDetail.userProductId = ECommerceUtils.getProductId(mobileNo, pincode);

    this.mapProductVariable();

    this.upsertProduct();
  }

  updateAllImages()
  {
    this.productDetail.userProductId;
  }

  onCancelProduct(): void
  {
    let mobileNo = sessionStorage.getItem('mobileno')?.toString() ?? '9999999999';

    this.productservice.deleteJunkFiles(mobileNo, this.productDetail.userProductId, this.productDetail.addUpdate).subscribe(
      response => {
        console.log("Junk Files delete");
      },
      error => {
        console.log(error);
        if (error.status){
          console.log("Junk Files delete");
        }else{
          console.log(error);
        }
      }
    );
  }

  onCancelProductSel()
  {
    let mobileNo = sessionStorage.getItem('mobileno')?.toString() ?? '9999999999';

    this.productservice.deleteJunkFiles(mobileNo, this.productDetail.userProductId, this.productDetail.addUpdate).subscribe(
      response => {
        console.log("Junk Files delete");
        this.copyFiles(this.productDetail.userProductId);
      },
      error => {
        console.log(error);
        if (error.status){
          console.log("Junk Files delete");
        }else{
          console.log(error);
        }
      }
    );    
  }

  upsertProduct()
  {
    this.productservice.upsertProduct(this.productDetail).subscribe(
      response => {
        console.log("Product upsert");
        if (this.productDetail.addUpdate === 'Add')
          this.productAdded = false;
        this.refreshProductDetail();
      },
      error => {
        console.log(error);
        if (error.status){
          console.log("Product upsert");
        }else{
          console.log(error);
        }
      }
    );
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

  productDelete()
  {
    this.productservice.deleteProduct(this.tbdRow.productid).subscribe(
      response => {
        console.log("onProductDelete");
        this.refreshProductDetail();
      },
      error => {
        console.log(error);
        if (error.status){
          console.log("onProductDelete");
        }else{
          console.log(error);
        }
      }
    );
  }

  onProductDelete(row: any)
  {
    this.tbdRow = row;
  }

  updateProductVariables(productVariables: ProductVariable[]){
    this.variables.clear();

    productVariables.forEach(variable =>{
      this.variables.set(variable.index, variable);
      this.productDetail.productVariables.push(variable);
    });
  }

  getImageName(image: string): string
  {
    let imageName: string = '';

    imageName = image.substring(image.lastIndexOf('\/')+1);

    return imageName;
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

    let mobileno = sessionStorage.getItem('mobileno')?.toString() ?? '9999999999';

    let imageRoot = 'Temp'+ '~' + mobileno +'~' + 'Add';
    if (this.productDetail.userProductId !== 'Add')
      imageRoot = 'Temp' + '~' + this.productDetail.userProductId;

    this.variables.forEach((value: ProductVariable, key: number) => {
      
      if (key === this.imageStatusDetail.index){
        value.imageUrls.forEach(image => {
          this.productimages.push(new ProductImageDetail(this.imageHomePath+imageRoot+'~'+this.imageStatusDetail.index+'~'+image, false));
        });
      }
    });    
  }

  deleteImages(index: number): void
  {
    if (this.imageStatusDetail.index === index)
      this.productimages = [];
  }

  deleteIndexedImages(index: number): void
  {
    let variableIndex:VariableIndex = new VariableIndex;
    variableIndex.productId = this.productDetail.userProductId;
    variableIndex.index = index;

    let mobileno: string  = sessionStorage.getItem('mobileno')?.toString() ?? '9999999999';

    this.productservice.deleteFiles(variableIndex, mobileno).subscribe(
      response => {
        console.log("Images deleted");
      },
      error => {
        console.log(error);
        if (error.status){
          console.log("Images deleted");
        }else{
          console.log(error);
        }
      }
    );
  }  

  onAddNewImage(event: any)
  {
    console.log(event.target.files[0]);

    const file:File = event.target.files[0];

    if (file) {
      this.files.push(file);

      let fileName: string = file.name;
      const formData = new FormData();
      formData.append("thumbnail", file);
      formData.append("productId", this.productDetail.userProductId.length!==0 ? this.productDetail.userProductId : 'Add');
      formData.append("index", this.imageStatusDetail.index.toString());
      formData.append("mobileNo", sessionStorage.getItem('mobileno')?.toString() ?? '9999999999');

      let fileExtension: string = fileName.substring(fileName.lastIndexOf('.'));

      let imagename = Math.floor(Math.random() * 10000) + fileExtension;

      ///let productVariable1: ProductVariable = new ProductVariable(1);
      ///productVariable1 = this.productDetail.productVariables[this.imageStatusDetail.index];

      if (this.productDetail.productVariables[this.imageStatusDetail.index-1]?.imageUrls.indexOf(imagename) === -1)
        this.productDetail.productVariables[this.imageStatusDetail.index-1]?.imageUrls.push(imagename);

      ///let productVariable2: ProductVariable|undefined = new ProductVariable(1);
      ///productVariable2 = this.variables.get(this.imageStatusDetail.index);
      if (this.variables.get(this.imageStatusDetail.index)?.imageUrls.indexOf(imagename) === -1)
        this.variables.get(this.imageStatusDetail.index)?.imageUrls.push(imagename);

      formData.append("imageName", imagename);

      this.productservice.uploadFiles(formData)
      .subscribe(
        (response) => {
          console.log('Image Uploaded');
          this.showImages();
        },
        (error) => {
          console.error(error);
        }
        )
    }  
  }

  showImages()
  {
    this.productimages = [];
    let imageUrls: string[]|undefined = this.variables.get(this.imageStatusDetail.index)?.imageUrls;
    let mobileno: string  = sessionStorage.getItem('mobileno')?.toString() ?? '9999999999';

    let imageRoot = 'Temp'+ '~' + mobileno +'~' + 'Add';
    if (this.productDetail.userProductId !== 'Add')
      imageRoot = 'Temp' + '~' + this.productDetail.userProductId;

    imageUrls?.forEach(image =>{
      this.productimages.push(new ProductImageDetail(this.imageHomePath+imageRoot+'~'+this.imageStatusDetail.index+'~'+image, false));
    })
  }

  onImageCheck(productimage: ProductImageDetail, event: any)
  {
    this.productimages.forEach(image =>{
      if (image.imageName === productimage.imageName){
        image.showHide = event.target.checked;
      }
    })
  }

  onDeleteImages()
  {
    let index: number = 0;
    let mobileno: string  = sessionStorage.getItem('mobileno')?.toString() ?? '9999999999';
    
    this.variableIndex.index = this.imageStatusDetail.index;
    this.variableIndex.imagesUrls = [];

    while (this.productimages.length !== index)
    {
      if (this.productimages[index].showHide === true){
        let imageName: string = this.productimages[index].imageName;
        let count = this.productimages.splice(index, 1);
        index=0;

        this.variableIndex.imagesUrls.push(this.getImageName(imageName));

        let indexdel = this.productDetail.productVariables[this.imageStatusDetail.index]?.imageUrls.indexOf(this.getImageName(imageName));
        this.productDetail.productVariables[this.imageStatusDetail.index]?.imageUrls.splice(indexdel, 1);

        indexdel = this.variables.get(this.imageStatusDetail.index)?.imageUrls.indexOf(this.getImageName(imageName)) ?? -1;
        this.variables.get(this.imageStatusDetail.index)?.imageUrls.splice(indexdel, 1);
      }else{
        ++index;
      }
    }

    this.productservice.deleteFiles(this.variableIndex, mobileno).subscribe(
      response => {
        console.log("Images deleted");
      },
      error => {
        console.log(error);
        if (error.status){
          console.log("Images deleted");
        }else{
          console.log(error);
        }
      }
    );
  }

  copyFiles(productId: string ): void
  {
    let variableIndex: VariableIndex = new VariableIndex;
    variableIndex.productId = productId;

    this.productservice.copyFiles(variableIndex).subscribe(
      response => {
        console.log("Images copied");
      },
      error => {
        console.log(error);
        if (error.status){
          console.log("Images copied");
        }else{
          console.log(error);
        }
      }
    );
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

      this.descriptionWidth = 330;     
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
      
      this.descriptionWidth = 472;
    }    
  }
}