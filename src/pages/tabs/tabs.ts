import { Component } from '@angular/core';

import { SendPage } from '../send/send';
import { ContactPage } from '../contact/contact';
import { HomePage } from '../home/home';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = SendPage;
  tab3Root = ContactPage;

  constructor() {

  }
}
