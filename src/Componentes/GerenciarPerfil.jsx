import React, { Fragment } from 'react'
import ReactDOM from 'react-dom'
import Header from './Header'
import './css/style.css';
import axios from 'axios'
import { history } from './Historico'


export default class GerenciarPerfil extends React.Component {

    state = {
        perfis: [],
        parametroDaBusca: "",
    }


    async componentDidMount() {
        const response = axios.get(window.env.API_PA + '/v0/portal/perfis')
        this.setState({ perfis: (await response).data.perfis })
    }

    buscarPerfil() {
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

    redirecionarAtualizarPerfil(perfil) {
        history.push({
            pathname: "/portalorb/atualizar/perfil",
            state: { nomePerfil: perfil.perfil }
        })
    }

    quebrarLinhas(permissoes) {
        var permissoesFormatadas = []

        for (var i = 0; i < permissoes.length; i++) {
            permissoesFormatadas.push(permissoes[i] + ", ")
        }

        return permissoesFormatadas
    }

    async deletarPerfil(id, perfil) {
        try {
           var result =  window.confirm('Deseja mesmo deletar essa permissão?')

           if(result){
            axios.delete(window.env.API_PA +'/v0/portal/perfil', {
                data: { id: id }
            }
            )
                .then((response) => {
                    if (response.status === 200) {
                        console.log('perfil deletado com sucesso!')
                        document.location.reload(true)
                        this.gravarLog('PERFIL DELETADO ID:: ' + perfil)
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });        
        }                    
           }           
        catch (e) {
            console.log(e)
        }
    }

    render() {
        const { perfis, parametroDaBusca } = this.state
        return (
            <Fragment>
                <Header opcao='Voltar' />
                <div id="gerenciarPerfis">
                    <div>
                        <input type='text' value={parametroDaBusca} onKeyUp={this.buscarPerfil()} onChange={e => this.alterarParametroBusca(e)} placeholder='Digite o paramêtro a ser buscado...'></input>
                        <table class="table table-striped">
                            <thead>
                                <tr>
                                    <th scope="col">PERFIL</th>
                                    <th scope="col">PERMISSÕES</th>
                                    <th></th>
                                    <th></th>
                                </tr>
                            </thead>
                            {perfis.map(
                                perfil => (
                                    <tbody>
                                        <tr className='classParaBuscar'>
                                            <th key={perfil.perfil} scope="row">{perfil.perfil}</th>
                                            <td id="permissoesTd" scope="row">{this.quebrarLinhas(perfil.permissoes)}</td>
                                            <div>
                                                <td><button className='novoBtnPadrao' onClick={e => this.redirecionarAtualizarPerfil(perfil)}>Atualizar</button></td>
                                                <td><button className='novoBtnPadraoDelete' onClick={e => this.deletarPerfil(perfil.id, perfil.perfil)}>Deletar</button></td>
                                            </div>
                                            <td></td>
                                        </tr>
                                    </tbody>
                                )
                            )}
                        </table>
                    </div>
                </div>
            </Fragment>)
    }
}
