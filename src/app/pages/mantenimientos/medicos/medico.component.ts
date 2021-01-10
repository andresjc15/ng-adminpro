import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { subscribeOn } from 'rxjs/operators';
import { Hospital } from 'src/app/models/hospital.model';
import { HospitalService } from '../../../services/hospitales.service';

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

  constructor(
    private fb: FormBuilder,
    private hospitalService: HospitalService
  ) { }

  ngOnInit(): void {

    this.medicoForm = this.fb.group({
      nombre: [ 'Steve', Validators.required ],
      hospital: [ '', Validators.required ]
    });

    this.cargarHospitales();

    this.medicoForm.get('hospital').valueChanges
      .subscribe( hospitalId => {
        this.hospitalSeleccionado = this.hospitales.find( h => h.id === hospitalId );
      });

  }

  cargarHospitales() {
    this.hospitalService.cargarHospitales()
      .subscribe( ( hospitales: Hospital[] ) => {
        this.hospitales = hospitales;
      });
  }

  guardarMedico() {
    console.log(this.medicoForm.value);
  }

}
