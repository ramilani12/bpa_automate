import { Component, OnInit , OnDestroy} from '@angular/core';
import { RpaService} from '../services/rpa.services'
import { Agente } from '../model/agente.model';
import { Workflow } from '../model/workflow.model';
import { Observable } from 'rxjs';
import 'rxjs/add/observable/interval'
import 'rxjs' 
import * as moment from 'moment';
import { ProximaExecucao} from '../model/proxima.execucao.model'
import 'rxjs/add/operator/takeUntil'
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-execucoes',
  templateUrl: './execucoes.component.html',
  styleUrls: ['./execucoes.component.css'],
  providers: [RpaService]
})
export class ExecucoesComponent implements OnInit , OnDestroy{

  private onDestroy$ = new Subject<void>();

  agentes : Agente []
  proximasExecucoes : ProximaExecucao[]
  
  loadingExecs : boolean 
  loadingProxExecs : boolean 

  constructor(private rpaService : RpaService) { 
  }

  ngOnInit() {

    this.capturarExecucoes()
    //Cada 1,5min busca as execucoes correntes
    let observerExeucoes = Observable.interval(90000).takeUntil(this.onDestroy$)
    observerExeucoes.subscribe((intervalo: number)=>{
      this.loadingExecs = true
      this.capturarExecucoes()
    })

    //Cada 5min busca as proximas execucoes correntes
    let observerProximas = Observable.interval(300000).takeUntil(this.onDestroy$)
    this.buscarProxmasExecucoes(0,9)
    observerProximas.subscribe((intervalo : number ) => { 
      this.buscarProxmasExecucoes(0,9)
    })  

  }

  public buscarProxmasExecucoes(indexStart : number , indexEnd : number) : void {
      this.loadingProxExecs = true

      //Buscando as Proximas Execucoes
      this.rpaService.getProximasExecucoes(indexStart, indexEnd )
        .then((proximas : ProximaExecucao[]) => {
          this.proximasExecucoes = proximas
          setTimeout(()=>{ this.loadingProxExecs = false},7000)
        })
  
  }

  public capturarExecucoes() : void {
      this.loadingExecs = true  
      this.rpaService.getAgentes()
        .then((agentes : Agente[]) => {
          this.agentes = agentes
          setTimeout(()=>{ this.loadingExecs = false},7000)
        })
        .catch((error : any)=> {
          console.log("Error",error)
        })
  }

  ngOnDestroy() {
    this.onDestroy$.next();
  }

}
