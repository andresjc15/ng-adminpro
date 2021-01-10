import { Component, OnDestroy, OnInit } from '@angular/core';
import { HospitalService } from '../../../services/hospitales.service';
import { Hospital } from '../../../models/hospital.model';
import Swal from 'sweetalert2';
import { ModalImagenService } from '../../../components/modal-imagen/modal-imagen.service';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { BusquedasService } from '../../../services/busquedas.service';

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styleUrls: ['./hospitales.component.css']
})
export class HospitalesComponent implements OnInit, OnDestroy {

  public hospitales: Hospital[] = [];
  public hospitalesTemp: Hospital[] = [];
  public cargando: boolean = true;

  private imgSubs: Subscription;

  constructor(
    private modalImagenService: ModalImagenService,
    private hospitalService: HospitalService,
    private busquedasService: BusquedasService
  ) { }
  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  ngOnInit(): void {
    this.cargarHospitales();

    this.imgSubs = this.modalImagenService.nuevaImagen
    .pipe( delay(100) )
      .subscribe( img => this.cargarHospitales() );
  }

  cargarHospitales() {
    this.cargando = true;
    this.hospitalService.cargarHospitales()
      .subscribe( hospitales => {
        this.cargando = false;
        this.hospitales = hospitales;
        this.hospitalesTemp = hospitales;
      })
  }

  guardarCambios( hospital: Hospital ) {
    this.hospitalService.actualizarHospital( hospital.id, hospital.nombre )
        .subscribe( resp => {
          Swal.fire('Actualizado', hospital.nombre, 'success' );
        });
  }

  eliminarHospital( hospital: Hospital ) {
    this.hospitalService.eliminarHospital( hospital.id )
        .subscribe( resp => {
          this.cargarHospitales();
          Swal.fire('Eliminado', hospital.nombre, 'success' );
        });
  }

  async abrirSweetAlert() {
    const { value = '' }= await Swal.fire<string>({
      title: 'Crear hospital',
      text: 'Ingrese el nombre del nuevo hospital',
      input: 'text',
      inputPlaceholder: 'Nombre del hospital',
      showCancelButton: true,
    });

    if ( value.trim().length > 0 ) {
      this.hospitalService.crearHospital( value )
          .subscribe( resp => {
            this.cargarHospitales();
          });
    }

    console.log(value);
  }

  abrirModal( hospital: Hospital ) {
    this.modalImagenService.abrirModal('hospitales', hospital.id, hospital.img );
  }

  buscar( termino: string ) {

    if ( termino.length === 0 ) {
      return this.hospitales = this.hospitalesTemp;
    }

    this.busquedasService.buscar( 'hospitales', termino )
        .subscribe( ( resultados: Hospital[] ) => {
          this.hospitales = resultados;
        });
  }

}
