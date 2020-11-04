import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SimpleProductPageRoutingModule } from './simple-product-routing.module';

import { SimpleProductPage } from './simple-product.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SimpleProductPageRoutingModule
  ],
  declarations: [SimpleProductPage]
})
export class SimpleProductPageModule {}
