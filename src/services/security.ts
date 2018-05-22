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
