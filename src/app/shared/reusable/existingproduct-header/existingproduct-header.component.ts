import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'ecommerce-existingproduct-header',
  templateUrl: '../existingproduct-header/existingproduct-header.component.html',
  styleUrls: ['../../../app.component.css']
})

export class ExistingProductHeaderComponent implements OnInit 
{
  constructor(private router: Router) { }

  ngOnInit(): void 
  {
  }
}
