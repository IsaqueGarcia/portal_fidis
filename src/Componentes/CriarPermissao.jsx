import React from 'react'
import ReactDOM from 'react-dom'
import "./css/style.css"
import axios from 'axios';
import Header from './Header'

export default class CriarPermissao extends React.Component {

    state = {
        codigoPermissao: "",
        descricaoPermissao: "",
        mensagemRetorno: ""
    }

    limpaCampo() {
        document.getElementById('nomePermissao').value = "";
        document.getElementById('descricaoPermissao').value = "";
        this.setState({ codigoPermissao: "", descricaoPermissao: "" })
    }

    mostraMensagem() {
        try {
            setTimeout(() => {
                if (this.state.mensagemRetorno == "Permissão criada com sucesso!") {
                    document.getElementById('labelRetorno').style.color = "green"
                } else {
                    document.getElementById('labelRetorno').style.color = "red"
                }
                document.getElementById('mensagemRetornoPermissao').style.display = 'block'

                var mensagemRetornoPermissao = document.getElementById('mensagemRetornoPermissao')
                if (mensagemRetornoPermissao != null) {
                    setTimeout(() => {
                        mensagemRetornoPermissao.style.display = 'none'
                        this.setState({ mensagemRetorno: "" })
                    }, 2000)
                }
            }, 500)
        } catch (e) {
            console.log(e)
        }
    }


    criarPermissao(state) {
        if (state.codigoPermissao == "") {
            this.setState({ mensagemRetorno: "O Código da permissão não pode ser nulo" })
            this.mostraMensagem();
        }
        if (state.descricaoPermissao == "") {
            this.setState({ mensagemRetorno: "O campo descrição da permissão precisa ser preenchido" })
            this.mostraMensagem();
        }
        axios.post(window.env.API_PA + '/v0/portal/permissoes', {
            codigoPermissao: state.codigoPermissao,
            descricaoPermissao: state.descricaoPermissao
        })
            .then((response) => {
                if (response.status == 201) {
                    this.limpaCampo();
                    this.setState({ mensagemRetorno: "Permissão criada com sucesso!" })
                    this.mostraMensagem();
                    this.gravarLog('PERMISSAO CRIADA, NOME:: ' + state.codigoPermissao)
                }
            })
            .catch((error) => {
                console.log(error.response.data.mensagemRetorno)
                if (error.response.data.mensagemRetorno == "Permissão ja existente!") {
                    this.setState({ mensagemRetorno: "Permissão ja existente!" })
                    this.mostraMensagem();
                }
            });
    }

    inserirCodigoPermissao(e) {
        this.setState({ codigoPermissao: e.target.value })
    }

    inserirDescricaoPermissao(e) {
        this.setState({ descricaoPermissao: e.target.value })
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

        const { codigoPermissao, descricaoPermissao, mensagemRetorno } = this.state
        return (
            <div className="fundo">
                <Header opcao="Voltar" />
                <div className="container">
                    <div id="mensagemRetornoPermissao"><h6 id="labelRetorno"><i class="fas fa-envelope"></i>&nbsp;{mensagemRetorno}</h6></div>
                    <div id="formPermissao">
                        <div id="criarPermissao"><h3>Criar permissão</h3></div>
                        <div className="formatacaoTela">
                            <input id="nomePermissao" maxLength="45" className="inputTexto" value={codigoPermissao} onChange={e => this.inserirCodigoPermissao(e)} type="text" placeholder="Nome da permissão..."></input>
                            <textarea id="descricaoPermissao" className="campoMensagem" value={descricaoPermissao} onChange={e => this.inserirDescricaoPermissao(e)} placeholder="Descrição da permissão..."></textarea>
                            <button className="btnPadrao" onClick={e => this.criarPermissao(this.state)}>Criar</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}