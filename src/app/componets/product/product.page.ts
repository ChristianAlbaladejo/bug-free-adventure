import { Component, Input, OnInit } from '@angular/core';
import { ToastController, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-product',
  templateUrl: './product.page.html',
  styleUrls: ['./product.page.scss'],
})
export class ProductPage implements OnInit {
  @Input() product: any;
    cart = [];
    array: any;

  constructor(public toastController: ToastController, public modalController: ModalController) { }

  ngOnInit() {
    let array = localStorage.getItem('cart');
    array = JSON.parse(array);
    for (let i = 0; i < array.length; i++) {
      this.cart.push(array[i]);
    }
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

  dismiss(){
    this.modalController.dismiss();
  }
}
