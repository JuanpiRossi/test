import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { PagesComponent } from './pages/pages.component';
import { PagesModule } from './pages/pages.module';
import { FooterComponent } from './footer/footer.component';

@NgModule({
  imports: [
    CommonModule,
    PagesModule
  ],
  declarations: [HeaderComponent, FooterComponent],
  exports: [HeaderComponent,PagesComponent,FooterComponent]
})
export class CoreModule { }
