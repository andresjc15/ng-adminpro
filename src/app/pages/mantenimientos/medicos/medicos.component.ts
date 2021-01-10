import { Component, OnDestroy, OnInit } from '@angular/core';
import { MedicoService } from '../../../services/medico.service';
import { Medico } from '../../../models/medico.model';
import { ModalImagenService } from '../../../components/modal-imagen/modal-imagen.service';
import { BusquedasService } from '../../../services/busquedas.service';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styleUrls: ['./medicos.component.css']
})
export class MedicosComponent implements OnInit, OnDestroy {

  public cargando: boolean = true;
  public medicos: Medico[] = [];
  public medicosTemp: Medico[] = [];

  private imgSubs: Subscription;

  constructor(
    private modalImagenService: ModalImagenService,
    private busquedasService: BusquedasService,
    private medicoService: MedicoService
  ) { }
  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  ngOnInit(): void {
    this.cargarMedicos();

    this.imgSubs = this.modalImagenService.nuevaImagen
    .pipe( delay(100) )
      .subscribe( img => this.cargarMedicos() );
  }

  cargarMedicos() {
    this.cargando = true;
    this.medicoService.cargarMedicos()
        .subscribe( medicos => {
          this.cargando = false;
          this.medicos = medicos;
          this.medicosTemp = medicos;
        })
  }

  eliminarMedcio( medico: Medico ) {
    Swal.fire({
      title: '¿Eliminar medico?',
      text: `¿Estas seguro de eliminar el medico ${ medico.nombre }?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, estoy seguro'
    }).then((result) => {
      if (result.isConfirmed) {
        this.medicoService.eliminarMedico( medico.id )
          .subscribe( resp => {
            Swal.fire(
              'Medico Eliminado',
              `${ medico.nombre } fue eliminado exitosamente`,
              'success'
            )
            this.cargarMedicos();
          }
          );
      }
    })
  }

  buscarMedico( termino: string ) {

    if ( termino.length === 0 ) {
      return this.medicos = this.medicosTemp;
    }

    this.busquedasService.buscar( 'medicos', termino )
        .subscribe( ( resultados: Medico[] ) => {
          this.medicos = resultados;
        });
  }

  abrirModal( medico: Medico ) {
    this.modalImagenService.abrirModal('medicos', medico.id, medico.img );
  }

}
