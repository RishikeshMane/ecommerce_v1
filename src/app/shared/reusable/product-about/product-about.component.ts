import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'ecommerce-product-about',
  templateUrl: '../product-about/product-about.component.html',
  styleUrls: ['../../../app-bagwani.component.css']
})

export class ProductAboutComponent implements OnInit 
{
  constructor(private router: Router) { }

  ngOnInit(): void 
  {
  }
}
