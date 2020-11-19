import { Component, Input, OnInit } from '@angular/core';
import { ToastController, ModalController } from '@ionic/angular';
import { ProductsService } from '../../../app/services/products.service';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-product',
  templateUrl: './product.page.html',
  styleUrls: ['./product.page.scss'],
  providers: [ProductsService],
})
export class ProductPage implements OnInit {
  @Input() product: any;
    cart = [];
    array: any;
    public user;
    public productLike

  constructor(public toastController: ToastController, public modalController: ModalController, private http: HttpClient, private _productsService: ProductsService) { }

  ngOnInit() {
    this.user = localStorage.getItem("identity")
    this.user = JSON.parse(this.user);
    let array = localStorage.getItem('cart');
    array = JSON.parse(array);
    for (let i = 0; i < array.length; i++) {
      this.cart.push(array[i]);
    }
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
    this.product.notes = "";
  }

  async addToCart(){
    let flag = false;
    this.array = localStorage.getItem('cart');
    this.array = JSON.parse(this.array);
    console.log(this.array.length);
    for (let i = 0; i < this.array.length; i++) {
      console.log(this.array[i]);
      if (this.array[i].id == this.product.id) {
        this.array[i].quantity += this.product.quantity;
        flag = true
      }
    }
    if (flag) {
      localStorage.setItem('cart', JSON.stringify(this.array));
    } else {
      this.cart.push(this.product);
      localStorage.setItem('cart', JSON.stringify(this.cart));
    }
    console.log(flag);
    
    const toast = await this.toastController.create({
      message: 'Producto añadido',
      duration: 2000,
      color: 'success'
    });
    toast.present();
    this.dismiss();
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

  dismiss(){
    this.modalController.dismiss();
  }
}
