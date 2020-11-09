import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NavController, LoadingController, AlertController, ToastController } from '@ionic/angular';
@Component({
  selector: 'app-purchase-payment',
  templateUrl: './purchase-payment.page.html',
  styleUrls: ['./purchase-payment.page.scss'],
})
export class PurchasePaymentPage implements OnInit {
  myDate: String = new Date().toISOString();
  public products = [];
  public total = 0;
  public family = [];
  public shippingType;
  public shipping;
  public user;
  public orderNotes;
  public chargesType = "tarjeta"

  constructor(private http: HttpClient, public navCtrl: NavController) { }

  ngOnInit() {
    this.load();
  }

  load() {
    this.user = localStorage.getItem("identity")
    this.user = JSON.parse(this.user);
    
    let familyname = '';
    let array = localStorage.getItem('cart'); 
    this.products = JSON.parse(array);
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
  }

  buy() {
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
      'deliveryDate': this.myDate,
      'orderNotes': this.orderNotes,
      'chargesType': this.chargesType
    };
    console.log(body);
    
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem("token")
    });
    this.http
      .post('https://panesandco.herokuapp.com/order',
        body, { headers: headers })
      .subscribe(data => {
        localStorage.removeItem('cart');
        localStorage.setItem('cart', JSON.stringify({}));
        this.navCtrl.navigateRoot('/home')
      }, error => {
      });
  }

}
