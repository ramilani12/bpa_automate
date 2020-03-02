import { Component, OnInit , OnDestroy, AfterViewInit, ElementRef, Inject, ViewChild} from '@angular/core';
import { RpaService} from '../services/rpa.services'
import { Agente } from '../model/agente.model';
import { Workflow } from '../model/workflow.model';
import { Observable } from 'rxjs';
import 'rxjs/add/observable/interval'
import 'rxjs' 
import * as moment from 'moment';
import 'rxjs/add/operator/takeUntil'
import { Subject } from 'rxjs/Subject';
import * as jQuery from 'jquery'

@Component({
  selector: 'app-execucoes-encerradas',
  templateUrl: './execucoes-encerradas.component.html',
  styleUrls: ['./execucoes-encerradas.component.css'],
  providers: [RpaService]
})
export class ExecucoesEncerradasComponent implements OnInit, OnDestroy , AfterViewInit {

  private onDestroy$ = new Subject<void>();
  execucoesEncerradas : Workflow []
  loadingExecsEncerradas : boolean 
  
  @ViewChild('ultimasExecucoes')  elUltimasExecucoes: ElementRef;

  constructor(private rpaService : RpaService) {
  }

  ngOnInit() {

    //Cada 5min busca as ultimas execucoes encerradas
    let observerExecucoesEncerradas = Observable.interval(120000).takeUntil(this.onDestroy$)
 
    //Primeira execucao
    this.buscarExecucoesEncerradas(0,10)

    observerExecucoesEncerradas.subscribe((intervalo: number)=>{
      this.buscarExecucoesEncerradas(0,10)
    })   

 }

  public buscarExecucoesEncerradas(indexStart : number , indexEnd : number) : void {
    
    this.loadingExecsEncerradas = true

    this.rpaService.getExecucoesEncerradas(indexStart,indexEnd)
      .then((execucoesEncerradas : Workflow[])=> {
        this.execucoesEncerradas = execucoesEncerradas
        this.loadingExecsEncerradas = false
        
      })
      .catch((error : any)=>{
        console.log(error)
      })
  }

  ngOnDestroy(){
    this.onDestroy$.next();
  }

  ngAfterViewInit() {    
    
      /* JqueryEasyTicker */
      (<any>$)( document ).ready(function() {
          (<any>$)('#ultimasExecucoes').easyTicker({
            visible: 1,
            interval: 8000
          });
      });   
  
  }

}
