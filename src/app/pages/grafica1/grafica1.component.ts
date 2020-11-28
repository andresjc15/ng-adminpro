import { Component } from '@angular/core';

@Component({
  selector: 'app-grafica1',
  templateUrl: './grafica1.component.html',
  styles: [
  ]
})
export class Grafica1Component {

  public categorias: string[] = ['Calzado', 'Electro', 'Frutas', 'Hogar'];
  public valores1 = [ 450, 810, 155, 822];

  public valores2 = [ 140, 29, 85, 15];

  constructor() { }

  ngOnInit(): void {
  }

}
