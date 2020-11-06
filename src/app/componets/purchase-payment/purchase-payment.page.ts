import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-purchase-payment',
  templateUrl: './purchase-payment.page.html',
  styleUrls: ['./purchase-payment.page.scss'],
})
export class PurchasePaymentPage implements OnInit {
  myDate: String = new Date().toISOString();

  constructor() { }

  ngOnInit() {
  }

}
