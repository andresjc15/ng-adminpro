import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../models/usuario.model';
import { FileUploadService } from '../../services/file-upload.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  public perfilForm: FormGroup;
  public usuario: Usuario;
  public imagenSubir: File;
  public imgTemp: any = null;

  constructor(
    private fb: FormBuilder,
    private usuariosService: UsuarioService,
    private fileUploadService: FileUploadService
  ) { 
    this.usuario = usuariosService.usuario;
  }

  ngOnInit(): void {
    this.perfilForm = this.fb.group({
      nombre: [ this.usuario.nombre, Validators.required ],
      email: [ this.usuario.email, [ Validators.required, Validators.email ] ]
    });
  }

  actualizarPerfil() {
    console.log(this.perfilForm.value);
    this.usuariosService.actualizarPerfil(this.perfilForm.value)
        .subscribe( (resp: any) => {
          console.log(resp);
          const { nombre, email } = resp.usuarioActualizado;
          this.usuario.nombre = nombre;
          this.usuario.email = email;

          Swal.fire('Guardado', 'Los cambios fueron guardados exitosamente', 'success');
        }, (err) => {
          Swal.fire('Error', err.error.msg, 'error');
        });
  }

  cambiarImagen( file: File ) {

    this.imagenSubir = file;

    if ( !file ) { 
      return this.imgTemp = null;
    }

    const reader = new FileReader();
    reader.readAsDataURL( file );

    reader.onloadend = () => {
      this.imgTemp = reader.result;
    }

  }

  subirImagen() {
    this.fileUploadService.actualizarFoto(this.imagenSubir, 'usuarios', this.usuario.uid)
      .then( img => {
        this.usuario.img = img,
        Swal.fire('Actualizado', 'Imagen actualizada exitosamente', 'success');
      }, (err) => {
        Swal.fire('Error', 'No se pudo subir la imagen', 'error');
      });
  }

}
