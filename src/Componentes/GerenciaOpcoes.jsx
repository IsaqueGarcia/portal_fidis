import React from 'react';
import ReactDOM from 'react-dom';
import Header from './Header';
import './css/style.css';
import { history } from './Historico'

export default class GerenciaOpcoes extends React.Component {

    state = {
        permissoes: this.props.location.state.permissoes 
    }


    componentDidMount() {
        this.ativarCard()
    }

    ativarCard() {
        if (this.state.permissoes.includes("ADM")) {
            document.querySelectorAll(".containerGerenciaOpcao div").forEach(function (div) {
                var id = div.id
                if (id != "") {
                    document.getElementById(id).style.display = 'block'
                }
            })
        }
        if (!this.state.permissoes.includes("ADM")) {
            document.querySelectorAll(".containerGerenciaOpcao div").forEach((div) => {
                var id = div.id
                if (id != "") {
                    if (this.state.permissoes.includes(id)) {
                        document.getElementById(id).style.display = 'block'
                    }
                }
            })
        }
    }

    setRota(valor) {
        if (valor == 'gerenciaOpcoesUsuario') {
            history.push({
                pathname:'/portalorb/opcoes/usuario',
                state:{permissoes : this.state.permissoes}
            })
        } 
    }

    render() {
        return (
            <div className="fundo">
                <Header opcao="Sair"></Header>
                <div className="containerGerenciaOpcao">
                    <div id="GERENCIA_OPCOES_USUARIO" className="quadroOpcao quadroGerenciaOpcoesUsuario" onClick={e => this.setRota('gerenciaOpcoesUsuario')} >
                        <div className="tituloQuadro"><h5>Módulos Usuário</h5></div>
                    </div>
                </div>
            </div>
        );
    }
}