import { HttpClient , HttpResponse , HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs';
import { URL_API,USER_CREDENTIALS } from '../util/app.api'
import { Agente } from '../model/agente.model'
import { ProximaExecucao } from '../model/proxima.execucao.model'
import { Workflow } from '../model/workflow.model'
import 'rxjs' 
import * as moment from 'moment';
import 'rxjs/add/operator/retry'
import { AngularWaitBarrier } from 'blocking-proxy/built/lib/angular_wait_barrier';

@Injectable()
export class RpaService {

    private execucoesEncerradas: Workflow[]

    constructor(private http: HttpClient) {}

    /**
     * Busca todos os Agentes e suas respectivas execuções
     */
    public getAgentes(): Promise < any > {

        let agentes = []

        let promise = new Promise((resolve, reject) => {
            return this.http.get(`${URL_API}/agents/list`).retry(5).toPromise()
                .then((responseAgentes: any) => {
                   
                    let countAgenteAtivos = 0
                    if (responseAgentes.Result === 'success' && responseAgentes.Data.length > 0) {
                        responseAgentes.Data.forEach((item: any) => {
                            let estadoAtual: string = ""
                            if (item.Enabled) {
                                
                                countAgenteAtivos++
                                
                                if (item.ActiveInstances > 0) {
                                    estadoAtual = 'Running'
                                }

                                let agente = new Agente()
                                agente.idAgente = item.ID
                                agente.nomeAgente = item.Name
                                agente.ativo = item.Enabled
                                agente.online = item.Online
                                agente.estadoAtual = estadoAtual

                                var workFlow: Workflow = new Workflow()
                                workFlow.idWorkflow =  ''
                                workFlow.nomeTask   = ''
                                workFlow.nomeWorkFlow  = ''

                                agente.workFlow = workFlow

                                //Buscando a Task em Execucao
                                this.getTaskEmExecucao(agente.idAgente)
                                    .then((responseAgente: any) => {

                                        if (responseAgente.Result === 'success' && responseAgente.Data.length > 0) {

                                            let data = responseAgente.Data[0]
                                            workFlow.idWorkflow = data.ConstructID
                                            workFlow.nomeTask = data.ConstructName
                                            
                                            //Buscando o Workflow Referente a Task
                                            this.getWorkflowEmExecucao(workFlow.idWorkflow)
                                                .then((responseWf: any) => {

                                                    if (responseWf.Result === "success" && responseWf.Data.length > 0) {
                                                       for (var i = 0; i < responseWf.Data.length; i++){
                                                           let item = responseWf.Data[i];
                                                           if (item.Enabled) {
                                                                 workFlow.nomeWorkFlow = item.Name
                                                                 break
                                                           }
                                                       }
                                                    }
                                                })
                                                .catch((error: any) => {
                                                    console.error("Erro ao Buscar Workflow pelo ID", workFlow.idWorkflow)
                                                })
                                        }
                                    })
                                    .catch((error: any) => {
                                        console.error("Erro ao Busca Task Em Execuçã pelo ID", agente.idAgente)
                                    })

                                agentes.push(agente)
                                
                                if (agentes.length === countAgenteAtivos ) {
                                     // Objeto esta completo
                                    resolve(agentes.sort(this.sortArray('nomeAgente'))) 
                                }    
                            }
                        })
                    } else {
                            console.log("Não há agentes ativos ",responseAgentes)
                    }
                })
                .catch((error: any) => {
                    console.error("Error Capturar Agentes ",error)
                    reject(error)
                })
        })
        return promise
    }

    /**
     * Busca o Nome da Task em Execução
     * @param agente
     */
    public getTaskEmExecucao(idAgente: string): Promise < any > {
        return this.http.get(`${URL_API}/agents/${idAgente}/running_instances/list`).retry(5).toPromise()
    }

    /**
     * Busca o Nome do Workflow em Execução
     * @param agente B
     */
    public getWorkflowEmExecucao(idWorkflow: string): Promise < any > {
        return this.http.get(`${URL_API}/tasks/${idWorkflow}/workflows/list`).retry(5).toPromise()
    }

    /**
     * Busca as próximas execuções em um determiando range
     * @param indexStart 
     * @param pageSize 
     */
    public getProximasExecucoes(indexStart: number, pageSize: number): Promise < any > {

        let proximasExecucoes = []
        let url = `${URL_API}/calendar/list?start_index=${indexStart}&page_size=${pageSize}&sort_field=NextRunTime`

        let promiseProximasExecucoes = new Promise((resolve, reject) => {

            return this.http.get(url).retry(5).toPromise()
                .then((response: any) => {

                    if (response.Result === 'success' && response.Data.length > 0) {
                        response.Data.forEach((item: any) => {
                            let date = moment(item.NextRunTime).toDate()
                            let workFlow: Workflow = new Workflow()
                            workFlow.idWorkflow = item.WorkflowID
                            workFlow.nomeWorkFlow = item.WorkflowName
                            let proximaExec = new ProximaExecucao(workFlow, item.ScheduleDescription, date)

                            //Buscando o AgentID atraves do WorkflowID da Proxima Execucao
                            this.getAgentIDDaProximaExecucao(workFlow.idWorkflow)
                                .then((responseAgentID: any) => {

                                    if (responseAgentID.Result === 'success' && responseAgentID.Data != null) {
                                        let idAgent = ""
                                        
                                        for (var i = 0;  i < responseAgentID.Data.Items.length; i++){
                                            let id = responseAgentID.Data.Items[i].AgentID
                                            if (id != ""){
                                                idAgent = id
                                                break
                                            }
                                        }
                                       
                                        let agente = new Agente()
                                        agente.idAgente = idAgent
                                        
                                        if (idAgent != "") {

                                                //Buscar o Nome do Agente
                                                this.getAgenteProximaExecucao(idAgent)
                                                .then((responseAgente: any) => {

                                                    if (responseAgente.Result === 'success' && response.Data != null) {
                                                        agente.nomeAgente = responseAgente.Data.Name
                                                    } else {
                                                        agente.nomeAgente = "Sem Agente"
                                                    }

                                                    proximaExec.workFlow.agente = agente
                                                    proximasExecucoes.push(proximaExec)

                                                })
                                                .catch((error: any) => {
                                                    console.log("Erro ao Buscar Agente ", error)
                                                })
                                        } else {
                                            console.error("Erro ao Buscar o Agente pelo Workflow ",workFlow.idWorkflow ,  workFlow.nomeWorkFlow)
                                        }
                                     
                                    }
                                })
                                .catch((error: any) => {
                                    console.log("Erro Buscar ID do Agente pelo WF ", error)
                                })

                        })

                        resolve(proximasExecucoes)
                    }

                })
        })

        return promiseProximasExecucoes
    }

    /**
     * Busca o ID do Agente atrelado ao Worflow pelo seu ID
     * @param idWorkflow 
     */
    public getAgentIDDaProximaExecucao(idWorkflow: string): Promise < any > {
        let url = `${URL_API}/workflows/${idWorkflow}/get`
        return this.http.get(url).retry(5).toPromise()
    }

    /**
     * Busca Dados do Agente através do seu ID
     * @param idAgente 
     */
    public getAgenteProximaExecucao(idAgente: string): Promise < any > {

        let url = `${URL_API}/agents/${idAgente}/get`
        return this.http.get(url).retry(5).toPromise()
    }

    /**
     * Busca as últimas execuções em um determinado range
     * @param indexStart
     * @param pageSize 
     */
    public getExecucoesEncerradas(indexStart: number, pageSize: number): Promise < any > {
        let promise = new Promise((resolve, reject) => {
            let url = `${URL_API}/instances/completed/list?start_index=${indexStart}&page_size=${pageSize}&sort_order=DSC`
            return this.http.get(url)
                .retry(5)
                .toPromise()
                .then((response: any) => {
                    if (response.Result === 'success' && response.Data.length > 0) {
                        this.execucoesEncerradas = []
                        response.Data.forEach((item: any) => {
                            let dataInicioWf = moment(item.StartDateTime).toDate()
                            let dataFimWf = moment(item.EndDateTime).toDate()
                            let w: Workflow = new Workflow()
                            w.idWorkflow = item.ConstructID
                            w.nomeWorkFlow = item.ConstructName
                            w.resultadoExecucao = item.ResultText
                            w.dataInicioWf = dataInicioWf
                            w.dataEncerramentoWf = dataFimWf
                            w.executouWfComSucesso = true

                            if (item.ResultCode != 1) {
                                w.executouWfComSucesso = false
                            }

                            this.execucoesEncerradas.push(w)
                        })
                    }

                    resolve(this.execucoesEncerradas)
                })
                .catch((error: any) => {
                    console.log(error)
                })
        })

        return promise
    }




    /**
     * Ordena um Array baseado na Property
     * @param property 
     */
    private sortArray(property) {
        var sortOrder = 1;
        if (property[0] === "-") {
            sortOrder = -1;
            property = property.substr(1);
        }
        return function(a, b) {
            var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
            return result * sortOrder;
        }
    }
}