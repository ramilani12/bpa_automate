import { Workflow } from './workflow.model';

export class ProximaExecucao {

    constructor(public  workFlow : Workflow,public tipoAgendamento : string , public proximaExecucao: Date){}
}