import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { PurchasePaymentPageRoutingModule } from './purchase-payment-routing.module';

import { PurchasePaymentPage } from './purchase-payment.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PurchasePaymentPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [PurchasePaymentPage]
})
export class PurchasePaymentPageModule {}
