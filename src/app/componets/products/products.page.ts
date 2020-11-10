import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../../../app/services/products.service';
import { ActivatedRoute } from '@angular/router';
import { NavController, LoadingController, AlertController, ToastController, ModalController } from '@ionic/angular';
import { ProductPage } from '../product/product.page'
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-products',
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.scss'],
  providers: [ProductsService],
})
export class ProductsPage implements OnInit {
  public product;
  public cart = [];
  public count: number = 0;
  public user;
  public productLike;
  public id;
  public name;
  search = '';

  constructor(private _productsService: ProductsService, private activatedRoute: ActivatedRoute, public navCtrl: NavController, public loadingController: LoadingController, public alertController: AlertController, public toastController: ToastController, public modalController: ModalController, private http: HttpClient) { }

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.name = this.activatedRoute.snapshot.paramMap.get('family');
    this.loadProducts();
  }

  async loadProducts() {
    const loading = await this.loadingController.create({
      message: 'Cargando...',
      translucent: true,
    });
    await loading.present();
    this.user = localStorage.getItem("identity")
    this.user = JSON.parse(this.user);
    this.cart = []
    let array = localStorage.getItem('cart');
    array = JSON.parse(array);
    for (let i = 0; i < array.length; i++) {
      this.cart.push(array[i]);
    }
    this._productsService.getProductsById(this.id).subscribe(
      (response) => {
        console.log(response);
        this.product = response;
        this.product.forEach(element => {
          element['name'] = decodeURIComponent(element['name']);
        });
        if (this.user) {
          this._productsService.getFav(this.user[0].id).subscribe(
            (response) => {
              this.productLike = response;
              this.productLike.forEach(element => {
                element['name'] = decodeURIComponent(element['name']);
              });
            }
          ), error => {
          }
        }
        this.loadingController.dismiss();
      },
      async (error) => {
        const alert = await this.alertController.create({
          header: 'Error!',
          message: 'Parece que tenemos problemas 🥴',
          buttons: [
            {
              text: 'Okay',
              handler: () => {
                this.ngOnInit();
              }
            }
          ]
        });
        await alert.present();
        this.loadingController.dismiss();
      }
    );
  }
  doRefresh(event) {
    this.loadProducts();
    event.target.complete();
  }


  incrementQty(index: number) {
    this.product[index].quantity += 1;
  }

  decrementQty(index: number) {
    if (this.product[index].quantity > 1) {
      this.product[index].quantity -= 1;
    }
  }

  filter(e) {
    if (this.search == "") {
      this.loadProducts()
    } else {
      this._productsService.filterByName(e.target.value, this.id).subscribe(
        (response) => {
          this.product = response;
          this.product.forEach(element => {
            element['name'] = decodeURIComponent(element['name']);
          });
        },
        (error) => {
        }
      );
    }
  }

  async loadProduct(p) {
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
