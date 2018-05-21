import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { AuthService } from '../../services/auth-service';


@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  public password: string
  public email: string
  public loginEnabled: boolean
  public persistentLogin: boolean
  public backgroundImage: string

  constructor(private auth: AuthService, private navCtrl: NavController, private alertCtrl: AlertController) {
    this.email = localStorage.getItem('banking.username')
    this.password = ''
    this.loginEnabled = false
    this.persistentLogin = this.email ? true : false

    const imgNumber = Math.floor(Math.random() * 3)
    const imgUrl = `url(assets/imgs/login-bg-${imgNumber}.jpg)`
    this.backgroundImage = imgUrl
    console.log('background is ', this.backgroundImage)
  }

  private isEmail (email: string) {
    return email.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
  }

  public onPersistChange() {
    // Implement custom logic in response to box being checked
    console.log('persistent changed')
  }

  public onChange () {
    if (this.password.length > 5 && this.isEmail(this.email)) {
      this.loginEnabled = true
    } else {
      this.loginEnabled = false
    }
  }

  doLogin () {
    this.auth.login(this.email, this.password, this.persistentLogin)
      .then(() => this.navCtrl.setRoot(TabsPage))
      .catch((e) => {
        return this.alertCtrl.create({
          title: 'Login Failed',
          subTitle: e.toString(),
          buttons: ['OK']
        }).present()
      })
  }
}
