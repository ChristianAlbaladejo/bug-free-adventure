import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../app/services/user.service';
import { User } from '../../../app/models/user';
import { NavController, LoadingController, AlertController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  providers: [UserService]
})
export class RegisterPage implements OnInit {
  public user: User;
  public password2;
  public token;
  public validateStreet = false;
  public formattedaddress = " ";
  public identity;
  options = {
    componentRestrictions: {
      country: ["ES"]
    }
  }

  public AddressChange(address: any) {
    this.validateStreet = false
    console.log(this.validateStreet, address);
    if (address != 'input') {
      //setting address from API to local variable 
      this.formattedaddress = address.formatted_address
      if (this.getDistanciaMetros(address.geometry.location.lat(), address.geometry.location.lng(), 37.804516, -0.831246)) {
        this.formattedaddress = "Podemos repartir"
        this.validateStreet = true
        this.user.calle = address.formatted_address
      } else {
        this.formattedaddress = "Lo sentimos no podemos repartir a esa dirección"
        this.user.calle = "";
        this.validateStreet = false
      }
    }
  }

  constructor(public navCtrl: NavController, private _userService: UserService, public loadingController: LoadingController, public alertController: AlertController, public toastController: ToastController) { }

  ngOnInit() {
    this.user = new User("", "", "", "", "", "", "", "", "");
  }

  async register() {
    const loading = await this.loadingController.create({
      message: 'Cargando...',
      translucent: true,
    });
    await loading.present();
    if (this.ifLogin) {
      localStorage.clear();
    }
    if (this.user.password == this.password2) {
      this._userService.register(this.user).subscribe(
        async response => {
          console.log(response);
          if (response.message != "El usuario ya existe!!"){
          // loguear al usuario y conseguir sus datos
          this._userService.login(this.user).subscribe(
            response => {
              this.identity = response.user;
              this.token = response.token;
              localStorage.setItem('identity', JSON.stringify(this.identity));
              localStorage.setItem('token', this.token);
              this.loadingController.dismiss();
              this.navCtrl.navigateForward('/home');
            },
            async error => {
              console.error(error);

              this.loadingController.dismiss();
              this.navCtrl.navigateForward('/login');
            }
          );
          }else {
            this.loadingController.dismiss();
            const toast = await this.toastController.create({
              message: 'Esta cuenta ya existe',
              duration: 2000,
              color: 'danger'
            });
            toast.present();
          }
        }, async error => {
          this.loadingController.dismiss();
          const toast = await this.toastController.create({
            message: 'Error al registrar su cuenta',
            duration: 2000,
            color: 'danger'
          });
          toast.present();
        });
    } else {
      const toast = await this.toastController.create({
        message: 'La contraseña no es la misma',
        duration: 2000,
        color: 'danger'
      });
      toast.present();
      this.loadingController.dismiss();
    }
  }

  getDistanciaMetros(lat1, lon1, lat2, lon2) {
    const rad = function (x) { return x * Math.PI / 180; }
    var R = 6378.137; //Radio de la tierra en km 
    var dLat = rad(lat2 - lat1);
    var dLong = rad(lon2 - lon1);
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(rad(lat1)) *
      Math.cos(rad(lat2)) * Math.sin(dLong / 2) * Math.sin(dLong / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    var d = R * c;
    console.log(d)
    if (d <= 8) {
      return true
    } else {
      return false
    }
  }

  ifLogin() {
    /* this._userService.ifGetIdentity(); */
    let identity = JSON.parse(localStorage.getItem('identity'));
    if (identity == null) {
      return true;
    } else {
      return false;
    }
  }
}
