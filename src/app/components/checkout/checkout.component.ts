import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  checkoutFormGroup:FormGroup;
  totalPrice:number=0.00;
  totalQuantity:number=0;

  constructor(private fromBuilder:FormBuilder) { }

  ngOnInit(): void {
    this.checkoutFormGroup=this.fromBuilder.group({
      customer:this.fromBuilder.group({
        firstName:[''],
        lastName:[''],
        email:['']
      }),
      shippingAddress:this.fromBuilder.group({
        street:[''],
        city:[''],
        state:[''],
        country:[''],
        zipcode:['']
      }),
      billingAddress:this.fromBuilder.group({
        street:[''],
        city:[''],
        state:[''],
        country:[''],
        zipcode:['']
      }),
      creditCard:this.fromBuilder.group({
        cardType:[''],
        nameOnCard:[''],
        cardNumber:[''],
        securityCode:[''],
        expirationMonth:[''],
        expirationYear:['']
      })
    });
  }

  onSubmit(){
    console.log("HAndling the submit button");
    console.log(this.checkoutFormGroup.get("customer")?.value);
  }

  copyShippingAddressToBillingAddress(event){
    if(event.target.checked){
      this.checkoutFormGroup.controls['billingAddress']
      .setValue(this.checkoutFormGroup.controls['shippingAddress'].value);
    }
    else{
      this.checkoutFormGroup.controls['billingAddress'].reset();
    }
  }
}
