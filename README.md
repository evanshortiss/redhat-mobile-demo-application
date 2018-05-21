## Work in Progress
This repository is a work in progress.

## Device Security in 5 Minutes Demo
This application can be used to demonstrate how easy it is to add self-defense
checks using AeroGear to an application.

## Requirements

1. Node.js v6+
2. npm 5+
3. Android/iOS SDK & Tools

## Steps to Enforce Security
1. Provision the Metrics service on OpenShift into a new or existing project
2. Create an Android/iOS Application in OpenShift and use `com.redhat.acmebank`
as the package name.
3. Bind the Application and Metrics service then copy the resulting
configuration to the `src` folder here and name it `mobile-services.json`
4. Add the following AeroGear modules/plugins to this project:
  1. `npx ionic cordova plugin add cordova-plugin-aerogear-security --save`
  2. `npm install @aerogear/cordova-plugin-aerogear-security --save`
  3. `npm install @aerogear/app --save`
5. Create a `src/services/security.ts` file and paste the following content:

```ts
import { Injectable } from '@angular/core';
import { SecurityService, SecurityCheckResultMetric, SecurityCheckType, SecurityCheckResult } from '@aerogear/security';

@Injectable({
  providedIn: 'root'
})
export class DeviceSecurity {
  private securityService: SecurityService;
  private isBrowser: boolean

  constructor() {
    this.isBrowser = document.URL.indexOf('http') === 0

    if (!this.isBrowser) {
      this.securityService = new SecurityService();

      this.securityService.checkManyAndPublishMetric(
        SecurityCheckType.notDebugMode,
        SecurityCheckType.notRooted,
        SecurityCheckType.notEmulated,
        SecurityCheckType.hasDeviceLock
      );
    }
  }

  private check () {
    if (this.isBrowser) {
      // Just flag everything as a "pass" in the browser
      return Promise.resolve(true)
    }

    return this.securityService.check(SecurityCheckType.notRooted)
      .then(check => check.passed)
  }

  isRooted() {
    return this.check(SecurityCheckType.notRooted)
      // invert result since isRooted should be true if the check returns false
      .then(pass => !pass)
  }

  isDeviceLockEnabled() {
    return this.check(SecurityCheckType.hasDeviceLock)
  }
}
```

6. In `app.component.ts` add the following `import` and update the ready promise
like so:

```ts
// Add this to the top of the file
import { init } from '@aerogear/app';

platform.ready().then(() => {
  // Okay, so the platform is ready and our plugins are available.
  // Here you can do any higher level native things you might need.
  statusBar.styleDefault();

  // Initialise the mobile services SDK
  let appConfig = require('../mobile-services.json');
  init(appConfig);

  splashScreen.hide();
});
```

7. In `login.ts` add the following:
  1. `import { DeviceSecurity } from '../../services/security'`
  2. `private sec: DeviceSecurity` to the constructor
  3. `ionViewDidEnter() {}` to the class

8. Add the following into the `ionViewDidEnter()` function:

```ts
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
```

9. In `login.ts` update the `onPersistChange()` function like so:

```ts
this.sec.isDeviceLockEnabled()
  .then((lockEnabled) => {
    if (!lockEnabled) {
       let alert = this.alertCtrl.create({
        title: 'Device Lock Required',
        subTitle: 'To remain logged in you must enable a device lock. Update your device security settings and try again.',
        buttons: ['OK']
      });

      alert.present();

      // Don't allow the checkbox to be checked
      persistentLogin = false
    }
  })
```

## Icon Credits
Icons made by [Roundicons](https://www.flaticon.com/authors/roundicons) from 
[www.flaticon.com](https://www.flaticon.com/) are licensed by
[CC 3.0 BY](http://creativecommons.org/licenses/by/3.0/)

Icons made by [Freepik](http://www.freepik.com) from 
[www.flaticon.com](https://www.flaticon.com/) are licensed by
[CC 3.0 BY](http://creativecommons.org/licenses/by/3.0/)

Icons made by [Freepik](http://www.freepik.com) from 
[www.flaticon.com](https://www.flaticon.com/) are licensed by
[CC 3.0 BY](http://creativecommons.org/licenses/by/3.0/)

Icons made by [Pixel Buddha](https://www.flaticon.com/authors/pixel-buddha) from 
[www.flaticon.com](https://www.flaticon.com/) are licensed by [CC 3.0 BY](http://creativecommons.org/licenses/by/3.0/)
