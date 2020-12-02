import React from 'react';
import ReactDOM from 'react-dom'
import logo from './imagens/logo-branca.png'
import './css/style.css'
import {history} from './Historico'

export default class Header extends React.Component {
   
    voltar(){
        history.goBack()
        if(this.props.opcao === "Sair"){
            sessionStorage.clear();
        }
    }

    render() {
        return (
            <div>
               <nav className="navegacao">
                    
                    <span className="tituloPrincipal"><img align="left" className="logo" src={logo}/></span>
                    <span className="opcaoSaidaVoltar" onClick = {e => this.voltar()}>{this.props.opcao} {(this.props.opcao) == "Sair" ? <i class="fas fa-sign-out-alt"></i> : (this.props.opcao) == "Voltar" ? <i class="fas fa-undo-alt"></i> : ""}  </span>
               </nav>
            </div>
        )
    }
}