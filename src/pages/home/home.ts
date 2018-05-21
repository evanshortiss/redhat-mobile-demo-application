import { Component } from '@angular/core';
import { NavController, App } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController, private app: App, private auth: AuthService) {

  }

  signout () {
    this.auth.logout()
      .then(() => {
        this.app.getRootNav().setRoot(LoginPage)
      })
  }

}
