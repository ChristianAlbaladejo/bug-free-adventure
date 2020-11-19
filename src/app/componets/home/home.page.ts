import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../../../app/services/products.service';
import { NavController, LoadingController, AlertController, ToastController, ModalController } from '@ionic/angular';
import { ProductPage } from '../product/product.page'
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  providers: [ProductsService],
})

export class HomePage implements OnInit {
  public user;
  public cart = [];
  public productLike = [];
  public familyes;
  public search = "";
  public currentNumber = 0;
  public product
  constructor(private _productsService: ProductsService, public navCtrl: NavController, public loadingController: LoadingController, public alertController: AlertController, public toastController: ToastController, public modalController: ModalController, private http: HttpClient) { }

  ngOnInit() {
    if (localStorage.getItem('cart')) {
    } else {
      localStorage.setItem('cart', JSON.stringify({}));
    } 
    this.user = localStorage.getItem("identity")
    this.user = JSON.parse(this.user);
    let array = localStorage.getItem('cart');
    array = JSON.parse(array);
    this.cart = []
    for (let i = 0; i < array.length; i++) {
      this.cart.push(array[i]);
    }
    this.load();
  }
  async load() {
    const loading = await this.loadingController.create({
      message: 'Cargando...',
      translucent: true,
    });
    await loading.present();
    this._productsService.getFamilies().subscribe(
      (response) => {
        console.log(response);
        this.familyes = response;
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
                this.load();
              }
            }
          ]
        });
        await alert.present();
        this.loadingController.dismiss();
      }
    );
  }

  ifLogin() {
    let identity = JSON.parse(localStorage.getItem('identity'));
    if (identity == null) {
      return true;
    } else {
      return false;
    }
  }

  gotoLogin() {
    this.navCtrl.navigateForward('/login');
  }

  goToFamili(name, famili) {
    this.navCtrl.navigateForward('/' + name + '/' + famili.toString());
  }

  doRefresh(event) {
    this.load();
    event.target.complete();
  }

  gotoCart() {
    if (this.ifLogin()) {
      this.navCtrl.navigateForward('/login');
    } else {
      this.navCtrl.navigateForward('/cart');
    }
  }

  filter(e) {
    if (this.search == "") {
      this.load()
    } else {
      this._productsService.filter(e.target.value).subscribe(
        (response) => {
          console.log(response)
          this.product = response;
          console.log(this.product)
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
        },
        (error) => {
        }
      );
    }
  }

  async addToCart(p) {
    console.log(p);
    let flag = false;
    let array = localStorage.getItem('cart');
    console.log(array);

    array = JSON.parse(array);
    for (let i = 0; i < array.length; i++) {
      if (array[i]["id"] == p.id) {
        array[i]["quantity"] += p.quantity;
        flag = true
      }
    }
    if (flag) {
      localStorage.setItem('cart', JSON.stringify(array));
      console.log('yes');

    } else {
      console.log('no');
      this.cart.push(p);
      localStorage.setItem('cart', JSON.stringify(this.cart));
    }
    const toast = await this.toastController.create({
      message: 'Producto añadido',
      duration: 2000,
      color: 'success'
    });
    toast.present();
    this.navCtrl.navigateForward('/home');
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
