import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../../../app/services/products.service';
import { NavController, LoadingController, AlertController, ToastController  } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  providers: [ProductsService],
})

export class HomePage implements OnInit {
  public user;
  public cart = [];
  public familyes;
  public search = "";
  public currentNumber = 0;
  public product
  constructor(private _productsService: ProductsService, public navCtrl: NavController, public loadingController: LoadingController, public alertController: AlertController, public toastController: ToastController) { }

  ngOnInit() {
    this.user = localStorage.getItem("identity")
    this.user = JSON.parse(this.user);
    let array = localStorage.getItem('cart');
    array = JSON.parse(array);
    for (let i = 0; i < array.length; i++) {
      console.log(i);
      
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
        /* for (let i = 0; i < response.length; i++) {
          this.families.sort((a, b) => parseFloat(b.showInPos) - parseFloat(a.showInPos));
        } */
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

  goToFamili(name ,famili){
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

 /*  incrementQty(index: number) {
    this.product[index].quantity += 1;
  }

  decrementQty(index: number) {
    if (this.product[index].quantity > 1) {
      this.product[index].quantity -= 1;
    }
  } */
}
