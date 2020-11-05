import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../../../app/services/products.service';
import { NavController, LoadingController, AlertController  } from '@ionic/angular';

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
  constructor(private _productsService: ProductsService, public navCtrl: NavController, public loadingController: LoadingController, public alertController: AlertController) { }

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

  goToFamili(name ,famili){
    this.navCtrl.navigateForward('/' + name + '/' + famili.toString());
  }

  doRefresh(event) {
    this.load();
    event.target.complete();
  }
}
