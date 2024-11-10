import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'ecommerce-product-navigation',
  templateUrl: '../product-navigation/product-navigation.component.html',
  styleUrls: ['../../../app-bagwani.component.css']
})

export class ProductNavigationComponent implements OnInit 
{
  constructor(private router: Router) { }

  ngOnInit(): void 
  {
  }

  onTermsAndCondition()
  {
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
      this.router.navigate(['/termsandcondition/'])}); 
  }

  onPrivacyPolicy()
  {
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
      this.router.navigate(['/privacypolicy/'])});     
  }

  onYoutube()
  {
    window.open("https://www.youtube.com/watch?v=X48VuDVv0do&t=6388s");
  }
}
