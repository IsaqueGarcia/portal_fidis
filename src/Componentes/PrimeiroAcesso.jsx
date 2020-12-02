import React from 'react'
import ReactDOM from 'react-dom'
import {history} from './Historico'
import axios from 'axios' 
import Header from './Header'

export default class PrimeiroAcesso extends React.Component{

    state = {
        login: this.props.location.state.login,
        senha: "",
        confirmarSenha:""
    }

    trocaSenha(state){
        if(state.senha == "" || state.confirmarSenha == ""){
            return alert("Os campos senha e confirmação de senha devem ser preenchidos.")
        }
        if(state.senha != state.confirmarSenha){
           return alert("A senha e a confirmação de senha devem ser iguais!")
        }
        axios.put(window.env.API_PA + "/v0/portal/usuario/primeiroacesso",{
            login: state.login,
            novaSenha: state.senha,
            confirmarNovaSenha: state.confirmarSenha
        }).then(response =>{
            if(response.status == 200){
                history.push('/portalorb/home')
            }
        }).catch(error =>{
            console.log(error)
        })
    }

    setSenha(e){
        this.setState({ senha: e.target.value})
    }

    setConfirmarSenha(e){
        this.setState({ confirmarSenha: e.target.value})
    }

    apertouEnter(e){
        if(e.keyCode == 13){
            this.trocaSenha(this.state);
        }
    }

    render(){
        const { login, senha, confirmarSenha} = this.state
        return(
            <div className="fundo">
            <Header opcao="Voltar" />
            <div className="container">
                <div className="boxAlterar">
                    <div className="loginTopo"><h3>Alterar senha</h3></div>
                    <input className="inputLogin" disabled='true' type="text" placeholder="Login" value={login}></input>
                    <input className="inputLogin" type="password" placeholder="Nova senha" value={senha} onChange={e => this.setSenha(e)}></input>
                    <input className="inputLogin" type="password" placeholder="Confirmar senha" value={confirmarSenha} onChange={e => this.setConfirmarSenha(e)}></input>

                    <button className="btnPadrao" onClick = {e => this.trocaSenha(this.state)}>Alterar</button>
                    <p>&nbsp;</p>
                </div>
            </div>
            <span>{onkeydown = e => this.apertouEnter(e)} </span>
        </div>
        )
    }
}