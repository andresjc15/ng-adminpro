import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Grafica1Component } from './grafica1/grafica1.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProgressComponent } from './progress/progress.component';
import { PromesasComponent } from './promesas/promesas.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { RxjsComponent } from './rxjs/rxjs.component';
import { PerfilComponent } from './perfil/perfil.component';
import { UsuariosComponent } from './mantenimientos/usuarios/usuarios.component';
import { HospitalesComponent } from './mantenimientos/hospitales/hospitales.component';
import { MedicosComponent } from './mantenimientos/medicos/medicos.component';
import { MedicoComponent } from './mantenimientos/medicos/medico.component';
import { BusquedasComponent } from './busquedas/busquedas.component';
import { AdminGuard } from '../guards/admin.guard';


const childRoutes: Routes = [
  { path: '', component: DashboardComponent, data: { titulo: 'Dashboard' } },
            { path: 'grafica1', component: Grafica1Component, data: { titulo: 'Grafica' }  },
            { path: 'rxjs', component: RxjsComponent, data: { titulo: 'rxjs' } },
            { path: 'progress', component: ProgressComponent, data: { titulo: 'Progress' }  },
            { path: 'promesas', component: PromesasComponent, data: { titulo: 'Promesas' }  },
            { path: 'account-settings', component: AccountSettingsComponent, data: { titulo: 'Ajustes' }  },
            { path: 'perfil', component: PerfilComponent, data: { titulo: 'Perfil de usuario' } },
            { path: 'buscar/:termino', component: BusquedasComponent, data: { titulo: 'Buscar' } },

            // Mantenimientos
            { path: 'hospitales', component: HospitalesComponent, data: { titulo: 'Hospitales' } },
            { path: 'medicos', component: MedicosComponent, data: { titulo: 'Medicos' } },
            { path: 'medicos/:id', component: MedicoComponent, data: { titulo: 'Medicos' } },

            // Admin routes
            { path: 'usuarios', canActivate: [ AdminGuard ], component: UsuariosComponent, data: { titulo: 'Usuarios de la aplicación' } },
]


@NgModule({
  declarations: [],
  imports: [ RouterModule.forChild(childRoutes) ],
  exports: [ RouterModule ]
})
export class ChildRoutesModule { }
