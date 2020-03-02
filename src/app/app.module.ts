import { BrowserModule } from '@angular/platform-browser';
import { NgModule , LOCALE_ID } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TopoComponent } from './topo/topo.component';
import { RodapeComponent } from './rodape/rodape.component';
import { ExecucoesComponent } from './execucoes/execucoes.component';
import { HttpClientModule } from '@angular/common/http';
import {InterceptorModule} from './util/interceptor.module'
import { NgMarqueeModule } from 'ng-marquee';
import { ThemeModule } from './theme/theme.module';
import { lightTheme } from './theme/light-theme';
import { darkTheme } from './theme/dark-theme';

/* Fix for Locale PT-BR*/ 
import { registerLocaleData } from '@angular/common';
import ptBr from '@angular/common/locales/pt';
import { ExecucoesEncerradasComponent } from './execucoes-encerradas/execucoes-encerradas.component';
registerLocaleData(ptBr)

@NgModule({
  declarations: [
    AppComponent,
    TopoComponent,
    RodapeComponent,
    ExecucoesComponent,
    ExecucoesEncerradasComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    InterceptorModule,
    NgMarqueeModule,
    ThemeModule.forRoot({
      themes: [lightTheme, darkTheme],
      active: 'light'
    })
  ],
  providers: [ { provide: LOCALE_ID , useValue: 'pt' } ],
  bootstrap: [AppComponent]
})
export class AppModule { }
