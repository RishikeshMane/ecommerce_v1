import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-ecommerce-home',
  templateUrl: './ecommerce-login.component.html',
  styleUrls: ['../app.component.css']
})

export class ECommerceLoginComponent implements OnInit 
{
  constructor(private router: Router) { }

  ngOnInit(): void 
  {
  }
}
