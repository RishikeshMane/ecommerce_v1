import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-ecommerce-addinventory',
  templateUrl: './ecommerce-addinventory.component.html',
  styleUrls: ['../app.component.css']
})

export class ECommerceAddInventoryComponent implements OnInit 
{
  constructor(private router: Router) { }

  ngOnInit(): void 
  {
  }
}
