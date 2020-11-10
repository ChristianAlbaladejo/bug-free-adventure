import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../../../app/services/products.service';
import { ModalController, NavController,  } from '@ionic/angular';
import { ProductPage } from '../product/product.page'
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

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
  public productLike;
  constructor(public _productsService: ProductsService, public navCtrl: NavController, public modalController: ModalController, private http: HttpClient) { }

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
        this.productLike = response;
        this.productLike.forEach(element => {
          element['name'] = decodeURIComponent(element['name']);
        });
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

  async loadProduct(p)  {
    const modal = await this.modalController.create({
      component: ProductPage,
      swipeToClose: true,
      componentProps: { product: p }
    });
    modal.onDidDismiss().then((data) => {
      this.ngOnInit();
    });
    return await modal.present();
  }

  ifLogin() {
    let identity = JSON.parse(localStorage.getItem('identity'));
    if (identity == null) {
      return true;
    } else {
      return false;
    }
  }

  checkFav(p) {
    for (let x = 0; x < this.productLike.length; x++) {
      if (p.id == this.productLike[x].productId) {
        return true;
      }
    }
    return false
  }

  addFav(p) {
    this.productLike.push({ "productId": p.id, "userId": this.user[0].id })
    var body = {
      "productId": p.id,
      "userId": this.user[0].id
    };
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem("token")
    });
    this.http
      .post(environment.APIURL + '/addFavorite/',
        body, { headers: headers })
      .subscribe(data => {
      }, error => {
        console.log(error);
      }
      );
  }

  deleteFav(p) {
    for (let i = 0; i < this.productLike.length; i++) {
      if (p.id == this.productLike[i].productId) {
        this.productLike.splice(i, 1)
      }
    }
    this._productsService.deleteFav(p.id, this.user[0].id).subscribe((response) => {
    }, error => {
      console.log(error);
    });
  }
}
