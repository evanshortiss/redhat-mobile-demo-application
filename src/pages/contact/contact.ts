import { Component } from '@angular/core';
import { NavController, App } from 'ionic-angular';
import { AuthService } from '../../services/auth-service';
import { LoginPage } from '../login/login';

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {

  constructor(public navCtrl: NavController, private app: App, private auth: AuthService) {

  }

  signout () {
    this.auth.logout()
      .then(() => {
        this.app.getRootNav().setRoot(LoginPage)
      })
  }
}
