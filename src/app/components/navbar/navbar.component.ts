import { Component, effect, signal } from '@angular/core';

import { MatButtonModule } from '@angular/material/button'
import { MatToolbarModule } from '@angular/material/toolbar'
import { MatIconModule } from '@angular/material/icon'
import {MatSlideToggleModule} from '@angular/material/slide-toggle';

@Component({
  selector: 'app-navbar',
  imports: [MatButtonModule, MatToolbarModule, MatIconModule, MatSlideToggleModule, ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {

  darkMode = signal(false);

  toogleMode(){
    this.darkMode.update(val => !val)
  }


  applyDarkMode = effect(() => {
    const darkMode = this.darkMode();

    document.body.classList.toggle('darkMode', darkMode)
  })
}
