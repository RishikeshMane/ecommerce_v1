import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'ecommerce-product-header',
  templateUrl: '../product-header/product-header.component.html',
  styleUrls: ['../../../app.component.css']
})

export class ProductHeaderComponent implements OnInit 
{
  constructor(private router: Router) { }

  ngOnInit(): void 
  {
  }

  selectedSize(size: string): void
  {

  }

  selectedColor(color: string): void
  {
    
  }  

  deleteProduct(): void
  {

  }
}
