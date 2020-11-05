import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {
  public products = [];
  public total = 0;
  public family = [];
  public shippingType;
  public shipping;
  constructor() { 
  }

  ngOnInit() {
    this.load();
  }

  ifLogin() {
    let identity = JSON.parse(localStorage.getItem('identity'));
    if (identity == null) {
      return true;
    } else {
      return false;
    }
  }

  load() {
    let familyname = '';
    let array = localStorage.getItem('cart');
    this.products = JSON.parse(array);
    console.log(this.products);
    
    for (let i = 0; i < this.products.length; i++) {
      var perProduct = this.products[i]["costPrice"] * this.products[i]["quantity"];
      this.products[i]['name'] = decodeURIComponent(escape(this.products[i]['name']));
      this.family.forEach(element => {
        if (element.id == this.products[i].familyId) {
          familyname = element.name
        }
      });
      this.products[i].familyName = familyname
      this.total = perProduct + this.total;
    }
    if (!this.shippingType) {
      if (this.total > 30) {
        this.shipping = 0
      } else {
        this.shipping = 5
      }
    }
  }

  incrementQty(index: number) {
    this.products[index].quantity += 1;
  }

  decrementQty(index: number) {
    if (this.products[index].quantity > 1) {
      this.products[index].quantity -= 1;
    }
  }

  get finalValue(): number {
    return this.products.reduce((sum, prod) => sum + (prod.quantity * prod.costPrice), 0)
  }

  deleteProduct(p) {
    for (let i = 0; i < this.products.length; i++) {
      if (p.id == this.products[i]["id"]) {
        this.products.splice(i, 1);
      }
    }
    this.total = 0;
    for (let i = 0; i < this.products.length; i++) {
      var perProduct = this.products[i]["costPrice"] * this.products[i]["quantity"];
      this.total = perProduct + this.total;
    }
    this.total += 5;
    localStorage.setItem('cart', JSON.stringify(this.products));
  }

  

}
