import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, map, catchError } from 'rxjs/operators';
import { of, Observable } from 'rxjs';
import { Router } from '@angular/router';

import { environment } from 'src/environments/environment';

import { RegisterForm } from '../interfaces/register-form';
import { LoginForm } from '../interfaces/login-form';
import { Usuario } from '../models/usuario.model';
import { CargarUsuario } from '../interfaces/cargar-usuarios.interface';

declare const gapi: any;

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  public auth2: any;
  public usuario: Usuario;

  constructor(
    private http: HttpClient,
    private router: Router,
    private ngZone: NgZone
  ) { 
    this.googleInit();
  }

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get role(): 'ADMIN_ROLE' | 'USER_ROLE' {
    return this.usuario.role;
  }

  get uid(): string {
    return this.usuario.uid || '';
  }

  get headers() {
    return {
      headers: {
        'x-token': this.token
      }
    }
  }

  googleInit() {
    return new Promise<void>( (resolve) => {
      gapi.load('auth2', () => {
        // Retrieve the singleton for the GoogleAuth library and set up the client.
        this.auth2 = gapi.auth2.init({
          client_id: '1059715246594-633h54dsj48blr3fodb6di60cs6isqqf.apps.googleusercontent.com',
          cookiepolicy: 'single_host_origin'
        });
        resolve();
      });
    });
  }

  guardarLocalStorage( token: string, menu: any ) {
    localStorage.setItem('token', token);
    localStorage.setItem('menu', JSON.stringify(menu));
  }

  validarToken(): Observable<boolean> {

    return this.http.get(`${base_url}login/renew`, {
      headers: {
        'x-token': this.token
      }
    }).pipe(
      map( (resp: any) => {
        console.log(resp);
        const { email, google, nombre, role, img = '', uid }= resp.usuario;
        this.usuario = new Usuario( nombre, email, '', img, google, role, uid );
        this.guardarLocalStorage(resp.token, resp.menu);
        return true;
      }),
      catchError( error => of(false) )
    );
  }

  crearUsuario( formData: RegisterForm ) {
    return this.http.post(`${base_url}usuarios`, formData)
                .pipe(
                  tap( ( resp: any ) => {
                    this.guardarLocalStorage(resp.token, resp.menu);
                  })
                );
  }

  actualizarPerfil( data: { email: string, nombre: string, role: string } ){

    data = {
      ...data,
      role: this.usuario.role
    }
    return this.http.put(`${base_url}usuarios/${this.uid}`, data, this.headers );
  }

  login( formData: LoginForm ) {
    return this.http.post(`${base_url}login`, formData)
                .pipe(
                  tap( (resp: any) => {
                    this.guardarLocalStorage(resp.token, resp.menu);
                  })
                );
  }

  loginGoogle( token ) {
    return this.http.post(`${base_url}login/google`, {token})
                .pipe(
                  tap( (resp: any) => {
                    this.guardarLocalStorage(resp.token, resp.menu);
                  })
                );
  }
  
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('menu');

    this.auth2.signOut().then( () => {
      // NgZone - Para no perder el ciclo de vida de angular por navegacion de libreria externas (GoogleSignIn)
      this.ngZone.run( () => {
        this.router.navigateByUrl('/login');
      });
    });
  }

  cargarUsuario( desde: number = 0 ) {
    // http://localhost:3000/api/usuarios?desde=0
    const url = `${ base_url }usuarios?desde=${ desde }`;
    return this.http.get<CargarUsuario>( url, this.headers )
            .pipe(
              map( resp => {
                const usuarios = resp.usuarios.map( 
                  user => new Usuario(user.nombre, user.email, '', user.img, user.google, user.role, user.uid )
                );
                return {
                  total: resp.total,
                  usuarios
                };
              })
            );
  }

  actualizarUsuario( usuario: Usuario ){
    return this.http.put(`${base_url}usuarios/${ usuario.uid }`, usuario, this.headers );
  }

  eliminarUsuario( usuario: Usuario ) {
    const url = `${ base_url }usuarios/${ usuario.uid }`;
    return this.http.delete( url, this.headers );
  }

}
