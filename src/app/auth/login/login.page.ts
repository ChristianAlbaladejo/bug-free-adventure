import { Component, OnInit } from '@angular/core';
import { User } from '../../../app/models/user';
import { UserService } from '../../../app/services/user.service';
import { NavController, LoadingController, AlertController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  providers: [UserService]
})
export class LoginPage implements OnInit {

  public password = "";
  public email = "";
  public user;
  public token;
  public identity;
  constructor(public navCtrl: NavController, private _userService: UserService, public loadingController: LoadingController, public alertController: AlertController, public toastController: ToastController) {
    this.user = new User("", "", "", "", "", "", "", "", "");
  }
  ngOnInit() {
  }

  async login() {
    const loading = await this.loadingController.create({
      message: 'Cargando...',
      translucent: true,
    });

    await loading.present();
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
        const toast = await this.toastController.create({
          message: 'Comprueba los capos por favor 🥴',
          duration: 2000,
          color: 'danger'
        });
        toast.present();
        this.loadingController.dismiss();
      });
  }

}
