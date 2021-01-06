import { Component, OnDestroy, OnInit } from '@angular/core';
import { delay } from 'rxjs/operators';

import Swal from 'sweetalert2';

import { Usuario } from '../../../models/usuario.model';

import { BusquedasService } from '../../../services/busquedas.service';
import { ModalImagenService } from '../../../components/modal-imagen/modal-imagen.service';
import { UsuarioService } from '../../../services/usuario.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: [
  ]
})
export class UsuariosComponent implements OnInit, OnDestroy {

  public totalUsuarios: number = 0;
  public usuarios: Usuario[] = [];
  public usuariosTemp: Usuario[] = [];

  public imgSubs: Subscription;

  public desde: number = 0;
  public cargando: boolean = true;

  constructor(
    private usuarioService: UsuarioService,
    private busquedasService: BusquedasService,
    private modalImagenService: ModalImagenService
  ) { }

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  ngOnInit(): void {
    this.cargarUsuarios();
    this.imgSubs = this.modalImagenService.nuevaImagen
    .pipe(
      delay(100)
    )
      .subscribe( img => {
        console.log(img);
        this.cargarUsuarios()
      } );
  }

  cargarUsuarios() {
    this.cargando = true;
    this.usuarioService.cargarUsuario( this.desde )
      .subscribe( ({ total, usuarios }) => {
        this.totalUsuarios = total;
        if ( usuarios.length !== 0 ) {
          this.usuarios = usuarios;
          this.usuariosTemp = usuarios;
          this.cargando = false;
        }
        
      });
  }

  cambiarPagina( valor: number ) {
    this.desde += valor;

    if ( this.desde < 0 ) {
      this.desde = 0;
    } else if ( this.desde > this.totalUsuarios ) {
      this.desde -= valor;
    }

    this.cargarUsuarios();
  }

  buscar( termino: string ) {

    if ( termino.length === 0 ) {
      return this.usuarios = this.usuariosTemp;
    }

    this.busquedasService.buscar( 'usuarios', termino )
        .subscribe( resultados => {
          this.usuarios = resultados;
        });
  }

  eliminarUsuario( usuario: Usuario ) {
    if ( usuario.uid === this.usuarioService.uid ) {
      return Swal.fire('No puede borrarse a si mismo');
    }
    Swal.fire({
      title: '¿Borrar usuario?',
      text: `Estas seguro de eliminar el usuario ${usuario.nombre}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, estoy seguro'
    }).then((result) => {
      if (result.isConfirmed) {
        this.usuarioService.eliminarUsuario( usuario )
          .subscribe( resp => {
            Swal.fire(
              'Usuario Eliminado',
              `${ usuario.nombre } fue eliminado exitosamente`,
              'success'
            )
            this.cargarUsuarios();
          }
          );
      }
    })
  }

  cambiarRole( usuario: Usuario ) {
    this.usuarioService.actualizarUsuario( usuario )
      .subscribe( resp => {
        console.log(resp);
      });
  }

  abrirModal( usuario: Usuario ) {
    console.log(usuario);
    this.modalImagenService.abrirModal('usuarios', usuario.uid, usuario.img );
  }

}
