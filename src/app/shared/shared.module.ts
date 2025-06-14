import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// Importar todos los componentes compartidos
import { HeaderComponent } from './components/header/header.component';
// import { LoadingComponent } from './components/loading/loading.component';
// import { ModalComponent } from './components/modal/modal.component';
// import { SidebarComponent } from './components/sidebar/sidebar.component';

@NgModule({
  declarations: [
    // No declaramos nada aquí porque estamos usando standalone components
  ],
  imports: [
    CommonModule,
    RouterModule,
    // Importar los standalone components
    HeaderComponent,
    // LoadingComponent,
    // ModalComponent,
    // SidebarComponent
  ],
  exports: [
    // Exportar para uso en otros módulos
    CommonModule,
    RouterModule,
    HeaderComponent,
    // LoadingComponent,
    // ModalComponent,
    // SidebarComponent
  ]
})
export class SharedModule { }

// También exportar individualmente para imports directos en standalone components
export {
  HeaderComponent,
//   LoadingComponent,
//   ModalComponent,
//   SidebarComponent
};