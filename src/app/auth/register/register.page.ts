import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  public name;
  public email;
  public lastname;
  public CIF;
  public street;
  public phone;
  public CP;
  public location;
  public password;
  public password2;
  public validateStreet = false;
  public formattedaddress = " ";
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
        this.street = address.formatted_address
      } else {
        this.formattedaddress = "Lo sentimos no podemos repartir a esa dirección"
        this.street = "";
        this.validateStreet = false
      }
    }
  }

  constructor() { }

  ngOnInit() {
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
}
