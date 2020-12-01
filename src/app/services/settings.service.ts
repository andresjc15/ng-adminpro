import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  public linkTheme = document.querySelector('#theme');

  constructor() {
    // if else tema por defecto
    const url = localStorage.getItem('theme') || './assets/css/colors/default-dark.css';
    
    this.linkTheme.setAttribute('href', url);
  }

  changeTheme( theme: string ) {
    
    const url = `./assets/css/colors/${ theme }.css`;

    // Vainilla js
    this.linkTheme.setAttribute('href', url);
    localStorage.setItem('theme', url);

    this.checkCurrentTheme();
    
  }

  checkCurrentTheme() {

    const links = document.querySelectorAll('.selector');

    links.forEach( element => {

      element.classList.remove('working');
      const btnTheme = element.getAttribute('data-theme');
      const btnThemeUrl = `./assets/css/colors/${ btnTheme }.css`;
      const currentTheme = this.linkTheme.getAttribute('href');

      if ( btnThemeUrl === currentTheme ) {
        element.classList.add('working');
      }
      
    });

  }

}
