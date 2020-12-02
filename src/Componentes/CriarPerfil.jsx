

import React from 'react'
import axios from 'axios';
import "./css/style.css"
import Header from './Header'

export default class CriarPerfil extends React.Component {



    state = {
        permissoes: [],
        codigosPermissoes: [],
        permissaoSelecionada: "",
        idParaRemover: [],
        listaPermissoesAuxiliar: [],
        tipoPerfil: "",
        mensagemRetorno: ""
    }

    criarPerfil(state) {
        if (state.tipoPerfil == "") {
            this.setState({ mensagemRetorno: "O nome do perfil deve ser peenchido!" })
            this.mostraMensagem()
        }
        else if (state.codigosPermissoes == "") {
            this.setState({ mensagemRetorno: "Para criar o perfil é necessário no minimo uma permissão!" })
            this.mostraMensagem()
        } else {

            axios.post(window.env.API_PA + '/v0/portal/perfil', {
                tipoPerfil: state.tipoPerfil,
                listaPermissoes: state.codigosPermissoes
            })
                .then((response) => {
                    if (response.status == 201) {
                        this.setState({ mensagemRetorno: "Perfil criado com sucesso!" })
                        this.mostraMensagem()
                        this.gravarLog('PERFIL CRIADO, TIPO_PERFIL:: ' + state.tipoPerfil + ' PERMISSOES:: ' + state.codigosPermissoes)
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
            setTimeout(() => {
                this.removerPermissao(state.codigosPermissoes)
                this.setState({ codigosPermissoes: [] });
                this.setState({ idParaRemover: [] });
                this.setState({ listaPermissoesAuxiliar: [] });
                this.setState({ tipoPerfil: "" });
            }, 300)
        }
    }

    async componentDidMount() {
        const response = axios.get(window.env.API_PA + '/v0/portal/permissoes');
        this.setState({ permissoes: (await response).data.permissoes })
        this.setState({ permissaoSelecionada: (await response).data.permissoes[0].codigoPermissao })
    }

    inserirNomePerfil(e) {
        this.setState({ tipoPerfil: e.target.value })
    }

    adicionarPermissao(e) {
        try {
            if (this.state.codigosPermissoes.includes(this.state.permissaoSelecionada) == false) {
                document.getElementById(this.state.permissaoSelecionada).style.display = 'block';
                setTimeout(() => {
                    var novaPermissao = this.state.codigosPermissoes.concat(this.state.permissaoSelecionada);
                    this.setState({ codigosPermissoes: novaPermissao });
                }, 100)
            }
        } catch (e) {
            console.log(e);
        }
    }

    adicionarTodasPermissoes() {
        const { permissoes } = this.state;
        var codigosPermissoes = [];
        try {
            for (var i = 0; i < permissoes.length; i++) {
                document.getElementById(permissoes[i].codigoPermissao).style.display = 'block'
            }
            for (var p of permissoes) {
                codigosPermissoes.push(p.codigoPermissao);
            }
            setTimeout(() => {
                this.setState({ codigosPermissoes: codigosPermissoes });
            }, 200)

        } catch (e) {
            console.log(e);
        }
    }

    removerPermissao(listaIdParaRemover) {
        try {
            var codPermissao = this.state.codigosPermissoes;
            var listaAuxiliar = []
            var listaPermissoesAuxiliar = []
            for (var p of codPermissao) {
                if (this.state.idParaRemover.includes(p) == false) {
                    listaAuxiliar = listaAuxiliar.concat(p);
                    listaPermissoesAuxiliar = listaAuxiliar
                }
            }
            const divPai = document.getElementById("caixaSelecao")
            for (var i = 0; i < divPai.children.length; i++) {
                if (divPai.children[i].classList.contains('divPermissaoSelecionada') === true) {
                    var childId = divPai.children[i].id
                    document.getElementById(childId).style.display = 'none'
                    divPai.children[i].classList.remove('divPermissaoSelecionada')
                }
            }
            listaIdParaRemover = [];
            setTimeout(() => {
                this.setState({ codigosPermissoes: [] });
                this.setState({ idParaRemover: listaIdParaRemover })
                this.setState({ codigosPermissoes: listaPermissoesAuxiliar })
            }, 300)
        } catch (e) {
            console.log(e);
        }

    }

    permissaoSelecionada(e) {
        this.setState({ permissaoSelecionada: e.target.value })
    }

    pegarIdPermissao(id) {
        var idPermissao = document.getElementById(id);
        idPermissao.classList.toggle("divPermissaoSelecionada");
        const permissoes = document.querySelectorAll("#caixaSelecao .divPermissaoSelecionada")
        for (const p of permissoes) {
            if (this.state.idParaRemover.includes(p.id) == false) {
                var listaIdParaRemover = this.state.idParaRemover.concat(p.id);
                this.setState({ idParaRemover: listaIdParaRemover })
            }
        }
    }

    mostraMensagem() {
        try {
            if (this.state.mensagemRetorno == "Perfil criado com sucesso!") {
                document.querySelector("#mensagemRetornoPerfil h6").style.color = "green"
            } else {
                document.getElementById('labelRetorno').style.color = "red"
            }
            document.getElementById('mensagemRetornoPerfil').style.display = 'block'

            var mensagemRetornoPerfil = document.getElementById('mensagemRetornoPerfil')
            if (mensagemRetornoPerfil != null) {
                setTimeout(() => {
                    mensagemRetornoPerfil.style.display = 'none'
                    this.setState({ mensagemRetorno: "" })
                }, 2000)
            }
        }
        catch (e) {
            console.log(e)
        }
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
        const { permissoes, permissaoSelecionada, idParaRemover, tipoPerfil, mensagemRetorno } = this.state;
        return (
            <div className="fundo" >
                <Header opcao="Voltar"/>
                <div id="conteudo">
                    <div id="formPerfil">
                        <div className="headerForm"><h2>Criar Perfil</h2></div>
                        <div id="mensagemRetornoPerfil"><h6 id="labelRetorno"><i class="fas fa-envelope"></i>&nbsp;{mensagemRetorno}</h6></div>
                        <label id="labelPerfil">Digite o nome do perfil:</label>
                        <input value={tipoPerfil} className="inputTexto , campoNome" placeholder="Nome do perfil..." onChange={e => this.inserirNomePerfil(e)} maxLength='20'></input>
                        <label id="labelPermissao">Selecione as permissões:</label>
                        <select id="selectPermissao" value={permissaoSelecionada} onChange={e => this.permissaoSelecionada(e)}>
                            {permissoes.map(
                                permissao => (
                                    <option>{permissao.codigoPermissao}</option>
                                )
                            )}
                        </select>
                        <button value="Adicionar tudo" onClick={e => this.adicionarTodasPermissoes(e)} id="btnAdicionarTudo"><p>Adicionar Tudo</p></button>
                        <div id="setas">
                            <div id="setaBaixo" onClick={e => this.adicionarPermissao(e)}><i class="fas fa-arrow-down fa-lg" ></i></div>
                            <div id="setaCima" onClick={e => this.removerPermissao(idParaRemover)}><i class="fas fa-arrow-up fa-lg"></i></div>
                        </div>
                        <div id="caixaSelecao">
                            {
                                permissoes.map(
                                    permissao => (
                                        <div id={permissao.codigoPermissao} className="divPermissao , permissaoHidden" onClick={e => this.pegarIdPermissao(permissao.codigoPermissao)}><h4>{permissao.codigoPermissao}</h4></div>
                                    )
                                )
                            }
                        </div>
                        <div className="footerForm">
                            <button id="btnCriarPerfil" onClick={e => this.criarPerfil(this.state)}>Criar</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}