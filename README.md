## Work in Progress
This repository is a work in progress.

## Device Security in 5 Minutes Demo
This application can be used to demonstrate how easy it is to add self-defense
checks using AeroGear to an application.

## Requirements

1. Node.js v6.11`+
2. npm 5.6+
3. Android/iOS SDK & Tools

## Steps to Enforce Security
1. Provision the Metrics service on OpenShift into a new or existing project
2. Create an Android/iOS Application in OpenShift and use `com.redhat.acmebank`
as the package name.
3. Bind the Application and Metrics service then copy the resulting
configuration to the `src` folder here and name it `mobile-services.json`
4. Add the following AeroGear modules/plugins to this project:
  1. `npx ionic cordova plugin add @aerogear/cordova-plugin-aerogear-security --save`
  2. `npx ionic cordova plugin add @aerogear/cordova-plugin-aerogear-metrics --save`
  3. `npm install @aerogear/app --save`
  4. `npm install @aerogear/security --save`
5. Create a `src/services/security.ts` file and paste the following content:

```ts
import { Injectable } from '@angular/core';
import { SecurityService, SecurityCheckType, SecurityCheck } from '@aerogear/security';

@Injectable()
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

  private check (check: SecurityCheck) {
    if (this.isBrowser) {
      // Just flag everything as a "pass" in the browser
      return Promise.resolve(true)
    }

    return this.securityService.check(check)
      .then(check => check.passed)
  }

  isRooted() {
    return this.check(SecurityCheckType.notRooted)
      // invert result since isRooted should be true if the check returns false
      .then((pass) => !pass)
  }

  isDeviceLockEnabled() {
    return this.check(SecurityCheckType.hasDeviceLock)
  }
}
```

6. In `app.component.ts` add the following `import` and initialise the SDK
before `platform.ready()`:

```ts
// Add this to the top of the file
import { init } from '@aerogear/app';

// Necessary to prevent compiler warnings
declare var require: any

// Initialise the mobile services SDK
let appConfig = require('../mobile-services.json');
init(appConfig);

platform.ready().then(() => {
  // Okay, so the platform is ready and our plugins are available.
  // Here you can do any higher level native things you might need.
  statusBar.styleDefault();
  splashScreen.hide();
});
```

7. In `login.ts` add the following snippets:
  1. `import { DeviceSecurity } from '../../services/security'`
  2. `private sec: DeviceSecurity` to the constructor
  3. `ionViewDidEnter() {}` to the class

8. Add the following code in the `ionViewDidEnter()` function you created:

```ts
this.sec.isRooted()
  .then((rooted) => {
    if (rooted) {
      let alert = this.alertCtrl.create({
        title: 'Insecure Device',
        subTitle: 'We detected that this device is rooted. Running as root increases the likelihood of your device being compromised by malicious software that is designed to steal passwords and financial information. Continued use of this application is done so at your own risk.',
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
        subTitle: 'The "Stay Logged In" feature requires a device lock to be enabled. Update your device security settings and try again.',
        buttons: ['OK']
      });

      alert.present();

      // Don't allow the checkbox to be checked
      this.persistentLogin = false
    }
  })
```

10. Finally update `app.module.ts` by adding:
  1. `import { DeviceSecurity } from '../services/security';` at the top
  2. `DeviceSecurity` to the `providers` Array in the `@NgModule` block

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
