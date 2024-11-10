import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { ProductVariable } from '../../model/product-variable.model';
import { ProductService } from '../../services/product-service.service';
import { SizeDetail } from '../../model/size-detail.model';
import { ColorDetail } from '../../model/color-detail.model';
import { ImageStatusDetail } from '../../model/imagestatus-detail.model';

@Component({
  selector: 'ecommerce-existingproduct-variable',
  templateUrl: '../existingproduct-variable/existingproduct-variable.component.html',
  styleUrls: ['../../../app-bagwani.component.css']
})

export class ExistingProductVariableComponent implements OnInit, OnChanges
{
  productVariable: ProductVariable=new ProductVariable(1);
  allSizes: SizeDetail[]=[];
  allColors: ColorDetail[]=[];  
  sizes: SizeDetail[]=[];
  colors: ColorDetail[]=[];

  size:string='';
  color:string='';
  sizeTitle:string='';
  colorTitle:string='';  

  imageClick: string = 'eCommerce-small-button-three-click';
  imageUnClick: string = 'eCommerce-small-button-three';
  imageClickStatus: string = this.imageUnClick;

  imageStatusDetail: ImageStatusDetail = new ImageStatusDetail();

  public varColor = [
    { red: 240, green: 240, blue: 240 }
  ];

  @Input('key') variableI: ProductVariable = new ProductVariable(1);
  @Input('imagecheck') imageStatusDetailI: ImageStatusDetail = new ImageStatusDetail;

  @Output('productvariable') variableO = new EventEmitter<ProductVariable>();
  @Output('deleteRow') rowIndex = new EventEmitter<number>();
  @Output('showImages') showImage = new EventEmitter<ImageStatusDetail>();

  constructor(private router: Router,
              private productservice: ProductService) { }

  ngOnInit(): void 
  {
    this.productVariable = this.variableI;
    this.initialize();

    this.updateImageStatus();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.updateImageCheckBox(changes);
    this.updateImageStatus();
  }

  updateImageCheckBox(changes: SimpleChanges)
  {
    if (changes && changes['imageStatusDetailI']?.currentValue) {
      this.productVariable.imageShow = false;
      if (this.productVariable.index === changes['imageStatusDetailI']?.currentValue.index){
        this.productVariable.imageShow = changes['imageStatusDetailI']?.currentValue.showhide;
      }
    }
  }

  initialize(): void
  {
    this.productservice.getSizes()
      .subscribe(
        (response) => {
          this.updateSizes(response);
        },
        (error) => {
          console.error(error);
        }
        )
    
    this.productservice.getColors()
    .subscribe(
      (response) => {
        this.updateColors(response);
      },
      (error) => {
        console.error(error);
      }
      )
  }

  updateSizes(sizes: SizeDetail[])
  {
    this.allSizes = [];
    this.sizes = [];
    sizes.forEach(size => {
      this.allSizes.push(size);
      this.sizes.push(size);
    });

    this.productVariable.sizeDetail = sizes[this.productVariable.sizeDetail.sizeLinkId];
    this.size = this.productVariable.sizeDetail.sizeCode;
    this.sizeTitle = this.productVariable.sizeDetail.description;
  }

  updateColors(colors: ColorDetail[])
  {
    this.allColors = [];
    this.colors = [];
    colors.forEach(color => {
      this.allColors.push(color);
      this.colors.push(color);
    });

    this.productVariable.colorDetail = colors[this.productVariable.colorDetail.colorLinkId];
    this.color = this.productVariable.colorDetail.description;

    this.varColor[0].red = colors[this.productVariable.colorDetail.colorLinkId].red;
    this.varColor[0].green = colors[this.productVariable.colorDetail.colorLinkId].green;
    this.varColor[0].blue = colors[this.productVariable.colorDetail.colorLinkId].blue;      
  }

  onUploadImage(): void
  {
    this.productVariable.imageShow = !this.productVariable.imageShow;

    this.imageStatusDetail.index = this.productVariable.index;
    this.imageStatusDetail.showhide = this.productVariable.imageShow;

    this.updateImageStatus();

    this.showImage.emit(this.imageStatusDetail);
  }

  updateImageStatus()
  {
    if (this.productVariable.imageShow === true)
    {
      this.imageClickStatus = this.imageClick;
    }
    else if (this.productVariable.imageShow === false)
    {
      this.imageClickStatus = this.imageUnClick;
    }
  }
}
