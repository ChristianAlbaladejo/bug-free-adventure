import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../../../app/services/products.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.page.html',
  styleUrls: ['./favorites.page.scss'],
  providers: [ProductsService]
})
export class FavoritesPage implements OnInit {

  public cart = []
  public user;
  public product = [];
  constructor(public _productsService: ProductsService, public navCtrl: NavController) { }

  ngOnInit() {
    this.user = localStorage.getItem("identity")
    this.user = JSON.parse(this.user);
    let array = localStorage.getItem('cart');
    array = JSON.parse(array);
    for (let i = 0; i < array.length; i++) {
      this.cart.push(array[i]);
    }
    this._productsService.getFav(this.user[0].id).subscribe(
      (response) => {
        this.product = response;
        this.product.forEach(element => {
          element['name'] = decodeURIComponent(element['name']);
        });
        console.log(this.product)
      }
    ), error => {
      console.log(error);
    }
  }

  gotoLogin() {
    this.navCtrl.navigateForward('/login')
  }

  gotoCart() {
    this.navCtrl.navigateForward('/cart')
  }

  loadProduct(p)  {
    console.log(p);
    
  }

  ifLogin() {
    let identity = JSON.parse(localStorage.getItem('identity'));
    if (identity == null) {
      return true;
    } else {
      return false;
    }
  }
}
