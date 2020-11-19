import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NavController, LoadingController, AlertController, ToastController } from '@ionic/angular';
import { environment } from '../../../environments/environment';
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
  public orderNotes = "";
  public chargesType = "tarjeta"
  public deliveryType = "tienda"

  constructor(private http: HttpClient, public navCtrl: NavController, public loadingController: LoadingController, public alertController: AlertController, public toastController: ToastController,) { }

  ngOnInit() {
    this.total = history.state.total;
    this.load();
  }

  load() {
    this.user = localStorage.getItem("identity")
    this.user = JSON.parse(this.user);

    let familyname = '';
    let array = localStorage.getItem('cart');
    this.products = JSON.parse(array);
    for (let i = 0; i < this.products.length; i++) {
      this.products[i]['name'] = decodeURIComponent(this.products[i]['name']);
      this.family.forEach(element => {
        if (element.id == this.products[i].familyId) {
          familyname = element.name
        }
      });
      this.products[i].familyName = familyname
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
      'userName': this.user[0].name + " " + this.user[0].lastname,
      'userPhone': this.user[0].telefono + " " + this.user[0].calle + " " + this.user[0].poblacion + " " + this.user[0].CP,
      'email': this.user[0].email,
      'deliveryDate': this.myDate,
      'orderNotes': this.orderNotes + "- " + this.deliveryType ,
      'chargesType': this.chargesType
    };
    /*    var stripe = Stripe("pk_test_51HEUwyHEn9GtZEa1MREuwoi8CkUzInUwOkcGkcS87p5mr0wr5uq0I3tTaWeGUZidIJguf1vljNTxm8cge7YSwzfh00BsLJlyKO");
       fetch("https://panesandco.herokuapp.com/create-session", {
           method: "POST",
         })
           .then(function (response) {
             return response.json();
           })
           .then(function (session) {
             return stripe.redirectToCheckout({ sessionId: session.id });
           })
           .then(function (result) {
             // If redirectToCheckout fails due to a browser or network
             // error, you should display the localized error message to your
             // customer using error.message.
             if (result.error) {
               alert(result.error.message);
             }
           })
           .catch(function (error) {
             console.error("Error:", error);
           });
        */
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem("token")
    });
    this.http
      .post(environment.APIURL + '/order',
        body, { headers: headers })
      .subscribe(async data => {
        localStorage.removeItem('cart');
        localStorage.setItem('cart', JSON.stringify({}));
        const toast = await this.toastController.create({
          message: 'Pedido realizado 🎉',
          duration: 2000,
          color: 'success'
        });
        toast.present();
        this.navCtrl.navigateRoot('/home')
      }, error => {
      });
  }


  async charge() {
    const loading = await this.loadingController.create({
      message: 'Preparando pedido...',
      translucent: true,
    });
    await loading.present();
    if (this.chargesType == 'tarjeta') {
      var handler = (<any>window).StripeCheckout.configure({
        key: environment.STRIPEPK,
        locale: 'auto',
        token: (token: any) => {
          // You can access the token ID with `token.id`.
          // Get the token ID to your server-side code for use.
          var body = {
            'stripeToken': token.id,
            'amount': this.total * 100
          };
          let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          });
          this.http.post(environment.APIURL + '/charge',
            body, { headers: headers })
            .subscribe(data => {
              this.buy()
            }, async error => {
              const alert = await this.alertController.create({
                header: 'Contacta con nosotros por favor',
                message: 'Parece que tenemos problemas 🥴',
                buttons: [
                  {
                    text: 'Okay'
                  }
                ]
              });
              await alert.present();
            });
        }
      });
      handler.open({
        name: 'Tu Empresa Checkout',
        description: '',
        amount: this.total * 100
      });
    } else {
      this.buy()
    }
    this.loadingController.dismiss();
  }

}
