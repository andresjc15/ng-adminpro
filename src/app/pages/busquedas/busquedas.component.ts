import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { BusquedasService } from '../../services/busquedas.service';

import { Usuario } from '../../models/usuario.model';
import { Medico } from '../../models/medico.model';
import { Hospital } from '../../models/hospital.model';

@Component({
  selector: 'app-busquedas',
  templateUrl: './busquedas.component.html',
  styles: [
  ]
})
export class BusquedasComponent implements OnInit {

  public usuarios: Usuario[] = [];
  public medicos: Medico[] = [];
  public hospitales: Hospital[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private busquedasService: BusquedasService
  ) { }

  ngOnInit(): void {
    this.busquedaGlobal();
  }

  busquedaGlobal() {
    this.activatedRoute.params
        .subscribe( ({ termino }) => {
          this.busquedasService.busquedaGlobal( termino )
              .subscribe( ( resp: any ) => {
                this.usuarios   = resp.usuarios;
                this.hospitales = resp.hospitales;
                this.medicos    = resp.medicos;
              });
        });
  }

}
