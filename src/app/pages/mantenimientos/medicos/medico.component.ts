import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { subscribeOn, delay } from 'rxjs/operators';
import { Hospital } from 'src/app/models/hospital.model';
import { HospitalService } from '../../../services/hospitales.service';
import { MedicoService } from '../../../services/medico.service';
import { Medico } from '../../../models/medico.model';
import Swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styles: [
  ]
})
export class MedicoComponent implements OnInit {

  public hospitales: Hospital[] = [];
  public medicoForm: FormGroup;
  public hospitalSeleccionado: Hospital;
  public medicoSeleccionado: Medico;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private hospitalService: HospitalService,
    private medicoService: MedicoService
  ) { }

  ngOnInit(): void {

    this.getMedicoById();

    this.medicoForm = this.fb.group({
      nombre: [ '', Validators.required ],
      hospital: [ '', Validators.required ]
    });

    this.cargarHospitales();

    this.medicoForm.get('hospital').valueChanges
      .subscribe( hospitalId => {
        this.hospitalSeleccionado = this.hospitales.find( h => h._id === hospitalId );
      });

  }

  cargarHospitales() {
    this.hospitalService.cargarHospitales()
      .subscribe( ( hospitales: Hospital[] ) => {
        this.hospitales = hospitales;
      });
  }

  guardarMedico() {

    const { nombre } = this.medicoForm.value;
    console.log(this.medicoSeleccionado);

    if ( this.medicoSeleccionado ) {

      const data = {
        ...this.medicoForm.value,
        _id : this.medicoSeleccionado._id
      }

      this.medicoService.actualizarMedico( data )
        .subscribe( ( resp: any ) => {
          Swal.fire('Actualizado', `${ nombre } actualizado exitosamente`, 'success');
          // this.router.navigateByUrl(`/dashboard/medicos/${ resp.medico.id }`);
        });
    } else {

      this.medicoService.crearMedico( this.medicoForm.value )
          .subscribe( ( resp: any ) => {
            Swal.fire('Creado', `${ nombre } creado exitosamente`, 'success');
            this.router.navigateByUrl(`/dashboard/medicos/${ resp.medico.id }`);
          });
    }

  }

  getMedicoById() {
    
    this.activatedRoute.params.subscribe( ({ id }) => {
      if ( id === 'nuevo' ) {
        return;
      }
      this.medicoService.getMedicoById(id)
          .pipe(
            delay(100)
          )
          .subscribe( medico => {
            if ( !medico ) {
              return this.router.navigateByUrl(`/dashboard/medicos`);
            }
            const { nombre, hospital: { _id } } = medico;
            this.medicoSeleccionado = medico;
            this.medicoForm.setValue({ nombre, hospital: _id });
          });
    });
    
  }

}
