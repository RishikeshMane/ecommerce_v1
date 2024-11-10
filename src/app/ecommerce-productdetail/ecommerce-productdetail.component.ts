import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { SideBarService } from '../shared/services/side-bar.service';
import { ProductDetailService } from '../shared/services/productdetail-service.service';
import { ProductDetails } from '../shared/model/product-details.model';
import { ProductService } from '../shared/services/product-service.service';
import { SizeDetail } from '../shared/model/size-detail.model';
import { ColorDetail } from '../shared/model/color-detail.model';
import { GoesWellWith } from '../shared/model/goes-wellwith.model';
import { ECommerceUtils } from '../shared/utilities/eCommerce-utils';
import { ECommerceDetails } from '../shared/data/eCommerce-details.data';
import { LoginStatusService } from '../shared/services/login-status.service';
import { CurrentLoginService } from '../shared/services/current-login.service';
import { ShoppingCartService } from '../shared/services/shopping-cart.service';
import { ShoppingCart } from '../shared/model/shoppingcart.model';
import { CartService } from '../shared/services/cart.service';
import { OrderService } from '../shared/services/order-service.service';
import { ShoppingCartDetails, ShoppingProductDetail } from '../shared/model/shoppingcartdetails.model';
import swal from 'sweetalert2';

declare var Razorpay: any;
declare var emailjs: any;

@Component({
  selector: 'app-ecommerce-productdetail',
  templateUrl: './ecommerce-productdetail.component.html',
  styleUrls: ['../app-bagwani.component.css']
})

export class ECommerceProductDetailComponent implements OnInit 
{
  isSideBarExpand: boolean = true;

  productId: string='';
  storeName: string='';
  pincode: string='';
  city: string='';
  supplierMobileno: number=0;

  productDetails: ProductDetails = new ProductDetails;

  sizes: SizeDetail[]=[];
  colors: ColorDetail[]=[];
  selectedSize: number = -1;
  selectedColor: number = -1;
  selectedSizeName: string = '';
  selectedColorName: string = '';  
  selectedPrice: number = 0;
  selectedCount: number = 0;
  selectedProductVariable = -1;

  sizeStyleSelect: string = 'eCommerce-nav-button-reverse';
  sizeStyleUnSelect: string = 'eCommerce-nav-button';
  sizeStyle: string[] = [];

  public colorStyle = [
    { red: 51, green: 155, blue: 124 }
  ];

  colorBorderSelected: string = 'eCommerce-nav-button-border-selected';
  colorBorderUnSelected: string = 'eCommerce-nav-button-border-unselected';
  colorBorderStyle: string[] = [];

  imageSelected: string = 'eCommerce-product-image-selected';
  imageUnSelected: string = 'eCommerce-product-image-unselected';
  imageBorderStyle: string[] = [];

  deliveryPincode: string = '';
  showPincode: string = '';
  loginPincode: string = '';
  count: number = 1;
  isDelivery: string = '';
  canDelivered: string = 'true';
  isLoginFirst: string = 'true';

  productImages: string []=[];
  imageHome: string = "assets/eCommerce-Images";
  imageHomePath: string = ECommerceUtils.FILEHOSTING + 'FileSystem/Product/';

  headImage: string='';
  headImageFolder: string='';

  goesWellWith: GoesWellWith []=[];

  comment: string='';
  itemsPerPage: number=3;
  currentPage: number=1;
  totalItems: number=0;

  addComment: boolean=true;
  rating: number=5;
  handlingCharges: number = ECommerceUtils.getHandlingCharges();
  precentageFees: number = ECommerceUtils.getPercentageFees();

  shoppingCart: ShoppingCartDetails = new ShoppingCartDetails();
  summaryTotal: number=0;
  shoppingAddressIndex: number=0;
  shippingAddress1: string='';
  shippingAddress2: string='';
  shippingAddress3: string='';
  shippingAddress4: string='';
  ///moreAddressCount: number=0;
  ///changeAddressIndex: number=0;

  constructor(private router: Router,
              private activatedRoute:ActivatedRoute,
              private sidebarservice: SideBarService,
              private loginStatusservice: LoginStatusService,
              private productservice: ProductService,
              private productdetailservice: ProductDetailService,
              private shoppingCartservice:ShoppingCartService,
              private cartservice:CartService,
              private currentLoginservice: CurrentLoginService,
              public orderservice: OrderService
              ) { }

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

