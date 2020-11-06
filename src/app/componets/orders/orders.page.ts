import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../../../app/services/products.service';
import { NavController, LoadingController, AlertController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.page.html',
  styleUrls: ['./orders.page.scss'],
  providers: [ProductsService],
})
export class OrdersPage implements OnInit {
  public orders = [];
  public user;
  public cart = [];
  constructor(private _productsService: ProductsService, public navCtrl: NavController) {
    this.user = localStorage.getItem("identity")
    this.user = JSON.parse(this.user);
   }

  ngOnInit() {
    this.load()
  }

  load() {
    this._productsService.getSalesOrders(this.user[0].id).subscribe(data => {
      data.forEach(element => {
        this.orders.push(element)
      });
      for (let i = 0; i < this.orders.length; i++) {
        this.orders[i].orderLines = this.orders[i].orderLines.replace(/'/g, '"');
        this.orders[i].orderLines = JSON.parse(this.orders[i].orderLines);
      }
      this.orders = this.orders.reverse();
      console.log(this.orders)
    }, error => {
      console.log(error);
    })
  }

  addToCart(p) {
    console.log(p.length)
    let flag = false;
    let array: any[] = []
    let local = localStorage.getItem('cart');
    array = JSON.parse(local);
    for (let i = 0; i < array.length; i++) {
      for (let x = 0; x < p.length; x++) {
        if (array[i]["id"] == p[x].id) {
          array[i]["quantity"] += p[x].quantity;
          flag = true
        } else {
          const found = array.some(el => el.id === p[x].id);
          if (!found) array.push(p[x]);
        }
      }
    }

    if (flag) {
      localStorage.setItem('cart', JSON.stringify(array));
    } else {
      for (let i = 0; i < p.length; i++) {
        this.cart.push(p[i]);
      }
      localStorage.setItem('cart', JSON.stringify(this.cart));
    }
  }

  ifLogin() {
    let identity = JSON.parse(localStorage.getItem('identity'));
    if (identity == null) {
      return true;
    } else {
      return false;
    }
  }

  gotoCart() {
    if (this.ifLogin()) {
      this.navCtrl.navigateForward('/login');
    } else {
      this.navCtrl.navigateForward('/cart');
    }
  }

  gotoLogin() {
    this.navCtrl.navigateForward('/cart');
  }

}
