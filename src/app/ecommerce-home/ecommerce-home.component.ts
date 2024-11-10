import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { SideBarService } from '../shared/services/side-bar.service';
import { HomeService } from '../shared/services/home-service.service';
import { ECommerceDetails } from '../shared/data/eCommerce-details.data';
import { ProductService } from '../shared/services/product-service.service';

import { SizeDetail } from '../shared/model/size-detail.model';
import { ColorDetail } from '../shared/model/color-detail.model';
import { LoginStatusService } from '../shared/services/login-status.service';
import { CurrentLoginService } from '../shared/services/current-login.service';

@Component({
  selector: 'app-ecommerce-home',
  templateUrl: './ecommerce-home.component.html',
  styleUrls: ['../app-bagwani.component.css']
})

export class ECommerceHomeComponent implements OnInit 
{
  title: string = ' eCommerce';
  eCommerceData: any;

  images1:string = "assets/images/home1.png";
  images2:string = "assets/images/home2.png";
  images3:string = "assets/images/home3.png";
  art:string = "assets/images/art.png";

  imageHome: string = "assets/eCommerce-Images";

  imageUrls: string[] = [];
  imageLongUrls: string[] = [];
  imageDealUrls: string[] = [];
  imageHappyUrls: string[] = [];

  sizes: SizeDetail[]=[];
  colors: ColorDetail[]=[];
  selectedSize: number = 0;
  selectedColor: number = 0;

  sizeStyleSelect: string = 'eCommerce-nav-button-reverse';
  sizeStyleUnSelect: string = 'eCommerce-nav-button';
  sizeStyle: string[] = [];
  public colorStyle = [
    { red: 51, green: 155, blue: 124 }
  ];

  colorBorderSelected: string = 'eCommerce-nav-button-border-selected';
  colorBorderUnSelected: string = 'eCommerce-nav-button-border-unselected';
  colorBorderStyle: string[] = [];

  dealCount: number = 0;

