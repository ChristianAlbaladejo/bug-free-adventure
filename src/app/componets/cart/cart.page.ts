import { Component, OnInit } from '@angular/core';
import { NavController, LoadingController, AlertController, ToastController } from '@ionic/angular';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';


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
  public user;
  public orderNotes;
  public footerIsHidden = true

  constructor(public navCtrl: NavController, private http: HttpClient) {
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
    this.footerIsHidden = true;
    this.user = localStorage.getItem("identity")
    this.user = JSON.parse(this.user);
    let familyname = '';
    let array = localStorage.getItem('cart');
    if (array.length != 2) {
      this.products = JSON.parse(array);
      console.log(this.products);
      for (let i = 0; i < this.products.length; i++) {
        var perProduct = this.products[i]["costPrice"] * this.products[i]["quantity"];
        this.products[i]['name'] = decodeURIComponent(this.products[i]['name']);
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
      console.log(this.products);
      this.footerIsHidden = false;
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
    this.load()
  }

  purchase() {
    this.buy();
  }

  ionViewWillLoad() {
    this.load();
  }

  loadStripe() {
    if (!window.document.getElementById('stripe-script')) {
      var s = window.document.createElement("script");
      s.id = "stripe-script";
      s.type = "text/javascript";
      s.src = "https://checkout.stripe.com/checkout.js";
      window.document.body.appendChild(s);
    }
  }

  buy() {
    /*   var deliveryDate = new Date();
      let orderlines = JSON.stringify(this.products)
      let re = /\"/gi;
      let result = orderlines.replace(re, "'");
      var body = {
        'orderLines': result,
        'cashDiscount': 0,
        'grossAmount': this.total,
        'surchargeRate': 0,
        'netAmount': 0,
        'vatAmount': 0,
        'surchargeAmount': 0,
        'sended': true,
        'userId': this.user[0].id,
        'email': this.user[0].email,
        'deliveryDate': deliveryDate.toISOString(),
        'orderNotes': this.orderNotes,
        'chargesType': 0
      };
      let headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem("token")
      });
      this.http
        .post('https://panesandco.herokuapp.com/order',
          body, { headers: headers })
        .subscribe(data => {
        }, error => {
        }); */


  }
}
