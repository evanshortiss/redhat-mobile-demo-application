import { Component } from '@angular/core';
import { App, LoadingController, AlertController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'page-send',
  templateUrl: 'send.html'
})
export class SendPage {
  private from: string
  private recipient: string
  private amount: number

  constructor(private app: App, private alertCtrl: AlertController, private loadingCtrl: LoadingController, private auth: AuthService) {

  }

  signout () {
    this.auth.logout()
      .then(() => {
        this.app.getRootNav().setRoot(LoginPage)
      })
  }

  doSend () {
    let confirm = this.alertCtrl.create({
      title: 'Confirm Transaction',
      message: `Are you sure you want to send $${this.amount} from your ${this.from} account to ${this.recipient}?`,
      buttons: [
        {
          text: 'No',
          handler: () => {}
        },
        {
          text: 'Yes',
          handler: () => {
            const loader = this.loadingCtrl.create({
              content: 'Completing transaction...',
              duration: 3000,
            })

            loader.onDidDismiss(() => {
              this.from = ''
              this.recipient = ''
              this.amount = null
            })

            loader.present()
          }
        }
      ]
    });

    confirm.present();
  }

}
