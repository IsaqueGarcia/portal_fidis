import React, { Fragment } from 'react'
import ReactDOM from 'react-dom'
import Header from './Header'
import './css/style.css';
import axios from 'axios'
import { history } from './Historico'

export default class GerenciarUsuarios extends React.Component {
    state = {
        usuarios: [],
        parametroDaBusca: "",
        numeroDocumento: ""
    }

    async componentDidMount() {
        const response = axios.get(window.env.API_PA +'/v0/portal/usuario/todos')
        this.setState({ usuarios: (await response).data.usuarios })

    }

    redirecionarAtualizar(numeroDocumento) {
        history.push(
            {
                pathname: '/portalorb/atualizar/usuario',
                state: { numeroDocumento: numeroDocumento }
            })
    }



    deletarUsuario(numeroDocumento) {
        axios.delete(window.env.API_PA + '/v0/portal/usuario/' + numeroDocumento)
            .then((response) => {
                if (response.status === 200) {
                    document.location.reload(true)
                    this.gravarLog('USUARIO DELETADO, NUMERO_DOCUMENTO:: ' + numeroDocumento)
                }
            })
            .catch((error) => {
                if(error.response.data.mensagemRetorno == 'O Status do usuário se encontra ativo!'){
                    alert('O Status do usuário se encontra ativo!')
                }
            })
    }


    buscarUsuario() {
        try {
            var valorBusca = this.state.parametroDaBusca.toLowerCase();
            document.querySelectorAll(".classParaBuscar").forEach(function (tag) {
                var nomePerfil = tag.textContent;
                var corresponde = nomePerfil.toLowerCase().indexOf(valorBusca) >= 0;
                if (corresponde) {
                    tag.style.display = ''
                } else {
                    tag.style.display = 'none'
                }
            });
        }
        catch (e) {
            console.log(e)
        }
    }

    alterarParametroBusca(e) {
        this.setState({ parametroDaBusca: e.target.value })
        console.log(this.state.parametroDaBusca)
    }


    gravarLog(atividade) {
        axios.post(window.env.API_PA + '/v0/portal/log', {
            usuario: sessionStorage.getItem('userToken'),
            atividade: atividade
        })
            .then((response) => {
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    render() {
        const { usuarios } = this.state
        return (
            <Fragment>
                <Header opcao = 'Voltar'/>
                <div id="gerenciarUsuario">
                    <div>
                        <input type='text'  onKeyUp={this.buscarUsuario()} onChange={e => this.alterarParametroBusca(e)}  placeholder='Digite o paramêtro a ser buscado...'></input>
                        <table class="table table-striped">
                            <thead>
                                <tr>
                                    <th scope="col">USUÁRIO</th>
                                    <th scope="col">LOGIN</th>
                                    <th scope="col">EMAIL</th>
                                    <th scope="col">NÚMERO DO DOCUMENTO</th>
                                    <th scope="col">CELULAR</th>
                                    <th scope="col">DDD</th>
                                    <th scope="col">DDI</th>
                                    <th></th>
                                </tr>
                            </thead>
                            {usuarios.map(
                                usuario=> (
                                    <tbody>
                                        <tr className = 'classParaBuscar'>
                                            <td>{usuario.nomeUsuario}</td>
                                            <td>{usuario.login}</td>
                                            <td>{usuario.email}</td>
                                            <td>{usuario.numeroDocumento}</td>
                                            <td>{usuario.numCelular}</td>
                                            <td>{usuario.ddd}</td>
                                            <td>{usuario.ddi}</td>
                                            <div>
                                                <td><button className='novoBtnPadrao'  onClick={e => this.redirecionarAtualizar(usuario.numeroDocumento)}>Atualizar</button></td>
                                                <td><button className="novoBtnPadraoDelete" onClick={e => this.deletarUsuario(usuario.numeroDocumento)}>Deletar</button></td>
                                            </div>
                                        </tr>
                                    </tbody>
                                )
                            )}
                        </table>
                    </div>
                </div>
            </Fragment>
            
         )
    }

}
