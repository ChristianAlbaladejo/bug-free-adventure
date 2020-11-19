import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'folder/:id',
    loadChildren: () => import('./folder/folder.module').then( m => m.FolderPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./auth/register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./auth/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./componets/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'favorites',
    loadChildren: () => import('./componets/favorites/favorites.module').then( m => m.FavoritesPageModule)
  },
  {
    path: 'tables',
    loadChildren: () => import('./componets/tables/tables.module').then( m => m.TablesPageModule)
  },
  {
    path: ':family/:id',
    loadChildren: () => import('./componets/products/products.module').then( m => m.ProductsPageModule)
  },
  {
    path: 'simple-product',
    loadChildren: () => import('./componets/simple-product/simple-product.module').then( m => m.SimpleProductPageModule)
  },
  {
    path: 'cart',
    loadChildren: () => import('./componets/cart/cart.module').then( m => m.CartPageModule)
  },
  {
    path: 'purchase',
    loadChildren: () => import('./componets/purchase/purchase.module').then( m => m.PurchasePageModule)
  },
  {
    path: 'purchase-payment',
    loadChildren: () => import('./componets/purchase-payment/purchase-payment.module').then( m => m.PurchasePaymentPageModule)
  },
  {
    path: 'orders',
    loadChildren: () => import('./componets/orders/orders.module').then( m => m.OrdersPageModule)
  },
  {
    path: 'product/:id',
    loadChildren: () => import('./componets/product/product.module').then( m => m.ProductPageModule)
  },
  {
    path: 'success',
    loadChildren: () => import('./payment/success/success.module').then( m => m.SuccessPageModule)
  },
  {
    path: 'failure',
    loadChildren: () => import('./payment/failure/failure.module').then( m => m.FailurePageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
