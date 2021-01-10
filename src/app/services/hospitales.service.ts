import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';
import { Hospital } from '../models/hospital.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class HospitalService {

  

  constructor(
    private http: HttpClient
  ) { }

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get headers() {
    return {
      headers: {
        'x-token': this.token
      }
    }
  }

  cargarHospitales( desde: number = 0 ) {
    // http://localhost:3000/api/usuarios?desde=0
    const url = `${ base_url }hospitales`;
    return this.http.get( url, this.headers )
              .pipe(
                map( (resp: {ok: boolean, hospitales: Hospital[] } ) => resp.hospitales )
              );
  }

  crearHospital( nombre: string ) {
    const url = `${ base_url }hospitales`;
    return this.http.post( url, { nombre }, this.headers );
  }

  actualizarHospital( id: string, nombre: string ) {
    const url = `${ base_url }hospitales/${ id }`;
    return this.http.put( url, { nombre }, this.headers );
  }

  eliminarHospital( id: string ) {
    const url = `${ base_url }hospitales/${ id }`;
    return this.http.delete( url, this.headers );
  }

}
