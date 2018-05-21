import { Injectable } from '@angular/core';
import { LoadingController } from 'ionic-angular';

@Injectable()
export class AuthService {

  constructor (private loadingCtrl: LoadingController) {}

  logout () {
    // Clear token etc...
    return new Promise((resolve) => resolve())
  }

  login (email: string, password: string, rememberUser: boolean) {
    return new Promise((resolve, reject) => {

      const duration = Math.random() * 3000

      let loading = this.loadingCtrl.create({
        content: '<p>Sigining In</p>',
        duration: duration
      })

      setTimeout(() => {
        loading.setContent('<p>Fetching Accounts</p>')
      }, duration * 0.5)

      loading.onDidDismiss(() => {
        if (email.trim() !== 'shadowman@redhat.com' || password.length < 5) {
          reject(new Error('Login failed. Check username and password then try again.'))
        } else {
          if (rememberUser) {
            localStorage.setItem('banking.username', email)
          } else {
            localStorage.removeItem('banking.username')
          }

          resolve();
        }
      })

      loading.present()

    });
  }

}
