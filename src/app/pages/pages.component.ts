import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styles: [
  ]
})
export class PagesComponent implements OnInit {

  public linkTheme = document.querySelector('#theme');

  constructor() { }

  ngOnInit(): void {

    var theme = localStorage.getItem('theme');
    if ( theme == null ) {
      url = './assets/css/colors/default-dark.css';
    } else {
      var url = theme;
    }
    
    this.linkTheme.setAttribute('href', url);
    
  }

}
