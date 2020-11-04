import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SimpleProductPage } from './simple-product.page';

const routes: Routes = [
  {
    path: '',
    component: SimpleProductPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SimpleProductPageRoutingModule {}
