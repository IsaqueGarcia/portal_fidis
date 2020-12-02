import React from 'react';
import ReactDOM from 'react-dom';
import './css/style.css'
import { history } from './Historico'
import axios from 'axios'
import Header from './Header'


export default class EsqueceuSenha extends React.Component {

    state = {
        login: "",
        confimacao: ""
    }

    setLogin(e) {
        this.setState({ login: e.target.value })
    }
    setConfirmacao(e) {
        this.setState({ confimacao: e.target.value })
    }


    enviaCodigoConfirmacao(state) {
        axios.post(window.env.API_PA + "/v0/portal/usuario/recuperarsenha", {
            login: state.login,
            confirmacao: state.confimacao
        }).then(response => {
            if (response.status == 201) {
                    document.getElementById("codConfirmacao").disabled = false;
            }
            if (response.data.mensagemRetorno == "Código de confirmação válido.") {
                history.push({
                    pathname: "/portalorb/primeiroacesso",
                    state: { login: this.state.login }
                })
            }
        }).catch(error => {
            console.log(error)
        })
    }

    apertouEnter(e){
        if(e.keyCode == 13){
            this.enviaCodigoConfirmacao(this.state);
        }
    }

    render() {
        const { login, codigoConfirmacao } = this.state
        return (
            <div className="fundo">
                <Header opcao="Voltar" />
                <div className="container">
                    <div className="box">
                        <div className="loginTopo"><h3>Recuperar senha</h3></div>
                        <input className="inputLogin" type="login" placeholder="Login" value={login} name={login} onChange={e => this.setLogin(e)}></input>
                        <input className="inputLogin" id="codConfirmacao" type="password" disabled="true" value={codigoConfirmacao} onChange={e => this.setConfirmacao(e)} placeholder="Confimação"></input>
                        <div className="formataBotao">
                            <button className="btnPadrao" onClick={e => this.enviaCodigoConfirmacao(this.state)}>Enviar</button>
                        </div>
                    </div>
                </div>
                <span>{onkeydown = e => this.apertouEnter(e)} </span>
            </div>
        )
    }
}