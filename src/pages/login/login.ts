import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { AuthService } from '../../services/auth-service';
import { DeviceSecurity } from '../../services/security'


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

  constructor(private auth: AuthService, private navCtrl: NavController, private alertCtrl: AlertController, private sec: DeviceSecurity) {
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
    this.sec.isDeviceLockEnabled()
      .then((lockEnabled) => {
        if (!lockEnabled) {
          let alert = this.alertCtrl.create({
            title: 'Device Lock Required',
            subTitle: 'To enable the "Stay Logged In" you must have set a device lock. Update your device security settings and try again.',
            buttons: ['OK']
          });

          alert.present();

          // Don't allow the checkbox to be checked
          this.persistentLogin = false
        }
      })
  }

  public onChange () {
    if (this.password.length > 5 && this.isEmail(this.email)) {
      this.loginEnabled = true
    } else {
      this.loginEnabled = false
    }
  }

  ionViewDidEnter() {
    this.sec.isRooted()
      .then((rooted) => {
        if (rooted) {
          let alert = this.alertCtrl.create({
            title: 'Insecure Device',
            subTitle: 'We detected that this device is rooted. Running as root increases the likelihood of your device being compromised by malicious software that is designed to steal passwords and financial information. Continued use of this application is at your own risk.',
            buttons: ['OK']
          });

          alert.present();
        }
      })
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
