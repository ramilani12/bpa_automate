import { Workflow} from '../model/workflow.model'

export class Agente {
    
    public workFlow: Workflow
    public idAgente : string
    public nomeAgente : string 
    public ativo : boolean
    public online : boolean
    public estadoAtual : string

    constructor(){
    }

    public exibeImgOnline() : string {
        if (this.online){
            return 'assets/img/green.png'
        } else{
            return 'assets/img/red.png'
        }
    }

    public exibeImgEstadoAtual() : string {
        if (this.estadoAtual === 'Running'){
            return 'assets/img/robot_wk.png'
        }else{
            return 'assets/img/robot_not_wk.png'
        }
    }

    public exibeTituloOnline() : string{
        
        if (this.online){
            return 'Agente Ativo/Online'
        } else{
            return 'Agente Desativado'
        }
    }

    public exibeTituloEstadoAtual() : string {
        if (this.estadoAtual === 'Running'){
            return 'Robô Trabalhando'
        }else{
            return 'Robô Ocioso'
        }
    }

    

}