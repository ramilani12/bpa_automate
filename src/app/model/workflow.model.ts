import {Agente} from './agente.model'

export class Workflow {
    
    public idWorkflow : string = ''
    public nomeWorkFlow : string = ''
    public nomeTask: string = ''
    public dataInicioWf : Date
    public dataEncerramentoWf : Date
    public resultadoExecucao : string
    public executouWfComSucesso : boolean
    public agente : Agente

    constructor( ){
    }
 
   public exibeSucessoExecucao() : string{
        if (this.executouWfComSucesso){
            return 'sucesso'
        } else{
            return 'falha'
        }
    }

}