    this.getProductDetail();
    this.getShoppingAddress();
  }

  getProductDetail()
  {
    this.productId = this.activatedRoute.snapshot.queryParamMap.get('productId')?.toString() ?? '';
    this.storeName = this.activatedRoute.snapshot.queryParamMap.get('storeName')?.toString() ?? '';
    this.pincode = this.activatedRoute.snapshot.queryParamMap.get('pincode')?.toString() ?? '';
    this.city = this.activatedRoute.snapshot.queryParamMap.get('city')?.toString() ?? '';

    sessionStorage.setItem('productproductid', this.productId);
    sessionStorage.setItem('productstoreName', this.storeName);
    sessionStorage.setItem('productpincode', this.pincode);
    sessionStorage.setItem('productcity', this.city);

    this.loginPincode = sessionStorage.getItem('pincode')?.toString()??'';        

    this.productdetailservice.getProductDetail(this.productId).subscribe(
      (response) => {
        this.updateDetails(response);
        this.initializeSizeColor();
        this.getGoesWellWith();
        this.updateShoppingCart();
      },
      (error) => {
        console.error(error);
      }
      );
  }

  getShoppingAddress()
  {
    let mobileNo = sessionStorage.getItem('mobileno')?.toString() ?? '9999999999';

    this.shoppingCartservice.getShoppingAddress(mobileNo).subscribe(
      (response: string[]) => {
        ///this.moreAddressCount = response.length-1;
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

    if (index === 0 ) e1?.setAttribute("style", "width:100%; height:100px;background-color:#D8FBD8;border: 3px solid #339B7C;");
    if (index === 1 ) e2?.setAttribute("style", "width:100%; height:100px;background-color:#D8FBD8;border: 3px solid #339B7C;");
    if (index === 2 ) e3?.setAttribute("style", "width:100%; height:100px;background-color:#D8FBD8;border: 3px solid #339B7C;");
    if (index === 3 ) e4?.setAttribute("style", "width:100%; height:100px;background-color:#D8FBD8;border: 3px solid #339B7C;");
  }
  
  onShippingAddress(index: number)
  {
    this.shoppingAddressIndex = index;

    this.updateCurrentAddress(index);
  } 

  initializeSizeColor()
  {
    this.productservice.getSizes()
    .subscribe(
      (response) => {
        this.sizes = response;
        this.updateSizeStyle(this.selectedSize);
      },
      (error) => {
        console.error(error);
      }
      )

    this.productservice.getColors()
    .subscribe(
      (response) => {
        this.colors = response;
        this.updateColorStyle(this.selectedColor);
        this.updateColorBorderStyle(this.selectedColor);
      },
      (error) => {
        console.error(error);
      }
      )
  }

  updateSizeStyle(selected: number)
  {
    this.sizeStyle = [];
    this.selectedSize = selected;
    let index = 0;
    this.sizes.forEach(size=>{
      if (index === selected)
      {
        this.sizeStyle.push(this.sizeStyleSelect);
        this.selectedSizeName = size.sizeCode;

        this.shoppingCart.productDetail[0].sizeLinkId = size.sizeLinkId;
        this.shoppingCart.productDetail[0].sizeCode = size.sizeCode;
      }
      else
        this.sizeStyle.push(this.sizeStyleUnSelect);

      ++index;
    })
  }

  updateColorStyle(selected: number)
  {
    this.colorStyle = [];
    this.selectedColor = selected;
    let index = 0;
    this.colors.forEach(color=>{
      this.colorStyle.push({red: color.red, green: color.green, blue: color.blue});
    })
  }

  updateColorBorderStyle(selected: number)
  {
    this.colorBorderStyle = [];
    let index = 0;
    this.colors.forEach(color=>{
      if (index === selected)
      {
        this.colorBorderStyle.push(this.colorBorderSelected);
        this.selectedColorName = color.description;

        this.shoppingCart.productDetail[0].colorLinkId = color.colorLinkId;
        this.shoppingCart.productDetail[0].colorName = color.description;        
      }
      else
        this.colorBorderStyle.push(this.colorBorderUnSelected);

      ++index;
    })
  }

  updateImageBorderStyle(selected: number)
  {
    this.imageBorderStyle = [];
    let index = 0;
    this.productImages.forEach(productImage=>{
      if (index === selected)
        this.imageBorderStyle.push(this.imageSelected);
      else
        this.imageBorderStyle.push(this.imageUnSelected);

      ++index;
    })
  }  

  updateDetails(productDetail: any)
  {
    this.productDetails = productDetail;
    this.supplierMobileno = this.productDetails.supplierMobileno;
    this.updateComments();
    this.updateHeadImage();
    this.updateSizeColorSelection();
    this.updateSelectedProductVariable();
    this.updateImageBorderStyle(0);
  }

  updateComments()
  {
    this.totalItems = this.productDetails.comments.length;
  }

  updateHeadImage()
  {
    if (this.productDetails.productVariables.length > 0 && 
        this.productDetails.productVariables[0].imageUrls.length > 0)
    {
      this.headImage = this.productDetails.productVariables[0].imageUrls[0];
      this.headImageFolder = '1';
    }
  }

  updateSizeColorSelection()
  {
    if (this.productDetails.productVariables.length > 0)
    {
      let index = 0;
      this.productDetails.productVariables.forEach( productVariable => {
        if (productVariable.imageUrls.length > 0 && this.selectedSize === -1)
        {
          this.selectedSize = productVariable.sizeDetail.sizeLinkId;
          this.selectedColor = productVariable.colorDetail.colorLinkId;
          this.selectedProductVariable = index;
        }
        index++;
      });
    }    
  }

  getHeadImage(): string
  {
    if (this.selectedProductVariable === -1)
    {
      return this.imageHome + '/' + 'Home' + '/' + 'NoProducts' + '/' + 'noproducts.png';
    }

    return this.imageHomePath + this.productDetails.userProductId + '~' + this.headImageFolder + '~' + this.headImage;
  }

  getGoesWellImage(index: number): string
  {
    if (index < this.goesWellWith.length)
    {
      return this.imageHomePath + this.goesWellWith[index].productId + '~' + '1' + '~' + this.goesWellWith[index].image;
    }

    return this.imageHome + '/' + 'Home' + '/' + 'NoProducts' + '/' + 'blank.png';
  }

  goesWellWithTooltip(index: number): string
  {
    if (index < this.goesWellWith.length)
    {
      return this.goesWellWith[index].productId;
    }

    return '';    
  }

  getSideBar()
  {
    this.isSideBarExpand = this.sidebarservice.getExpanding();
  }
  
  onSizeClick(index: number)
  {
    this.selectedSize = index;
    this.updateSizeStyle(index);
    this.updateSelectedProductVariable();
    this.updateImageBorderStyle(0);
  }

  onColorClick(index: number)
  {
    this.selectedColor = index;
    this.updateColorBorderStyle(index); 
    this.updateSelectedProductVariable();
    this.updateImageBorderStyle(0); 
  }

  updateSelectedProductVariable()
  {
    let index = 0;
    this.selectedProductVariable = -1;
    this.productImages = [];
    this.selectedPrice = 0;
    this.selectedCount = 0;

    this.productDetails.productVariables.forEach( productVariable => {
      if (this.selectedProductVariable === -1 && 
        productVariable.sizeDetail.sizeLinkId === this.selectedSize && 
        productVariable.colorDetail.colorLinkId === this.selectedColor)
      {
        this.selectedProductVariable = index;
        this.productImages = productVariable.imageUrls;
        this.selectedPrice = productVariable.price;
        this.selectedCount = productVariable.inventory;
      }
      index++;
    });

    this.updateProductImages();
  }

  updateProductImages()
  {
    let productImages: string[]=[];

    this.productImages.forEach(productImage => {
      if (productImage.length > 0)
      {
        let index = this.selectedProductVariable+1;
        productImages.push(this.imageHomePath + this.productDetails.userProductId + '~' + index + '~' + productImage);
      }
    });

    this.productImages = productImages;
    this.onImageClick(0, productImages[0]);
    this.getHeadImage();
  }

  onImageClick(selected: number, productImage: string)
  {
    this.headImage = productImage.substring(productImage.lastIndexOf('~')+1);

    ///this.headImage = productImage;
    let index = this.selectedProductVariable+1;
    this.headImageFolder = index.toString();
    this.updateImageBorderStyle(selected);
  }

  onProductsClick()
  {
    this.router.navigate(['/products/'], {queryParams: {category: this.productDetails.category, subCategory: this.productDetails.subCategory}}); 
  }

  onCountDecrement()
  {
    --this.count;

    if (this.count <= 0)
      this.count = 0;

    this.shoppingCart.productDetail[0].count = this.count;
  }

  onCountIncrement()
  {
    ++this.count;

    this.shoppingCart.productDetail[0].count = this.count;
  }

  onBuyNow()
  {
    this.loginPincode = sessionStorage.getItem('pincode')?.toString()??''; 
  }

  getGoesWellWith(): void
  {
    let goesWellWith = ECommerceDetails.goesWellWith();
    let goesWell: string = ECommerceUtils.goesWellWith(this.productDetails.categoryLinkId, this.productDetails.subCategoryLinkId, goesWellWith);

    this.productdetailservice.getGoesWellWith(this.productId, this.pincode, this.storeName, this.city, goesWell).subscribe(
      (response) => {
        this.updateGoesWellWith(response);
      },
      (error) => {
        console.error(error);
      }
      );
  
  }

  onGoesWellClick(index: number)
  {
    if (index < this.goesWellWith.length)
    {
      let productId = this.goesWellWith[index].productId;
      let storeName = this.goesWellWith[index].store;
      let pincode = this.goesWellWith[index].pincode;
      let city = this.goesWellWith[index].city;

      this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
        this.router.navigate(['/productdetail/'], {queryParams: {productId: productId, storeName: storeName, pincode: pincode.toString(), city: city}})}); 
    }
  }

  goesWellWithFooter(index: number): string
  {
    if (index < this.goesWellWith.length)
    {
      return this.goesWellWith[index].category + ' - ' + this.goesWellWith[index].subCategory;
    }

    return '';
  }

  goesWellWithFooterPrice(index: number): string
  {
    if (index < this.goesWellWith.length)
    {
      return this.goesWellWith[index].price.toString() + '.00';
    }

    return '';
  }  

  updateGoesWellWith(goesWellWith: GoesWellWith[])
  {
    goesWellWith.forEach(goesWell=>{
      this.goesWellWith.push(goesWell);
    })
  }

  onAddComment()
  {
    this.addComment = !this.addComment;
    this.comment = '';
    this.rating = 5;
  }

  onSubmitComment()
  {
    this.addComment = !this.addComment;

    let userId = sessionStorage.getItem('userId')?.toString() ?? '0';

    this.productdetailservice.insertProductComment(this.productId, userId, this.comment, this.rating).subscribe(
      (response) => {
        console.log("Comment added successfully");
        this.comment = '';
        this.rating = 5;
      },
      (error) => {
        console.error(error);
      }
    );  
  }

  onCancelComment()
  {
    this.addComment = !this.addComment;
  }  

  onStarClick(rating: number, fill: boolean)
  {
    if (fill === true)
    {
      this.rating = rating;
    }else
    {
      this.rating = rating-1;
    }
  }

  onCommentPageChange(event: any)
  {
    this.currentPage = event;
  }

  onCheckDelivery()
  {
    this.showPincode = this.deliveryPincode;
    this.productdetailservice.checkDelivery(this.deliveryPincode, this.productId).subscribe(
      (response: any) => {
        this.isDelivery = response.id;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  onClickShoppingCart()
  {
    ///alert('Please check the deliverable pincode for Product before proceeding by clicking "Check Delivery" button !!');
    this.loginPincode = sessionStorage.getItem('pincode')?.toString()??'';
    this.isLoginFirst = 'true';
    this.canDelivered = 'true';

    this.productdetailservice.checkDelivery(this.loginPincode, this.productId).subscribe(
      (response: any) => {
        if (response.id !== 'success')
          this.canDelivered = 'false';
        else if (response.id === 'success')
        {
          this.updateShoppingCartDB();
        }
      },
      (error) => {
        this.isLoginFirst = 'false';
        console.error(error);
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

  onClickBuyNow()
  {
    this.isLoginFirst = 'true';

    this.productdetailservice.checkDelivery(this.loginPincode, this.productId).subscribe(
      (response: any) => {
        if (response.id !== 'success')
          this.canDelivered = 'false';
        else if (response.id === 'success')
        {
          this.onProceedPayment();
        }
      },
      (error) => {
        this.isLoginFirst = 'false';
        console.error(error);
      }
    );
  }

  updateShoppingCartDB()
  {
    let mobileno = sessionStorage.getItem('mobileno')?.toString() ?? '9999999999';

    let shoppingCart: ShoppingCart = new ShoppingCart;
    shoppingCart.mobileNo = parseInt(mobileno, 10);
    shoppingCart.userProductId = this.productId;
    shoppingCart.sizeLinkId = this.selectedSize;
    shoppingCart.colorLinkId = this.selectedColor;
    shoppingCart.quantity = this.count;
    shoppingCart.price = this.selectedPrice;
    shoppingCart.supplierMobileNo = this.supplierMobileno;

    this.shoppingCartservice.updateShoppingCart(shoppingCart).subscribe(
      (response: any) => {
        this.cartservice.setUpdate(true);

        swal.fire({
          title: 'Shopping Cart',
          text: 'Product added to cart !!',
          ///background: '#339B7C',
          confirmButtonText: 'Ok',
          confirmButtonColor: '#339B7C'
        });
      },
      (error) => {

      }
    );
  }

  updateShoppingCart()
  {
    let mobileno = sessionStorage.getItem('mobileno')?.toString() ?? '9999999999';

    this.shoppingCart.mobileNo = mobileno;
    this.shoppingCart.orderId = "";
    this.shoppingCart.paymentId = "";
    this.shoppingCart.shoppingAddressIndex = this.shoppingAddressIndex;
    this.shoppingCart.clearShoppingCart = 0;
    this.shoppingCart.productDetail.push(new ShoppingProductDetail);
    this.shoppingCart.productDetail[0].colorLinkId = this.productDetails.productVariables[0].colorDetail.colorLinkId;
    this.shoppingCart.productDetail[0].colorName = this.productDetails.productVariables[0].colorDetail.description;
    this.shoppingCart.productDetail[0].sizeLinkId = this.productDetails.productVariables[0].sizeDetail.sizeLinkId;
    this.shoppingCart.productDetail[0].sizeCode = this.productDetails.productVariables[0].sizeDetail.description;
    this.shoppingCart.productDetail[0].title = this.productDetails.title;
    this.shoppingCart.productDetail[0].description = this.productDetails.description;
    this.shoppingCart.productDetail[0].userProductId = this.productDetails.userProductId;
    this.shoppingCart.productDetail[0].supplierMobileNo = this.productDetails.supplierMobileno.toString();
    this.shoppingCart.productDetail[0].price = this.productDetails.productVariables[0].price;
    this.shoppingCart.productDetail[0].count = this.count;
    this.shoppingCart.productDetail[0].image = this.productDetails.productVariables[0].imageUrls[0];
  }

  addOrder(orderId: string, razorpay_payment_id: string)
  {
    this.shoppingCart.shoppingAddressIndex = this.shoppingAddressIndex;
    this.shoppingCart.orderId = orderId;
    this.shoppingCart.paymentId = razorpay_payment_id;

    this.orderservice.addOrder(this.shoppingCart).subscribe(
      (response: any) => {
        console.log('Order added');
        if (response.id === 'Out of Stock')
          alert('Some order may be Out of Stock !! Payments adjusted accordingly !!');

        this.router.navigate(['/orderconfirmation/'], {queryParams: {orderId: orderId}});
        ///swal.fire('Congratulations', 'Your Order has been placed with Order Id : ' + orderId);
        swal.fire({
          title: 'Congratulations',
          text: 'Your Order has been placed with Order Id : ' + orderId,
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

  onProceedPayment()
  {
    this.orderservice.checkAvailabilityAndTotalPayment(this.shoppingCart).subscribe(
      (response: any) => {
        this.summaryTotal = this.shoppingCart.productDetail[0].price * this.shoppingCart.productDetail[0].count;
        if (this.summaryTotal.toString() !== response.summaryTotal)
        {
          alert('Quantities in Stock may be less !! Payments will be adjusted accordingly !!');
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
  
  proceedRazorPay()
  {
    ///alert('We are using Razorpay payment gateway. Make sure your device has internet access to the Razorpay website! www.razorpay.com !');
    
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

    let mobileNo = sessionStorage.getItem('mobileno')?.toString() ?? '9999999999';

    let order = 'order_VCiSxbq4B5rlKl'.replace('order_', '');
    let paymentid = 'pay_GHbazrRXWaK5q5'.replace('pay_', '');
    ///this.addOrder('RZ-'+order, 'RZ-'+paymentid);    

    this.orderservice.getOrderNo(mobileNo, this.summaryTotal).subscribe(
      (response: any) => {        
        this.payNowRazorPay(response.orderId, response.razorPayKey, this);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  payNowRazorPay(orderId: string, razorPayKey: string, productDetailComponent: ECommerceProductDetailComponent)
  {
    let eCommerceData = ECommerceDetails.geteCommerceDetails();
    let title = eCommerceData[0].title; 

    let mobileNo = sessionStorage.getItem('mobileno')?.toString() ?? '9999999999';
    let firstName = sessionStorage.getItem('user')?.toString() ?? '';
    let lastName = sessionStorage.getItem('lastname')?.toString() ?? '';
    let fullName = firstName + ' ' + lastName
    let email = sessionStorage.getItem('email')?.toString() ?? '';

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
        sendSMS('RZ-'+order, mobileNo, productDetailComponent);
        sendEMail('RZ-'+order, productDetailComponent);
        productDetailComponent.addOrder('RZ-'+order, 'RZ-'+paymentid);
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
      
      document.getElementById('about')?.classList.remove('eCommerce-sidebar-home-collapse');
      document.getElementById('about')?.classList.add('eCommerce-sidebar-home-expand');      

      document.getElementById('navbar')?.classList.remove('eCommerce-sidebar-home-collapse');
      document.getElementById('navbar')?.classList.add('eCommerce-sidebar-home-expand');      

      document.getElementById('breadcrumb')?.classList.remove('eCommerce-sidebar-home-collapse');
      document.getElementById('breadcrumb')?.classList.add('eCommerce-sidebar-home-expand');
      
      document.getElementById('review')?.classList.remove('eCommerce-sidebar-home-collapse');
      document.getElementById('review')?.classList.add('eCommerce-sidebar-home-expand');
      
      document.getElementById('goeswell')?.classList.remove('eCommerce-sidebar-home-collapse');
      document.getElementById('goeswell')?.classList.add('eCommerce-sidebar-home-expand');
      
      document.getElementById('goeswellProduct')?.classList.remove('eCommerce-sidebar-home-collapse');
      document.getElementById('goeswellProduct')?.classList.add('eCommerce-sidebar-home-expand');       
    }
    else{    
      document.getElementById('productshome')?.classList.remove('eCommerce-sidebar-home-expand');
      document.getElementById('productshome')?.classList.add('eCommerce-sidebar-home-collapse');

      document.getElementById('productstitle')?.classList.remove('eCommerce-sidebar-home-expand');
      document.getElementById('productstitle')?.classList.add('eCommerce-sidebar-home-collapse');
      
      document.getElementById('about')?.classList.remove('eCommerce-sidebar-home-expand');
      document.getElementById('about')?.classList.add('eCommerce-sidebar-home-collapse'); 
      
      document.getElementById('navbar')?.classList.remove('eCommerce-sidebar-home-expand');
      document.getElementById('navbar')?.classList.add('eCommerce-sidebar-home-collapse');
      
      document.getElementById('breadcrumb')?.classList.remove('eCommerce-sidebar-home-expand');
      document.getElementById('breadcrumb')?.classList.add('eCommerce-sidebar-home-collapse');
      
      document.getElementById('review')?.classList.remove('eCommerce-sidebar-home-expand');
      document.getElementById('review')?.classList.add('eCommerce-sidebar-home-collapse');
      
      document.getElementById('goeswell')?.classList.remove('eCommerce-sidebar-home-expand');
      document.getElementById('goeswell')?.classList.add('eCommerce-sidebar-home-collapse');
      
      document.getElementById('goeswellProduct')?.classList.remove('eCommerce-sidebar-home-expand');
      document.getElementById('goeswellProduct')?.classList.add('eCommerce-sidebar-home-collapse');       
    }  
  }

}

function sendSMS(orderId: string, mobileNo: string, productDetailComponent: ECommerceProductDetailComponent)
{
  productDetailComponent.orderservice.getSMSService().subscribe(
    (response: any) => {
      if (response.id == 'FAST2SMS')
      {
        sendFAST2SMS('Thankyou%20for%20choosing%20Bagwani%20products.%20Your%20Order%20no%20is:%20'+orderId, mobileNo, response.fast2smsKey);
        ///sendFAST2SMSToSupplier('You%20have%20new%20order:%20'+orderId, productDetailComponent, response.fast2smsKey);
        
        ///sendFAST2SMS('Thankyou%20for%20choosing%20Bagwani%20products', '9822637436,7030790344,7720853072');  
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

function sendFAST2SMSToSupplier(msg: string, productDetailComponent: ECommerceProductDetailComponent, fast2smsKey: string)
{
  let mobileNos = productDetailComponent.getSupplierMobileNos();
  sendFAST2SMS(msg, mobileNos, fast2smsKey);
}

function sendEMail(orderId: string, productDetailComponent: ECommerceProductDetailComponent) 
{
  productDetailComponent.orderservice.getEMailService().subscribe(
    (response: any) => {
      if (response.id == 'EMailJS')
        sendEMailJS(orderId, response.eMailJSKeyId, response.eMailJSServiceId, response.eMailJSTemplateId, productDetailComponent);
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
                      productDetailComponent: ECommerceProductDetailComponent) 
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