  isSideBarExpand: boolean = true;

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private sidebarservice: SideBarService,
              private homeservice: HomeService,
              private productservice: ProductService,
              private loginStatusservice: LoginStatusService,
              private currentLoginservice: CurrentLoginService) { }

  ngOnInit(): void 
  {
    this.getSideBar();

    this.sidebarservice.getExpand().subscribe(
      (isExpand)=>{
        this.isSideBarExpand = isExpand;
        this.updateLayout();
      });

    this.loginStatusservice.setLogin(false);
    ///this.currentLoginservice.setCurrentLogin(false);

    this.updateLayout();

    this.eCommerceData = ECommerceDetails.geteCommerceDetails();
    this.title = this.eCommerceData[0].title;

    this.initializeImageLinks();
    this.initializeLongImageLinks();
    this.initializeDealImageLinks();
    this.initializeSizeColor();
    this.initializeHappyImageLinks();
  }

  getSideBar()
  {
    this.isSideBarExpand = this.sidebarservice.getExpanding();
  }

  initializeImageLinks()
  {
    this.homeservice.getImageLinks()
    .subscribe(
      (response) => {
        console.error('K8s Called');
        this.imageUrls = response;
      },
      (error) => {
        console.error('K8s Not Called');
        console.error(error);
      }
      )
  }

  initializeLongImageLinks()
  {
    this.homeservice.getLongImageLinks()
    .subscribe(
      (response) => {
        this.imageLongUrls = response;
      },
      (error) => {
        console.error(error);
      }
      )
  }
  
  initializeDealImageLinks()
  {
    this.homeservice.getDealImageLinks()
    .subscribe(
      (response) => {
        this.imageDealUrls = response;
      },
      (error) => {
        console.error(error);
      }
      )
  }

  initializeHappyImageLinks()
  {
    this.homeservice.getHappyImageLinks()
    .subscribe(
      (response) => {
        this.imageHappyUrls = response;
      },
      (error) => {
        console.error(error);
      }
      )
  }  

  initializeSizeColor()
  {
    this.productservice.getSizes()
    .subscribe(
      (response) => {
        this.sizes = response;
        this.updateSizeStyle(0);
      },
      (error) => {
        console.error(error);
      }
      )

    this.productservice.getColors()
    .subscribe(
      (response) => {
        this.colors = response;
        this.updateColorStyle(0);
        this.updateColorBorderStyle(0);
      },
      (error) => {
        console.error(error);
      }
      )
  }

  getImageName(row: number, column: number): string
  {
    let productNumber = row;
    let imageNumber = column;

    let imageUrl = this.imageUrls[productNumber];
    let imageUrls:string[] = this.imageUrls[productNumber].split(':');
    let imageNames: string[] = imageUrls[1].split(';');
    let imageName: string = imageNames[imageNumber];

    imageName = this.imageHome + '/' + 'Home' + '/' + (row+1).toString() + '/' + imageUrls[0] + '/' + imageName;

    return imageName;
  }

  getTooltipImageName(row: number, column: number): string
  {
    let tooltip: string = this.getImageName(row, column);
    return tooltip.substring(tooltip.lastIndexOf('/')+1, tooltip.lastIndexOf('.'));
  }

  getLongImageName(row: number, column: number): string
  {
    let productNumber = row;
    let imageNumber = column;

    let imageUrl = this.imageLongUrls[productNumber];
    let imageUrls:string[] = this.imageLongUrls[productNumber].split(':');
    let imageNames: string[] = imageUrls[1].split(';');
    let imageName: string = imageNames[imageNumber];

    imageName = this.imageHome + '/' + 'Home' + '/' + 'Long' + '/' + (row+1).toString() + '/' + imageUrls[0] + '/' + imageName;

    return imageName;
  }

  getLongTooltipImageName(row: number, column: number): string
  {
    let tooltip: string = this.getLongImageName(row, column);
    return tooltip.substring(tooltip.lastIndexOf('/')+1, tooltip.lastIndexOf('.'));
  }

  getDealImageName(): string
  {
    return this.imageHome + '/' + 'Home' + '/' + 'Deal' + '/' + 
      this.imageDealUrls[0].substring(0, this.imageDealUrls[0].lastIndexOf(':')) + '/' + this.imageDealUrls[0].substring(this.imageDealUrls[0].lastIndexOf(':')+1);
  }

  getHappyImageName(): string
  {
    return this.imageHome + '/' + 'Home' + '/' + 'Happy' + '/' + this.imageHappyUrls[0];
  }  

  getDealTooltipImageName(): string
  {
    return this.imageDealUrls[0].substring(0, this.imageDealUrls[0].indexOf('.'));
  }

  getDealDescription() : string | undefined
  {
    return ECommerceDetails.getDetails('DealDescription');
  }

  getOldPrice() : string | undefined
  {
    return ECommerceDetails.getDetails('Oldprice');
  }

  getNewPrice() : string | undefined
  {
    return ECommerceDetails.getDetails('Newprice');
  }

  getProductName(row: number, column: number) : string
  {
    let productNumber = (row-1 + column-1);
    let imageUrl = this.imageUrls[productNumber];

    return imageUrl.slice(0, imageUrl.indexOf(':'));
  }

  getCategoryDetails(row: number, column: number): string | undefined
  {
    return ECommerceDetails.getDetails(this.getProductName(row, column));
  }

  getTopSellingDetail(): string | undefined
  {
    return ECommerceDetails.getDetails('TopSelling');
  }

  getComment1(): string | undefined
  {
    return ECommerceDetails.getDetails('Comment1');
  }

  getName1(): string | undefined
  {
    return ECommerceDetails.getDetails('Name1');
  }

  getComment2(): string | undefined
  {
    return ECommerceDetails.getDetails('Comment2');
  }

  getName2(): string | undefined
  {
    return ECommerceDetails.getDetails('Name2');
  }
  
  getComment3(): string | undefined
  {
    return ECommerceDetails.getDetails('Comment3');
  }

  getName3(): string | undefined
  {
    return ECommerceDetails.getDetails('Name3');
  }  

  onSizeClick(index: number)
  {
    this.selectedSize = index;
    this.updateSizeStyle(index);
  }

  onColorClick(index: number)
  {
    this.selectedColor = index;
    this.updateColorBorderStyle(index);
  }

  updateSizeStyle(selected: number)
  {
    this.sizeStyle = [];
    this.selectedSize = selected;
    let index = 0;
    this.sizes.forEach(size=>{
      if (index === selected)
        this.sizeStyle.push(this.sizeStyleSelect);
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
        this.colorBorderStyle.push(this.colorBorderSelected);
      else
        this.colorBorderStyle.push(this.colorBorderUnSelected);

      ++index;
    })
  }
  
  onDealDecrement()
  {
    --this.dealCount;

    if (this.dealCount <= 0)
      this.dealCount = 0;
  }

  onDealIncrement()
  {
    ++this.dealCount;
  }  

  onImageClick(row: number, column: number)
  {
    let productNumber = row;
    let imageNumber = column;

    let imageUrl = this.imageUrls[row];
    let imageUrls:string[] = this.imageUrls[row].split(':');
    let imageNames: string[] = imageUrls[1].split(';');
    let imageName: string = imageNames[column];

    this.router.navigate(['/products/'], {queryParams: {category: imageUrls[0], subCategory: imageName.split('.')[0]}}); 
  }

  updateLayout()
  {
    if (this.isSideBarExpand === true){
      document.getElementById('homeImage')?.classList.remove('eCommerce-sidebar-home-collapse');
      document.getElementById('homeImage')?.classList.add('eCommerce-sidebar-home-expand');

      document.getElementById('art')?.classList.remove('eCommerce-sidebar-home-collapse');
      document.getElementById('art')?.classList.add('eCommerce-sidebar-home-expand');

      document.getElementById('best')?.classList.remove('eCommerce-sidebar-home-collapse');
      document.getElementById('best')?.classList.add('eCommerce-sidebar-home-expand');
      
      document.getElementById('deal')?.classList.remove('eCommerce-sidebar-home-collapse');
      document.getElementById('deal')?.classList.add('eCommerce-sidebar-home-expand');
      
      document.getElementById('dealdescription')?.classList.remove('eCommerce-sidebar-home-collapse');
      document.getElementById('dealdescription')?.classList.add('eCommerce-sidebar-home-expand');
      
      document.getElementById('category')?.classList.remove('eCommerce-sidebar-home-collapse');
      document.getElementById('category')?.classList.add('eCommerce-sidebar-home-expand');        
      
      document.getElementById('cardOne')?.classList.remove('eCommerce-sidebar-home-collapse');
      document.getElementById('cardOne')?.classList.add('eCommerce-sidebar-home-expand');
      
      document.getElementById('cardTwo')?.classList.remove('eCommerce-sidebar-home-collapse');
      document.getElementById('cardTwo')?.classList.add('eCommerce-sidebar-home-expand');
      
      document.getElementById('cardThree')?.classList.remove('eCommerce-sidebar-home-collapse');
      document.getElementById('cardThree')?.classList.add('eCommerce-sidebar-home-expand');

      document.getElementById('cardFour')?.classList.remove('eCommerce-sidebar-home-collapse');
      document.getElementById('cardFour')?.classList.add('eCommerce-sidebar-home-expand');      
      
      document.getElementById('roundimages')?.classList.remove('eCommerce-sidebar-home-collapse');
      document.getElementById('roundimages')?.classList.add('eCommerce-sidebar-home-expand');
      
      document.getElementById('shopnow')?.classList.remove('eCommerce-sidebar-home-collapse');
      document.getElementById('shopnow')?.classList.add('eCommerce-sidebar-home-expand'); 
      
      document.getElementById('about')?.classList.remove('eCommerce-sidebar-home-collapse');
      document.getElementById('about')?.classList.add('eCommerce-sidebar-home-expand');
      
      document.getElementById('navbar')?.classList.remove('eCommerce-sidebar-home-collapse');
      document.getElementById('navbar')?.classList.add('eCommerce-sidebar-home-expand');

      document.getElementById('navbar2')?.classList.remove('eCommerce-sidebar-home-collapse');
      document.getElementById('navbar2')?.classList.add('eCommerce-sidebar-home-expand');
      
      document.getElementById('bottom')?.classList.remove('eCommerce-sidebar-home-collapse');
      document.getElementById('bottom')?.classList.add('eCommerce-sidebar-home-expand');
      
      document.getElementById('happy')?.classList.remove('eCommerce-sidebar-home-collapse');
      document.getElementById('happy')?.classList.add('eCommerce-sidebar-home-expand');
      
      document.getElementById('happyplants')?.classList.remove('eCommerce-sidebar-home-collapse');
      document.getElementById('happyplants')?.classList.add('eCommerce-sidebar-home-expand');
      
      document.getElementById('homevideo')?.classList.remove('eCommerce-sidebar-home-collapse');
      document.getElementById('homevideo')?.classList.add('eCommerce-sidebar-home-expand');        
    }
    else{      
      document.getElementById('homeImage')?.classList.remove('eCommerce-sidebar-home-expand');
      document.getElementById('homeImage')?.classList.add('eCommerce-sidebar-home-collapse');

      document.getElementById('art')?.classList.remove('eCommerce-sidebar-home-expand');
      document.getElementById('art')?.classList.add('eCommerce-sidebar-home-collapse');

      document.getElementById('best')?.classList.remove('eCommerce-sidebar-home-expand');
      document.getElementById('best')?.classList.add('eCommerce-sidebar-home-collapse');
      
      document.getElementById('deal')?.classList.remove('eCommerce-sidebar-home-expand');
      document.getElementById('deal')?.classList.add('eCommerce-sidebar-home-collapse');
      
      document.getElementById('dealdescription')?.classList.remove('eCommerce-sidebar-home-expand');
      document.getElementById('dealdescription')?.classList.add('eCommerce-sidebar-home-collapse');
      
      document.getElementById('category')?.classList.remove('eCommerce-sidebar-home-expand');
      document.getElementById('category')?.classList.add('eCommerce-sidebar-home-collapse');       
      
      document.getElementById('cardOne')?.classList.remove('eCommerce-sidebar-home-expand');
      document.getElementById('cardOne')?.classList.add('eCommerce-sidebar-home-collapse');
      
      document.getElementById('cardTwo')?.classList.remove('eCommerce-sidebar-home-expand');
      document.getElementById('cardTwo')?.classList.add('eCommerce-sidebar-home-collapse');
      
      document.getElementById('cardThree')?.classList.remove('eCommerce-sidebar-home-expand');
      document.getElementById('cardThree')?.classList.add('eCommerce-sidebar-home-collapse');

      document.getElementById('cardFour')?.classList.remove('eCommerce-sidebar-home-expand');
      document.getElementById('cardFour')?.classList.add('eCommerce-sidebar-home-collapse');      

      document.getElementById('roundimages')?.classList.remove('eCommerce-sidebar-home-expand');
      document.getElementById('roundimages')?.classList.add('eCommerce-sidebar-home-collapse');
      
      document.getElementById('shopnow')?.classList.remove('eCommerce-sidebar-home-expand');
      document.getElementById('shopnow')?.classList.add('eCommerce-sidebar-home-collapse');
      
      document.getElementById('about')?.classList.remove('eCommerce-sidebar-home-expand');
      document.getElementById('about')?.classList.add('eCommerce-sidebar-home-collapse');
      
      document.getElementById('navbar')?.classList.remove('eCommerce-sidebar-home-expand');
      document.getElementById('navbar')?.classList.add('eCommerce-sidebar-home-collapse');

      document.getElementById('navbar2')?.classList.remove('eCommerce-sidebar-home-expand');
      document.getElementById('navbar2')?.classList.add('eCommerce-sidebar-home-collapse');
      
      document.getElementById('bottom')?.classList.remove('eCommerce-sidebar-home-expand');
      document.getElementById('bottom')?.classList.add('eCommerce-sidebar-home-collapse');
      
      document.getElementById('happy')?.classList.remove('eCommerce-sidebar-home-expand');
      document.getElementById('happy')?.classList.add('eCommerce-sidebar-home-collapse');
      
      document.getElementById('happyplants')?.classList.remove('eCommerce-sidebar-home-expand');
      document.getElementById('happyplants')?.classList.add('eCommerce-sidebar-home-collapse');
      
      document.getElementById('homevideo')?.classList.remove('eCommerce-sidebar-home-expand');
      document.getElementById('homevideo')?.classList.add('eCommerce-sidebar-home-collapse');         
    }    
  }

  toggleHomeVideo()
  {

  }

}
